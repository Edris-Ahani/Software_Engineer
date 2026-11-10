<div dir="rtl">

[← فهرست و مسیر یادگیری](../README.md) | [English Version](01_002_installation_psql_and_config_English.md)

# 002 — نصب، تسلط بر ابزار psql و تنظیمات سرور

## هدف یادگیری
تسلط بر فایل‌های پیکربندی اصلی سرور (`postgresql.conf` و `pg_hba.conf`)، درک تفاوت پارامترهای نیازمند Restart در برابر Reload بدون قطعی، و تسلط کامل بر دستورات کاربردی ترمینال `psql`.

---

## ۱. فایل‌های کلیدی پیکربندی سرور

پیکربندی سرور در دایرکتوری داده‌های کلاستر (`$PGDATA`) نگهداری می‌شود:

```text
$PGDATA/
├── postgresql.conf         # تنظیمات موتور، حافظه، لاگ‌ها و ارتباطات
├── pg_hba.conf             # کنترل دسترسی کلاینت‌ها (Host-Based Authentication)
└── pg_ident.conf           # نگاشت نام‌های کاربری سیستم‌عامل به کاربران دیتابیس
```

### ساختار فایل امنیتی `pg_hba.conf`
هر درخواستی که از طریق شبکه یا سوکت سیستم‌عامل ارسال می‌شود، خط‌به‌خط از بالا به پایین در فایل `pg_hba.conf` ارزیابی می‌شود:

```text
# TYPE    DATABASE        USER            ADDRESS                 METHOD
local     all             all                                     peer
host      all             all             127.0.0.1/32            scram-sha-256
host      engineering_db  app_user        10.0.0.0/16             scram-sha-256
host      all             all             0.0.0.0/0               reject
```

- **`local`**: اتصال محلی از طریق Unix Domain Socket.
- **`host`**: اتصال شبکه بر بستر پروتکل TCP/IP (با یا بدون SSL).
- **`scram-sha-256`**: متد احراز هویت رمزنگاری‌شده مدرن بر پایه‌ی SASL (در محیط‌های پروداکشن هرگز از متدهای ناامن مثل `trust` یا `md5` استفاده نکنید).

---

## ۲. دسته‌بندی پارامترها: اعمال بدون قطعی (Reload) در برابر Restart

تمام متغیرهای PostgreSQL در یکی از دسته‌های زیر قرار دارند:

| نوع سرفصل پارامتر | روش اعمال | مثال‌های شاخص |
| :--- | :--- | :--- |
| **`sighup`** | بارگذاری مجدد بدون قطع اتصال کاربران فعال (`SELECT pg_reload_conf();` یا ارسال سیگنال SIGHUP). | `log_min_duration_statement`, `work_mem`, `statement_timeout`, `autovacuum_work_mem` |
| **`postmaster`** | نیازمند راه‌اندازی مجدد (Restart) کامل سرویس دیتابیس. | `shared_buffers`, `max_connections`, `wal_level`, `shared_preload_libraries` |
| **`user` / `session`** | قابلیت بازنویسی در سطح سشن جاری توسط کلاینت. | `SET work_mem = '64MB';`, `SET enable_seqscan = off;` |

برای بررسی اینکه آیا تغییر یک پارامتر نیاز به Restart دارد:
```sql
SELECT name, setting, unit, context
FROM pg_settings
WHERE name IN ('shared_buffers', 'work_mem', 'max_connections', 'log_min_duration_statement');
```

---

## ۳. دستورات پرکاربرد خط فرمان `psql`

ابزار `psql` سریع‌ترین و دقیق‌ترین روش تحلیل وضعیت پایگاه‌داده است:

```bash
# اتصال به سرور از طریق ترمینال
psql -h 127.0.0.1 -p 5432 -U postgres -d engineering_db
```

فرمان‌های فرعی (Meta-Commands) در محیط تعاملی `psql`:

| دستور | کاربرد عملیاتی |
| :--- | :--- |
| `\timing on` | نمایش زمان دقیق اجرای کوئری‌ها بر حسب میلی‌ثانیه. |
| `\x auto` | سوییچ خودکار نمایش ستون‌ها به حالت عمودی (مناسب برای رکوردهای عریض). |
| `\l+` | نمایش فهرست دیتابیس‌ها به همراه حجم اشغال‌شده، انکودینگ و مالکیت. |
| `\dt+ [schema.*]` | فهرست جداول و حجم فیزیکی هر جدول روی دیسک. |
| `\di+ [schema.*]` | فهرست کامل ایندکس‌ها، جدول مرجع و حجم ایندکس. |
| `\d+ table_name` | جزئیات ساختار جدول، نوع ستون‌ها، کلیدهای خارجی و ایندکس‌ها. |
| `\dn+` | نمایش اسکیماها و سطح دسترسی‌ها. |
| `\dx` | فهرست افزونه‌های فعال‌شده و نسخه آن‌ها. |
| `\copy table TO 'file.csv' CSV HEADER` | استخراج پرسرعت داده در کلاینت بدون نیاز به دسترسی سیستم‌عامل سرور. |

---

## ۴. آزمایش عملی و اندازه‌گیری حجم اشغال‌شده

دستورات زیر را برای اندازه‌گیری حجم فیزیکی اسکیما اجرا کنید:

```sql
-- Check current client connection details
SELECT inet_client_addr(), inet_client_port(), current_user, current_database();

-- Measure query timing directly in psql
\timing on

-- View disk footprints of all tables in the 'store' schema
SELECT relname AS table_name,
       pg_size_pretty(pg_total_relation_size(c.oid)) AS total_size,
       pg_size_pretty(pg_relation_size(c.oid)) AS table_data_size,
       pg_size_pretty(pg_indexes_size(c.oid)) AS indexes_size
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'store' AND c.relkind = 'r'
ORDER BY pg_total_relation_size(c.oid) DESC;
```

---

## ۵. تمرین سناریومحور و پاسخ

**صورت تمرین:**  
در فایل `postgresql.conf` مقادیر `shared_buffers = 2GB` و `log_min_duration_statement = 500` را تنظیم کرده و سپس دستور `SELECT pg_reload_conf();` را اجرا کرده‌اید. چه اتفاقی برای این دو متغیر رخ می‌دهد و چگونه می‌توان وضعیت واقعی آن‌ها را استعلام گرفت؟

**پاسخ:**  
متغیر `log_min_duration_statement` به دلیل داشتن context از نوع `sighup` بلافاصله بدون قطعی اعمال می‌شود. اما متغیر `shared_buffers` به دلیل تخصیص حافظه اشتراکی در آغاز به کار پروسس، از نوع `postmaster` است و مقدار جدید آن تا زمان Restart کامل سرور اعمال نمی‌شود.  
بررسی وضعیت با کوئری زیر:
```sql
SELECT name, setting, pending_restart 
FROM pg_settings 
WHERE name IN ('shared_buffers', 'log_min_duration_statement');
```
ستون `pending_restart` برای `shared_buffers` مقدار `true` نشان می‌دهد که به معنی نیاز به راه‌اندازی مجدد سرویس است.

---

## منابع رسمی
- [مستندات PostgreSQL: احراز هویت کلاینت‌ها (Client Authentication)](https://www.postgresql.org/docs/current/client-authentication.html)
- [مستندات PostgreSQL: مرجع کامل خط فرمان psql](https://www.postgresql.org/docs/current/app-psql.html)

</div>

