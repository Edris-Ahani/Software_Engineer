<div dir="rtl">

[← فهرست و مسیر یادگیری](../README.md) | [English Version](01_021_performance_tuning_and_monitoring_English.md)

# 021 — تیونینگ کارایی، مانیتورینگ و افزونه pg_stat_statements

## هدف یادگیری
تسلط بر تنظیم پارامترهای موتور هماهنگ با سخت‌افزار؛ درک مکانیزم Double Buffering بین `shared_buffers` و کش لینوکس، اصلاح هزینه دسترسی به دیسک‌های پرسرعت NVMe با `random_page_cost`، و ریشه‌یابی کندترین کوئری‌های پروداکشن با افزونه `pg_stat_statements`.

---

## ۱. تنظیم پارامترهای اصلی منطبق با سخت‌افزار سرور

```ini
# Sizing for a dedicated 64 GB RAM / 16-Core NVMe Server:

# 1. حافظه اشتراکی دیتابیس: ۲۵ درصد کل رم سرور
# (بیش از ۴۰٪ نگذارید؛ چون پستگرس به کش سیستم‌عامل لینوکس Page Cache متکی است!)
shared_buffers = 16GB

# 2. راهنمای حافظه در دسترس برنامه‌ریز: حدود ۷۵٪ کل رم
effective_cache_size = 48GB

# 3. اصلاح هزینه خواندن دیسک NVMe:
# عدد پیش‌فرض ۴.۰ برای هاردهای چرخشی قدیمی است. در NVMe خواندن تصادفی هم‌سرعت خواندن ترتیبی است!
random_page_cost = 1.1
seq_page_cost = 1.0

# 4. پردازش موازی چند هسته‌ای:
max_worker_processes = 16
max_parallel_workers_per_gather = 4
max_parallel_workers = 16

# 5. حافظه اختصاصی ساخت ایندکس و واکیوم:
maintenance_work_mem = 2GB
```

---

## ۲. رهگیری و پروفایل کوئری‌ها با `pg_stat_statements`

افزونه `pg_stat_statements` آمارهای تجمیعی تمامی کوئری‌های نرمال‌شده را ثبت می‌کند:

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Top 5 queries consuming the most total CPU and execution time:
SELECT 
    round(total_exec_time::numeric, 2) AS total_time_ms,
    calls,
    round(mean_exec_time::numeric, 2) AS mean_time_ms,
    round((100 * total_exec_time / sum(total_exec_time) OVER ())::numeric, 2) AS pct_total_load,
    rows,
    substr(query, 1, 80) AS query_preview
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 5;
```

### شناسایی کوئری‌هایی که روی دیسک موقت می‌ریزند:
```sql
SELECT query, calls, temp_blks_written, temp_blks_read
FROM pg_stat_statements
WHERE temp_blks_written > 0
ORDER BY temp_blks_written DESC
LIMIT 5;
```
*(مشاهده رکورد در این کوئری نشانه نیاز فوری به افزایش `work_mem` یا بازنویسی کوئری است).*

---

## ۳. متریک‌های حیاتی پایش سلامت سیستم

### الف) نرخ موفقیت حافظه کش (Cache Hit Ratio)
سنجش اینکه چند درصد از صفحات درخواستی مستقیماً از رم خوانده شده‌اند:
```sql
SELECT 
    sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) * 100.0 AS cache_hit_ratio
FROM pg_statio_user_tables;
```
> **استاندارد عملیاتی:** در محیط‌های تجاری این عدد **باید بالای ۹۹.۰٪** باشد. رسیدن به زیر ۹۵٪ نشان‌دهنده ناکافی بودن `shared_buffers` در برابر حجم داده‌های داغ است.

### ب) سن شناسه‌های تراکنش و خطر سرریز (XID Wraparound)
پستگرس حداکثر ۲ میلیارد شناسه تراکنش فعال همزمان را پشتیبانی می‌کند. اگر سن تراکنش‌ها به سقف مجاز نزدیک شود، سیستم برای جلوگیری از خرابی داده در حالت خاموشی اضطراری قفل می‌شود:

```sql
SELECT datname, age(datfrozenxid) AS xid_age,
       (2^31 - age(datfrozenxid))::bigint AS tx_until_wraparound_shutdown
FROM pg_database
ORDER BY age(datfrozenxid) DESC;
```

---

## ۴. متوقف‌سازی کوئری‌های قفل‌شده و طولانی

```sql
-- Find queries running longer than 5 minutes
SELECT pid, now() - query_start AS duration, query, state
FROM pg_stat_activity
WHERE state != 'idle' AND (now() - query_start) > INTERVAL '5 minutes';

-- Graceful cancellation:
SELECT pg_cancel_backend(12345);

-- Forceful kill (terminates backend process):
SELECT pg_terminate_backend(12345);
```

---

## ۵. تمرین سناریومحور و پاسخ

**صورت تمرین:**  
روی سروری با دیسک NVMe، اجرای یک کوئری با اسکن ایندکس ۵ میلی‌ثانیه زمان می‌برد. اما برنامه‌ریز اصرار دارد اسکن ترتیبی کامل ۴۵۰ میلی‌ثانیه‌ای انتخاب کند، مگر اینکه به اجبار `SET enable_seqscan = off;` اجرا شود. چرا برنامه‌ریز این انتخاب اشتباه را انجام می‌دهد و راه‌حل دائمی چیست؟

**پاسخ:**  
برنامه‌ریز برای تخمین هزینه پرش بین صفحات ایندکس از پارامتر `random_page_cost` استفاده می‌کند. مقدار پیش‌فرض ۴.۰ فرض را بر هارد دیسک‌های مکانیکی قدیمی گذاشته است که در آن‌ها خواندن تصادفی ۴ برابر کندتر از خواندن متوالی است.  
*راه‌حل دائمی:* روی حافظه‌های SSD/NVMe مقدار `random_page_cost = 1.1` را در فایل `postgresql.conf` ذخیره و Reload کنید. بهینه‌ساز بلافاصله به شکل طبیعی اسکن ایندکس را ترجیح خواهد داد.

---

## منابع رسمی
- [مستندات PostgreSQL: فصل ۱۹ - مدیریت منابع و حافظه](https://www.postgresql.org/docs/current/runtime-config-resource.html)
- [مستندات PostgreSQL: ماژول مانیتورینگ pg_stat_statements](https://www.postgresql.org/docs/current/pgstatstatements.html)

</div>

