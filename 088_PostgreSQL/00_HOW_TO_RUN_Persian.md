<div dir="rtl">

# راهنمای اجرای آزمایشگاه عملی PostgreSQL

[← بازگشت به فهرست سرفصل‌ها](README.md) | [English Guide](00_HOW_TO_RUN_English.md)

این بخش یک محیط کامل، ایزوله و بازتولیدپذیر با استفاده از **Docker Compose** در اختیارتان قرار می‌دهد که شامل **PostgreSQL 16 مجهز به اکستنشن pgvector** و سیستم مدیریت اتصالات **PgBouncer** است.

---

## ۱. پیش‌نیازها

- نصب داکر (Docker Engine 24.0+) و Docker Compose v2.
- پایتون 3.10+ (اختیاری، جهت اجرای اسکریپت تست خودکار `smoke_test.py` از روی سیستم میزبان).
- ابزار خط فرمان `psql` (اختیاری؛ در صورت عدم نصب روی سیستم، می‌توانید مستقیماً از داخل کانتینر داکر متصل شوید).

---

## ۲. ساختار فایل‌های آزمایشگاه

```text
088_PostgreSQL/_lab/
├── compose.yaml
├── pgbouncer.ini
├── userlist.txt
├── smoke_test.py
└── init_db/
    ├── 01_schema.sql
    └── 02_seed_data.sql
```

---

## ۳. بالا آوردن محیط آزمایشگاه

ترمینوال خود را باز کرده و وارد پوشه `088_PostgreSQL/_lab` شوید:

```bash
cd 088_PostgreSQL/_lab
docker compose up -d
```

برای مشاهده‌ی وضعیت سرویس‌ها:

```bash
docker compose ps
```

دو سرویس فعال در خروجی ظاهر خواهند شد:
- سرویس `pg_primary` روی پورت `5432`.
- سرویس `pg_bouncer` روی پورت `6432`.

---

## ۴. روش‌های اتصال با ابزار psql

### الف) اتصال مستقیم به PostgreSQL (پورت 5432):
```bash
# از طریق ترمینال سیستم میزبان:
psql -h localhost -p 5432 -U postgres -d engineering_db

# یا اتصال مستقیم از داخل کانتینر بدون نیاز به نصب psql روی سیستم میزبان:
docker exec -it pg_primary psql -U postgres -d engineering_db
```
*(رمز عبور پیش‌فرض: `postgres_secure_pass`)*

### ب) اتصال از طریق PgBouncer (پورت 6432):
```bash
psql -h localhost -p 6432 -U postgres -d engineering_db
```

---

## ۵. اجرای تست‌های خودکار صحت عملکرد (Smoke Tests)

اسکریپت پایتون تدارک دیده‌شده موارد زیر را بررسی می‌کند:
۱. آمادگی و در دسترس بودن سرور PostgreSQL  
۲. فعال بودن اکستنشن‌های حیاتی (`vector`, `pg_trgm`, `pg_stat_statements`)  
۳. درستی ایجاد جداول و درج ۱۰۰٬۰۰۰ داده نمونه برای آزمایش کوئری‌ها  
۴. عملکرد صحیح Connection Pooling در پورت ۶۴۳۲  

اجرای تست:

```bash
python smoke_test.py
```

خروجی مورد انتظار:
```text
[OK] PostgreSQL connectivity verified.
[OK] Extensions verified: pgvector, pg_trgm, pg_stat_statements.
[OK] Seed data verified: 100,000 indexed records ready.
[OK] PgBouncer pooler connection verified on port 6432.
All tests passed successfully!
```

---

## ۶. خاموش کردن و پاک‌سازی محیط آزمایشگاه

پس از پایان تمرین‌ها، برای توقف کانتینرها و حذف داده‌های موقت:

```bash
docker compose down -v
```

</div>

