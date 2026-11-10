<div dir="rtl">

[← فهرست و مسیر یادگیری](../README.md) | [English Version](01_024_production_checklist_and_review_English.md)

# 024 — چک‌لیست استقرار، نگهداری و خطایابی پروداکشن

## هدف یادگیری
آماده‌سازی خوشه‌های PostgreSQL برای استقرار بدون خطا در مقیاس‌های حساس و بزرگ؛ ارزیابی جامع چک‌لیست فنی پیش از راه‌اندازی (Pre-launch Audit)، تعیین آستانه‌های مانیتورینگ برای تیم‌های SRE و اجرای گام‌به‌گام دستورالعمل‌های بحران (Incident Runbooks) هنگام پر شدن دیسک، اشباع اتصالات یا جهش CPU.

---

## ۱. چک‌لیست طلایی ارزیابی پیش از پروداکشن (Pre-Production Checklist)

پیش از هدایت ترافیک واقعی کاربران، تمامی موارد زیر باید تایید و اعتبارسنجی شوند:

```text
[ ] ۱. ظرفیت‌سنجی سخت‌افزار و حافظه (Hardware & Memory)
    ├── تنظیم shared_buffers روی ۲۵٪ کل رم سرور
    ├── تنظیم effective_cache_size روی ۷۵٪ کل رم
    ├── تنظیم محافظه‌کارانه work_mem بین ۱۶ تا ۳۲ مگابایت جهت جلوگیری از کشتن پروسس با OOM
    └── تنظیم random_page_cost روی ۱.۱ در صورت استفاده از دیسک‌های NVMe/SSD

[ ] ۲. پایداری داده و مدیریت لاگ‌ها (WAL & Durability)
    ├── تنظیم wal_level روی replica (یا logical در صورت استفاده از CDC/Debezium)
    ├── افزایش max_wal_size به ۱۶ یا ۳۲ گیگابایت جهت حذف چک‌پوینت‌های اضطراری
    ├── تنظیم checkpoint_timeout روی ۱۵ دقیقه
    ├── تنظیم checkpoint_completion_target روی ۰.۹ جهت توزیع ملایم نوشتن روی دیسک
    └── تنظیم max_slot_wal_keep_size روی ۶۴ گیگابایت جهت مهار اسلات‌های رپلیکیشن خراب

[ ] ۳. لایه مدیریت اتصالات (Connection Pooling)
    ├── استقرار PgBouncer در جلوی دیتابیس با حالت pool_mode = transaction
    ├── محدود نگه داشتن max_connections در هسته پستگرس بین ۱۰۰ تا ۲۰۰ اتصال
    └── هدایت ترافیک میکروسرویس‌ها به پورت ۶۴۳۲ مربوط به PgBouncer

[ ] ۴. امنیت و کنترل دسترسی (Security & RBAC)
    ├── فعال بودن رمزنگاری scram-sha-256 در فایل پیکربندی
    ├── اجبار به برقراری ارتباط امن SSL/TLS در فایل pg_hba.conf
    ├── استفاده برنامه‌ها از نقش‌های محدود سیستمی (اکیداً ممنوع بودن اتصال با کاربر postgres)
    └── محافظت از داده‌های هویتی و حساس با Row-Level Security یا pgcrypto

[ ] ۵. بازیابی فاجعه و تداوم کسب‌وکار (Disaster Recovery & PITR)
    ├── زمان‌بندی روزانه پشتیبان‌گیری فیزیکی (pg_basebackup)
    ├── فعال بودن آرشیو مداوم WAL به فضای ذخیره‌سازی ابری امن
    └── اجرای موفقیت‌آمیز مانور بازیابی نقطه‌ای (PITR Drill) روی سرور تست!
```

---

## ۲. دستورالعمل مدیریت بحران‌های متداول در پروداکشن (Runbook)

### سناریوی الف: پر شدن دیسک تا ۹۵٪ (Emergency Disk Space Full)
**علل ریشه‌ای:** اسلات رپلیکیشن رهاشده که مانع حذف لاگ‌های WAL شده است، یا باد کردن شدید جداول (Bloat).

