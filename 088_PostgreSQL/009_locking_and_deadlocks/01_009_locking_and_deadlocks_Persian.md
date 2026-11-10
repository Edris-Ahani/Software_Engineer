<div dir="rtl">

[← فهرست و مسیر یادگیری](../README.md) | [English Version](01_009_locking_and_deadlocks_English.md)

# 009 — سیستم قفل‌گذاری، Row Locks و بن‌بست (Deadlock)

## هدف یادگیری
تسلط بر سطوح هشت‌گانه قفل‌های جدولی (Table Locks)، قفل‌گذاری بدبینانه سطری (`FOR UPDATE` و `SKIP LOCKED`)، پیاده‌سازی قفل‌های توزیع‌شده اپلیکیشن با Advisory Locks و شناسایی و پیشگیری از بن‌بست (Deadlock).

---

## ۱. سطوح قفل‌های جدولی و تداخل آن‌ها

مدیر قفل PostgreSQL از ۸ سطح قفل با ماتریس تداخل مشخص استفاده می‌کند:

```text
سلسله‌مراتب قفل‌های جدول (از کمترین تا شدیدترین محدودیت):
1. ACCESS SHARE              (توسط دستور SELECT)
2. ROW SHARE                 (توسط دستور SELECT FOR UPDATE / FOR SHARE)
3. ROW EXCLUSIVE             (توسط دستورات INSERT، UPDATE و DELETE)
4. SHARE UPDATE EXCLUSIVE    (توسط VACUUM، ANALYZE و CREATE INDEX CONCURRENTLY)
5. SHARE                     (توسط دستور CREATE INDEX معمولی)
6. SHARE ROW EXCLUSIVE       (توسط CREATE TRIGGER و برخی تغییرات ساختاری)
7. EXCLUSIVE                 (بلاک کردن نوشتن‌های همزمان و خواندن‌های FOR UPDATE)
8. ACCESS EXCLUSIVE          (توسط DROP TABLE، TRUNCATE، ALTER TABLE و VACUUM FULL)
                             -> توقف کامل تمام عملیات خواندن و نوشتن!
```

> **دام صف قفل‌ها (Lock Queue Cascade):**  
> هنگامی که یک دستور تغییر ساختار (`ALTER TABLE`) درخواست قفل `ACCESS EXCLUSIVE` می‌دهد، منتظر اتمام `SELECT`های جاری می‌ماند. اما نکته خطرناک اینجاست که **تمام SELECTهای جدیدی که پس از این دستور می‌رسند، پشت صف منتظر می‌مانند** و در عرض چند ثانیه کل مخزن اتصالات (Connection Pool) دیتابیس را پر می‌کنند!  
> *راهکار:* قبل از اجرای DDL همواره از `SET lock_timeout = '2s';` استفاده کنید تا در صورت شلوغی سرور، دستور شما لغو شود و ترافیک عادی مسدود نگردد.

---

## ۲. قفل سطری و ایجاد صف پردازش کارها با `SKIP LOCKED`

```sql
-- Standard pessimistic lock (blocks other transactions trying to lock the same row)
SELECT * FROM store.products 
WHERE id = 42 
FOR UPDATE;

-- High-throughput Concurrent Job Queue:
-- Multiple worker processes can claim unique unassigned tasks simultaneously
-- without blocking or waiting on each other!
BEGIN;
SELECT order_id, order_date
FROM store.orders
WHERE status = 'PENDING'
ORDER BY order_id
LIMIT 5
FOR UPDATE SKIP LOCKED;

-- Process the orders, then:
UPDATE store.orders 
SET status = 'PROCESSING'
WHERE order_id IN (...);
COMMIT;
```

---

## ۳. قفل‌های مشاوره‌ای اپلیکیشن (Advisory Locks)

این قفل‌ها به شما اجازه می‌دهند در لایه اپلیکیشن بدون نیاز به ایجاد سطرهای ساختگی یا استفاده از ردیس و زوکیپر، همگام‌سازی توزیع‌شده ایجاد کنید:

```sql
-- Session-level advisory lock (persists until explicitly released or session disconnects)
SELECT pg_advisory_lock(123456);
-- Critical section (e.g., executing single daily billing batch)
SELECT pg_advisory_unlock(123456);

-- Non-blocking try-lock: Returns TRUE if acquired, FALSE immediately if busy
SELECT pg_try_advisory_lock(987654);

-- Transaction-level advisory lock (automatically released at COMMIT or ROLLBACK)
SELECT pg_advisory_xact_lock(456789);
```

---

## ۴. تشخیص بن‌بست (Deadlock) و ریشه‌یابی اتصالات قفل‌شده

بن‌بست زمانی رخ می‌دهد که دو تراکنش به‌صورت متقاطع منتظر آزاد شدن منابع یکدیگر بمانند. اگر زمان انتظار از پارامتر `deadlock_timeout` (پیش‌فرض: ۱ ثانیه) عبور کند، دیتابیس چرخه بن‌بست را بررسی و یکی از تراکنش‌ها را متوقف می‌کند:

```sql
-- Inspect active locks and blocked sessions
SELECT
    blocked_locks.pid     AS blocked_pid,
    blocked_activity.usename  AS blocked_user,
    blocking_locks.pid    AS blocking_pid,
    blocking_activity.usename AS blocking_user,
    blocked_activity.query    AS blocked_statement,
    blocking_activity.query   AS blocking_statement
FROM  pg_catalog.pg_locks         blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks         blocking_locks 
    ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database
    AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
    AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
    AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
    AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid
    AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
    AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
    AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
    AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

### قانون طلایی پیشگیری از Deadlock:
**همواره رکوردها و جداول را در تمام سناریوهای اپلیکیشن به یک ترتیب معین و قطعی (مثلاً به ترتیب صعودی Primary Key) قفل کنید.**

---

## ۵. تمرین سناریومحور و پاسخ

**صورت تمرین:**  
۱۰ ورکر موازی از یک جدول صف پیام‌ها با دستور `SELECT * FROM incoming_events LIMIT 1 FOR UPDATE;` داده برمی‌دارند، اما سیستم به شدت کند است و ورکرها دائماً پشت سر یکدیگر متوقف می‌شوند. راه‌حل چیست؟

**پاسخ:**  
افزودن عبارت `SKIP LOCKED` به انتهای کوئری:  
`SELECT * FROM incoming_events LIMIT 1 FOR UPDATE SKIP LOCKED;`  
بدون این عبارت، هر ۱۰ ورکر تلاش می‌کنند سطر اول را قفل کنند و به حالت ترتیبی درمی‌آیند. با افزودن `SKIP LOCKED`، هر ورکر سطرهای قفل‌شده توسط رقبایش را نادیده گرفته و بلافاصله اولین سطر آزاد را بدون معطلی قفل می‌کند.

---

## منابع رسمی
- [مستندات PostgreSQL: انواع قفل‌گذاری صریح (Explicit Locking)](https://www.postgresql.org/docs/current/explicit-locking.html)
- [مستندات PostgreSQL: توابع قفل‌های مشاوره‌ای (Advisory Locks)](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-ADVISORY-LOCKS)

</div>

