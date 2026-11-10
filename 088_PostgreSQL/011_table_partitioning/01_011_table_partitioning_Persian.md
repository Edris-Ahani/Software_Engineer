<div dir="rtl">

[← فهرست و مسیر یادگیری](../README.md) | [English Version](01_011_table_partitioning_English.md)

# 011 — پارتیشن‌بندی جداول (Declarative Partitioning)

## هدف یادگیری
تسلط بر روش بومی و اظهاری پارتیشن‌بندی جداول (Range، List و Hash)؛ عملکرد مکانیسم Partition Pruning جهت کاهش چشمگیر I/O، عملیات بدون قطعی Detach برای آرشیو داده‌های قدیمی و قواعد طراحی کلید اصلی در جداول پارتیشن‌شده.

---

## ۱. معماری پارتیشن‌بندی در PostgreSQL

پارتیشن‌بندی یک جدول منطقی غول‌پیکر را به چندین جدول فیزیکی کوچک‌تر خرد می‌کند، بدون اینکه نحوه کدنویسی اپلیکیشن تغییری کند (دستورات `SELECT` و `INSERT` روی نام جدول والد اجرا می‌شوند):

```text
جدول منطقی والد: store.orders (PARTITION BY RANGE (order_date))
                     │
     ┌───────────────┼───────────────┬───────────────┐
     v               v               v               v
orders_2026_q1  orders_2026_q2  orders_2026_q3  orders_2026_q4
[زمستان ۱۴۰۴]    [بهار ۱۴۰۵]     [تابستان ۱۴۰۵]   [پاییز ۱۴۰۵]
```

### روش‌های پارتیشن‌بندی
۱. **پارتیشن‌بندی بازه‌ای (RANGE):** ایده‌آل برای داده‌های زمانی، لاگ‌ها و تراکنش‌های تاریخی.
۲. **پارتیشن‌بندی لیستی (LIST):** ایده‌آل برای مقادیر گسسته دسته‌ای (مانند کشورها یا شناسه‌های مستاجرین multi-tenant).
۳. **پارتیشن‌بندی درهم‌ساز (HASH):** ایده‌آل برای توزیع متوازن بار نوشتن روی $N$ بخش بدون وابستگی به منطق زمانی.

---

## ۲. مکانیسم هرس پارتیشن‌ها (Partition Pruning)

این مکانیسم به برنامه‌ریز اجازه می‌دهد پارتیشن‌هایی را که طبق شرط `WHERE` داده‌ای برای عرضه ندارند، اصلاً از دیسک نخواند:

```sql
-- Ensure pruning is enabled in configuration (default on)
SET enable_partition_pruning = on;

-- Query filtering on partition key:
EXPLAIN (ANALYZE, BUFFERS)
SELECT * 
FROM store.orders 
WHERE order_date BETWEEN '2026-02-01' AND '2026-02-15';
```

### تحلیل خروجی پلن:
در پلن اجرای کوئری بالا، تنها پارتیشن `store.orders_2026_q1` اسکن می‌شود و سایر پارتیشن‌ها با عبارت **`(never executed)`** نشان‌دار شده و هیچ I/O به دیسک تحمیل نمی‌کنند.

---

## ۳. قانون قطعی کلید اصلی در جداول پارتیشن‌شده

> **قانون تغییرناپذیر مهندسی:**  
> هر کلید اصلی (`PRIMARY KEY`) یا قید یکتایی (`UNIQUE`) در یک جدول پارتیشن‌شده، **باید حتماً شامل ستون کلید پارتیشن باشد**.

```sql
-- Valid Primary Key:
CREATE TABLE store.metrics (
    metric_id BIGINT,
    recorded_at TIMESTAMPTZ,
    value NUMERIC(10,2),
    PRIMARY KEY (metric_id, recorded_at)
) PARTITION BY RANGE (recorded_at);

-- INVALID: PRIMARY KEY (metric_id) would fail because PostgreSQL 
-- enforces uniqueness on local partitions, not across independent partitions!
```

---

## ۴. آرشیو و پاک‌سازی داده‌ها بدون قطعی (`DETACH CONCURRENTLY`)

حذف میلیاردها سطر قدیمی با دستور `DELETE FROM orders WHERE order_date < '2025-01-01'` فاجعه‌بار است و دیتابیس را پر از رکوردهای مرده و لاگ‌های سنگین می‌کند. با پارتیشن‌بندی، حذف یا انتقال در زمان $O(1)$ و بدون قطعی رخ می‌دهد:

```sql
-- Step 1: Detach old partition concurrently without blocking active read/write queries
ALTER TABLE store.orders 
DETACH PARTITION store.orders_2025_q4 CONCURRENTLY;

-- Step 2: The detached partition is now a standalone independent table!
-- You can dump it to cold S3 storage:
-- pg_dump -t store.orders_2025_q4 engineering_db | gzip > archive_2025_q4.sql.gz

-- Step 3: Instantaneous drop without vacuum overhead:
DROP TABLE store.orders_2025_q4;
```

---

## ۵. تمرین سناریومحور و پاسخ

**صورت تمرین:**  
کوئری زیر روی جدولی که بر اساس `order_date` پارتیشن شده است اجرا می‌شود:  
`SELECT * FROM store.orders WHERE user_id = '00000000-0000-0000-0000-000000000001'::uuid;`  
چرا زمان پاسخ این کوئری بالاتر از حد انتظار است و چه راه‌حلی وجود دارد؟

**پاسخ:**  
چون در شرط کوئری ستون تاریخ (`order_date`) وجود ندارد، موتور نمی‌تواند هرس پارتیشن انجام دهد و مجبور است تک‌تک پارتیشن‌های جدول را اسکن کرده و با گره `Append` خروجی را ادغام کند.  
*راه‌حل:* در صورت تکرار این سناریو، می‌توان از ساب‌پارتیشن‌بندی ترکیبی (تاریخ و هش کاربر) استفاده کرد، یا جدول شاخص معکوس (Lookup Table) برای نگاشت کاربر به تاریخ‌ها نگهداری نمود.

---

## منابع رسمی
- [مستندات PostgreSQL: پارتیشن‌بندی جداول (Table Partitioning)](https://www.postgresql.org/docs/current/ddl-partitioning.html)
- [مستندات PostgreSQL: عملیات پارتیشن با ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)

</div>

