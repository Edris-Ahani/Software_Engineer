<div dir="rtl">

[← فهرست و مسیر یادگیری](../README.md) | [English Version](01_023_zero_downtime_migrations_English.md)

# 023 — مایگریشن‌های اسکیما بدون قطعی (Zero-Downtime Migrations)

## هدف یادگیری
اجرای تغییرات ساختاری پایگاه‌داده (DDL) روی جداول چند ترابایتی بدون قطعی سرویس (Zero-Downtime)؛ ساخت ایندکس‌های غیربلاک‌کننده با `CONCURRENTLY`، اعتبارسنجی دو مرحله‌ای کلیدهای خارجی با `NOT VALID`، تنظیم گاردریل‌های قفل (`lock_timeout`) و پیاده‌سازی الگوی Expand/Contract.

---

## ۱. قانون طلایی تغییر ساختار امن در پروداکشن

> **قانون اول مهندسی پایگاه‌داده:** تمامی اسکریپت‌های مایگریشن در پروداکشن **باید حتماً** دارای سقف زمان قفل باشند تا در صورت شلوغی دیتابیس، ترافیک کاربران مسدود نشود:

```sql
-- Always prefix migrations with lock guardrails:
SET lock_timeout = '2s';       -- اگر قفل در ۲ ثانیه به دست نیامد، دستور لغو شود
SET statement_timeout = '30s';  -- کل اجرای دستور نباید بیش از ۳۰ ثانیه طول بکشد
```
اگر کوئری فعالی مانع اجرای دستور شما شود، اسکریپت فوراً متوقف می‌شود تا صف قفل‌های بلاک‌کننده پشت سر دستور `ACCESS EXCLUSIVE` تشکیل نشود.

---

## ۲. ساخت و حذف ایندکس بدون قطعی با `CONCURRENTLY`

دستور استاندارد `CREATE INDEX` قفل `SHARE` روی جدول می‌گیرد که تمام دستورات `INSERT`، `UPDATE` و `DELETE` را تا پایان پردازش ایندکس متوقف می‌کند!

```sql
-- DANGEROUS: نوشتن روی جدول بزرگ را ساعت‌ها مسدود می‌کند
-- CREATE INDEX idx_orders_status ON store.orders(status);

-- SAFE ZERO-DOWNTIME: ساخت ایندکس در پس‌زمینه در چند پاس
-- فقط قفل SHARE UPDATE EXCLUSIVE می‌گیرد (خواندن و نوشتن بدون توقف ادامه می‌یابد)
CREATE INDEX CONCURRENTLY idx_orders_status ON store.orders(status);

-- حذف امن ایندکس بدون بلاک کردن خواندن و نوشتن:
DROP INDEX CONCURRENTLY idx_orders_status;
```

> **نکته:** دستورات دارای کلمه `CONCURRENTLY` نمی‌توانند درون یک بلوک تراکنش صریح `BEGIN ... COMMIT` قرار گیرند.

---

## ۳. افزودن قیدها بدون قفل کامل جدول با `NOT VALID`

افزودن کلید خارجی (`FOREIGN KEY`) یا قیدهای `CHECK` در حالت عادی به دلیل اعتبارسنجی تمام سطرهای گذشته کل جدول را قفل می‌کند.  
الگوی استاندارد بدون قطعی این فرآیند را به دو مرحله تفکیک می‌کند:

```sql
-- مرحله اول: ثبت قید با برچسب NOT VALID
-- قفل در کسر کوچکی از میلی‌ثانیه گرفته و رها می‌شود!
-- از این لحظه به بعد داده‌های جدید اعتبارسنجی می‌شوند اما سطرهای قبلی هنوز بررسی نشده‌اند.
ALTER TABLE store.orders 
ADD CONSTRAINT fk_orders_user_safe 
FOREIGN KEY (user_id) REFERENCES store.users(id) 
NOT VALID;

-- مرحله دوم: اعتبارسنجی سطرهای تاریخی در پس‌زمینه
-- قفل SHARE UPDATE EXCLUSIVE گرفته می‌شود و عملیات خواندن و نوشتن ادامه می‌یابد!
ALTER TABLE store.orders 
VALIDATE CONSTRAINT fk_orders_user_safe;
```

