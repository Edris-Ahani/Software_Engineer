<div dir="rtl">

[← فهرست و مسیر یادگیری](../README.md) | [English Version](01_015_connection_pooling_and_pgbouncer_English.md)

# 015 — مدیریت اتصالات و Connection Pooling با PgBouncer

## هدف یادگیری
درک چرایی الزام استفاده از Connection Pooler در ساختار پردازش‌محور PostgreSQL؛ آشنایی با نرم‌افزار قدرتمند **PgBouncer**، بررسی تفاوت ۳ حالت پولینگ (Session، Transaction و Statement)، نکات پروداکشن کار با Prepared Statements و فرمول بهینه تعداد اتصالات.

---

## ۱. چرا استفاده از Connection Pooler در PostgreSQL اجباری است؟

به دلیل اینکه در PostgreSQL به ازای هر اتصال کلاینت یک پردازش مجزای سیستم‌عامل با حافظه پایه ۵ الی ۱۰ مگابایت Fork می‌شود، افزایش کورکورانه اتصالات مستقیم سرور را به زانو درمی‌آورد:

```text
بدون Connection Pooler (اتصال مستقیم ۵۰۰۰ کلاینت به دیتابیس):
کلاینت‌ها (۵۰۰۰) ────> ۵۰۰۰ پردازش مستقل در سیستم‌عامل ساخته می‌شود
                       ├── مصرف حافظه: ۵۰۰۰ در ۱۰ مگابایت = ۵۰ گیگابایت رم فقط برای اتصال!
                       └── پردازنده: تعویض مداوم متن پروسس‌ها (Context Switching) کارایی را نابود می‌کند!

با استفاده از PgBouncer:
کلاینت‌ها (۵۰۰۰) ────> PgBouncer (یک پروسس رویدادمحور) ──[ ۳۰ تا ۵۰ اتصال ]──> PostgreSQL
```

### فرمول علمی تعیین تعداد اتصالات بهینه دیتابیس
آزمایش‌های دقیق نشان می‌دهد اوج توان پردازش تراکنش (TPS) زمانی رخ می‌دهد که تعداد اتصالات فعال به هسته دیتابیس نزدیک به تعداد هسته‌های فیزیکی CPU باشد:

$$\text{Optimal Connections} = (\text{CPU Cores} \times 2) + \text{Disk Factor}$$

برای یک سرور ۱۶ هسته‌ای با حافظه پرسرعت NVMe:
$$\text{Optimal Pool} \approx (16 \times 2) + 4 = 36\text{ اتصالات}$$
باز کردن هزاران اتصال مستقیم به PostgreSQL نه تنها سیستم را سریع‌تر نمی‌کند، بلکه به دلیل رقابت پردازنده‌ها، سرعت پردازش را شدیداً **کاهش می‌دهد**!

---

## ۲. بررسی ۳ حالت پولینگ در PgBouncer

| حالت پولینگ | طول عمر تخصیص اتصال سرور به کلاینت | مقیاس‌پذیری همزمانی | سازگاری با ویژگی‌های پیشرفته |
| :--- | :--- | :--- | :--- |
| **Session Pooling** | تمام مدت زمان باز بودن اتصال TCP کلاینت. | ضعیف (۱ کلاینت = ۱ پروسس دیتابیس). | ۱۰۰٪ سازگار با تمام رفتارهای دیتابیس. |
| **Transaction Pooling (استاندارد)** | صرفاً در طول اجرای یک تراکنش (`BEGIN` تا `COMMIT`). | **فوق‌العاده بالا** (پاسخ به ۱۰ هزار کلاینت با ۳۰ اتصال دیتابیس). | نیاز به بازنگری دستورات `SET` و جداول موقت سشن. |
| **Statement Pooling** | به ازای اجرای یک تک‌دستور SQL. | حداکثری. | تراکنش‌های چنددستوری (`BEGIN ... COMMIT`) را پشتیبانی نمی‌کند. |

---

## ۳. چالش‌ها و نکات حیاتی در حالت Transaction Pooling

هنگام استفاده از حالت مدرن Transaction Pooling، چون تراکنش‌های بعدی یک کلاینت ممکن است به یک پروسس دیگر سرور هدایت شوند، وضعیت سشن پایدار نیست:

```text
[نکته ۱] کوئری‌های آماده (Prepared Statements):
در نسخه‌های قدیمی خطای نبودن بیانیه صادر می‌شد؛ اما از PgBouncer نسخه ۱.۲۱ به بعد
ردیابی Prepared Statements به صورت خودکار پشتیبانی می‌شود.

[نکته ۲] تغییر تنظیمات سشن:
به‌جای دستور 'SET search_path = my_schema;' باید از دستور موضعی تراکنش استفاده شود:
'SET LOCAL search_path = my_schema;'.

[نکته ۳] جداول موقت (Temporary Tables):
جداول موقتی که در سطح سشن ساخته می‌شوند با اتمام تراکنش از دسترس خارج می‌شوند.
به‌جای آن از Unlogged Tables یا پارامترهای JSONB استفاده کنید.
```

---

## ۴. فایل پیکربندی نمونه (`pgbouncer.ini`)

```ini
[databases]
engineering_db = host=127.0.0.1 port=5432 dbname=engineering_db

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432
auth_type = scram-sha-256
auth_file = /etc/pgbouncer/userlist.txt

# Connection limits
pool_mode = transaction
max_client_conn = 5000         # Up to 5,000 web clients can connect
default_pool_size = 30         # Maximum 30 physical backend connections to Postgres
reserve_pool_size = 5          # Emergency overflow connections
```

---

## ۵. تمرین سناریومحور و پاسخ

**صورت تمرین:**  
در زمان فروش شگفت‌انگیز، سرویس با خطای `FATAL: remaining connection slots are reserved` مواجه می‌شود. تیم قصد دارد مقدار `max_connections` در `postgresql.conf` را روی ۵۰۰۰ تنظیم کرده و سرور را ریستارت کند. چرا این تصمیم فاجعه‌بار است و راهکار صحیح چیست؟

**پاسخ:**  
تنظیم ۵۰۰۰ اتصال مستقیم باعث تخصیص حجم عظیمی از حافظه اشتراکی به قفل‌ها و درگیری شدید پردازنده در جابجایی بین ۵۰۰۰ پردازش مستقل لینوکسی می‌شود. پردازنده سرور ۱۰۰٪ پر می‌شود در حالی که توان پردازش تراکنش به صفر میل می‌کند.  
*راهکار استاندارد:* نگه داشتن `max_connections` در محدوده معقول (مثلاً ۱۰۰)، قرار دادن **PgBouncer** با حالت `pool_mode = transaction` در جلوی دیتابیس و تنظیم `max_client_conn = 5000` در PgBouncer. کلاینت‌ها در لایه سبک PgBouncer صف می‌بندند و PostgreSQL با نهایت راندمان سخت‌افزار کوئری‌ها را اجرا می‌کند.

---

## منابع رسمی
- [مستندات رسمی PgBouncer](https://www.pgbouncer.org/)
- [ویکی رسمی PostgreSQL: بررسی تعداد اتصالات بهینه دیتابیس](https://wiki.postgresql.org/wiki/Number_Of_Database_Connections)

</div>