```sql
-- 1. Check for abandoned replication slots hoarding WAL files:
SELECT slot_name, plugin, active, 
       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS retained_bytes
FROM pg_replication_slots
ORDER BY pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn) DESC;

-- If an inactive slot is holding tens of gigabytes, drop it immediately:
-- SELECT pg_drop_replication_slot('abandoned_standby_slot');

-- 2. Find largest disk-consuming tables and indexes:
SELECT relname, pg_size_pretty(pg_total_relation_size(oid)) AS total_size
FROM pg_class
WHERE relkind IN ('r', 'm')
ORDER BY pg_total_relation_size(oid) DESC
LIMIT 5;
```

---

### سناریوی ب: تکمیل ظرفیت اتصالات (`remaining connection slots reserved`)
**علل ریشه‌ای:** تراکنش قفل‌شده و طولانی، کوئری‌های کند فاقد ایندکس یا عدم استفاده از PgBouncer.

```sql
-- 1. Identify which PID is blocking other connections:
SELECT pid, usename, client_addr, state, now() - xact_start AS tx_age, query
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY xact_start ASC NULLS LAST
LIMIT 5;

-- 2. Cancel the offending query gracefully:
SELECT pg_cancel_backend(blocking_pid);

-- 3. If unresponsive, forcefully terminate the backend process:
SELECT pg_terminate_backend(blocking_pid);
```

---

### سناریوی ج: رسیدن پردازنده (CPU) به ۱۰۰٪
**علل ریشه‌ای:** اسکن‌های خطی سنگین روی جداول، کلیدهای خارجی بدون ایندکس یا سرریز مرتب‌سازی‌ها به دیسک موقت.

```sql
-- 1. Find the top query driving CPU usage right now:
SELECT query, calls, total_exec_time, mean_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 3;

-- 2. Check for missing indexes on foreign key columns:
SELECT conrelid::regclass AS table_with_unindexed_fk, conname
FROM pg_constraint c
WHERE contype = 'f'
  AND NOT EXISTS (
      SELECT 1 FROM pg_index i
      WHERE i.indrelid = c.conrelid
        AND c.conkey = (i.indkey::int2[])[1:array_length(c.conkey, 1)]
  );
```

---

## ۳. بازبینی معماری نهایی و پروژه جامع

**صورت مسئله معماری:**  
شما به عنوان معمار ارشد پایگاه‌داده در یک فین‌تک با ۲۰ هزار تراکنش در ثانیه استخدام شده‌اید. سیستم تک‌سروره قبلی دارای فریزهای دوره‌ای ۳۰ ثانیه‌ای است، در زمان ترافیک بالا اتصالات قطع می‌شوند و تغییرات ساختار جدول مستلزم قطعی شبانه است.

**طراحی راهکار جامع مهندسی:**
۱. **لایه اتصالات:** استقرار **PgBouncer** در حالت `transaction` روی پورت ۶۴۳۲؛ محدود کردن `max_connections = 150` در پستگرس که امکان اتصال ۱۰ هزار پاد بدون اتلاف رم را می‌دهد.
۲. **دسترسی‌پذیری بالا (HA):** راه‌اندازی کلاستر ۳ نودی **Patroni + etcd** در پشت لودبالانسر **HAProxy** با سنجش پورت ۸۰۰۸ و سوییچ خودکار در زیر ۱۰ ثانیه با $RPO \approx 0$.
۳. **تیونینگ دیسک و حافظه:** تنظیم `shared_buffers = 25% RAM`، `random_page_cost = 1.1` و `checkpoint_completion_target = 0.9` با `max_wal_size = 32GB`. این تنظیم فریزهای دوره‌ای ۳۰ ثانیه‌ای I/O را به طور کامل ریشه‌کن می‌کند.
۴. **تغییرات اسکیما بدون قطعی (Zero-Downtime DDL):** تدوین قوانین پایپ‌لاین: تمامی تغییرات باید با `SET lock_timeout = '2s';` آغاز شده، ایندکس‌ها با `CREATE INDEX CONCURRENTLY` ایجاد شوند و کلیدهای خارجی با استراتژی `NOT VALID` اضافه گردند. قطعی‌های شبانه سرویس برای همیشه حذف می‌شوند.

---

## منابع رسمی
- [مستندات PostgreSQL: فصل ۲۸ - پایش فعالیت و رخدادهای دیتابیس](https://www.postgresql.org/docs/current/monitoring-stats.html)
- [مستندات PostgreSQL: مرجع کامل متغیرهای سرور (Server Configuration)](https://www.postgresql.org/docs/current/runtime-config.html)

</div>