---

## ۴. افزودن ستون `NOT NULL` به جدول پرحجم بدون قطعی

```sql
-- گام ۱: افزودن ستون بدون قید NOT NULL (در نسخه ۱۱ به بعد این دستور آنی است)
ALTER TABLE store.users ADD COLUMN phone_number VARCHAR(30);

-- گام ۲: افزودن قید CHECK به صورت NOT VALID (آنی)
ALTER TABLE store.users 
ADD CONSTRAINT check_users_phone_not_null 
CHECK (phone_number IS NOT NULL) NOT VALID;

-- گام ۳: اعتبارسنجی سطرهای قدیمی در پس‌زمینه بدون مسدودسازی
ALTER TABLE store.users 
VALIDATE CONSTRAINT check_users_phone_not_null;

-- گام ۴: تبدیل به قید بومی NOT NULL
-- (به دلیل اثبات اعتبارسنجی در گام ۳، این دستور در کمتر از ۱ میلی‌ثانیه اعمال می‌شود!)
ALTER TABLE store.users ALTER COLUMN phone_number SET NOT NULL;

-- گام ۵: حذف قید چک اضافه
ALTER TABLE store.users DROP CONSTRAINT check_users_phone_not_null;
```

---

## ۵. تغییر نام ستون‌ها با الگوی Expand / Contract

تغییر نام مستقیم ستون با دستور `RENAME COLUMN` باعث بروز خطای فوری در پادهای قدیمی اپلیکیشن می‌شود که هنوز با نام ستون قبلی در حال ارسال کوئری هستند.

```text
مرحله اول (Expand - گسترش):
- ستون جدید را کنار ستون قدیمی اضافه کنید.
- نسخه جدید برنامه را مستقر کنید: از ستون قدیمی می‌خواند و در هر دو ستون جدید و قدیم می‌نویسد (Dual-write).
- داده‌های قبلی را در پس‌زمینه در دسته‌های کوچک منتقل کنید.

مرحله دوم (Migrate - مهاجرت):
- نسخه بعدی برنامه را مستقر کنید: مستقیماً از ستون جدید می‌خواند و در آن می‌نویسد.

مرحله سوم (Contract - انقباض):
- ستون قدیمی را با دستورات بدون قطعی حذف نمایید.
```

---

## ۶. تمرین سناریومحور و پاسخ

**صورت تمرین:**  
دستور `CREATE INDEX CONCURRENTLY` به دلیل بن‌بست موقت در میانه کار شکست می‌خورد. در خروجی `\di` نام ایندکس با وضعیت `INVALID` ثبت شده است. آیا کوئری‌ها از این ایندکس استفاده می‌کنند و چه باید کرد؟

**پاسخ:**  
خیر؛ کوئری‌ها به هیچ عنوان نمی‌توانند از ایندکس `INVALID` استفاده کنند. اما این ایندکس معیوب همچنان روی دیسک فضا می‌گیرد و به ازای هر `INSERT` و `UPDATE` باید به‌روز شود که کارایی را کند می‌کند!  
*پاک‌سازی صحیح:*
۱. حذف ایندکس ناقص با دستور `DROP INDEX CONCURRENTLY idx_orders_status;`.
۲. اجرای مجدد دستور `CREATE INDEX CONCURRENTLY`.

---

## منابع رسمی
- [مستندات PostgreSQL: ساخت ایندکس بدون قطعی با CREATE INDEX CONCURRENTLY](https://www.postgresql.org/docs/current/sql-createindex.html#SQL-CREATEINDEX-CONCURRENTLY)
- [مستندات PostgreSQL: اعتبارسنجی غیربلاک‌کننده با ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)

</div>

