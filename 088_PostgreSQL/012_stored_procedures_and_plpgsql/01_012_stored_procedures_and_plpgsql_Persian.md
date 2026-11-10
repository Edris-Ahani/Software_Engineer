<div dir="rtl">

[← فهرست و مسیر یادگیری](../README.md) | [English Version](01_012_stored_procedures_and_plpgsql_English.md)

# 012 — توابع روال‌مند، پروسیجرها و تریگرها در PL/pgSQL

## هدف یادگیری
آشنایی با مبانی زبان برنامه‌نویسی داخلی PL/pgSQL؛ درک تفاوت کلیدی توابع (`FUNCTION`) و رویه‌ها (`PROCEDURE`) در کنترل تراکنش، دسته‌بندی فراریت توابع (`IMMUTABLE`، `STABLE`، `VOLATILE`)، طراحی تریگرهای حسابرسی و هزینه مخفی بلوک‌های Exception.

---

## ۱. تفاوت ساختاری توابع و پروسیجرها (Procedures)

| ویژگی | `CREATE FUNCTION` | `CREATE PROCEDURE` (از نسخه ۱۱ به بعد) |
| :--- | :--- | :--- |
| **کنترل تراکنش** | امکان شروع یا ثبت Commit ندارد و داخل تراکنش والد اجرا می‌شود. | قابلیت اجرای صریح دستورات `COMMIT` و `ROLLBACK` در بدنه پروسیجر! |
| **نحوه فراخوانی** | با دستور `SELECT my_func(...)` | با دستور `CALL my_proc(...)` |
| **کاربرد اصلی** | محاسبات ریاضی، تبدیلات داده و ساختارهای محاسباتی. | پردازش‌های دسته‌ای حجیم (Batch Processing) با ثبت دوره‌ای تراکنش. |

```sql
-- Stored Procedure demonstrating transactional chunking
CREATE OR REPLACE PROCEDURE store.archive_old_orders(batch_size INT)
LANGUAGE plpgsql
AS $$
DECLARE
    rows_affected INT;
BEGIN
    LOOP
        -- Delete in small batches to avoid holding long locks
        DELETE FROM store.orders
        WHERE order_id IN (
            SELECT order_id 
            FROM store.orders 
            WHERE status = 'DELIVERED' AND order_date < '2024-01-01'
            LIMIT batch_size
        );
        
        GET DIAGNOSTICS rows_affected = ROW_COUNT;
        
        -- Explicitly commit this batch so locks and WAL buffers are released
        COMMIT;
        
        EXIT WHEN rows_affected = 0;
    END LOOP;
END;
$$;
```

---

## ۲. دسته‌بندی فراریت توابع (Function Volatility)

موتور بهینه‌ساز بر اساس این برچسب‌ها تصمیم می‌گیرد که آیا می‌تواند خروجی تابع را کش کند یا باید به ازای هر سطر دوباره آن را اجرا کند:

```text
۱. تابع تغییرناپذیر (IMMUTABLE):
   امکان تغییر دیتابیس ندارد؛ به ازای ورودی‌های یکسان، همواره خروجی کاملاً قطعی و یکسان می‌دهد.
   مثال: LOWER('ABC') یا MD5('text').
   -> فقط یک‌بار در زمان برنامه‌ریزی کوئری اجرا و کش می‌شود. پیش‌نیاز ساخت ایندکس‌های تابعی!

۲. تابع پایدار (STABLE):
   امکان تغییر داده ندارد؛ در طول اجرای یک کوئری خروجی ثابت دارد، ولی بین کوئری‌ها ممکن است تغییر کند.
   مثال: NOW() یا خواندن از جدول تنظیمات.

۳. تابع فرار (VOLATILE - پیش‌فرض):
   می‌تواند داده‌ها را تغییر دهد یا به ازای دو فراخوانی متوالی حتی در یک سطر خروجی متفاوتی بدهد.
   مثال: random() یا clock_timestamp() یا nextval().
   -> دیتابیس مجبور است این تابع را به ازای تک‌تک سطرهای جدول دوباره فراخوانی کند!
```

---

## ۳. طراحی تریگر حسابرسی (Audit Log Trigger)

```sql
CREATE TABLE store.audit_log (
    audit_id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    action VARCHAR(10) NOT NULL,
    row_data JSONB NOT NULL,
    changed_by VARCHAR(100) NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE OR REPLACE FUNCTION store.fn_log_user_audit()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO store.audit_log (table_name, action, row_data, changed_by)
    VALUES (
        TG_TABLE_NAME,
        TG_OP,
        CASE TG_OP
            WHEN 'DELETE' THEN to_jsonb(OLD)
            ELSE to_jsonb(NEW)
        END,
        current_user
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_audit
AFTER INSERT OR UPDATE OR DELETE ON store.users
FOR EACH ROW
EXECUTE FUNCTION store.fn_log_user_audit();
```

---

## ۴. هزینه مخفی بلوک‌های `EXCEPTION` در PL/pgSQL

```sql
-- DANGEROUS PATTERN IN HIGH-FREQUENCY LOOPS:
BEGIN
    -- ورود به بلوک BEGIN ... EXCEPTION یک Savepoint (تراکنش فرعی) داخلی می‌سازد.
    -- اگر این بلوک داخل یک حلقه با ۱۰۰ هزار تکرار باشد، ۱۰۰ هزار ساب‌ترانزکشن ساخته شده
    -- و قفل حافظه Subtrans SLRU با افت شدید کارایی مواجه می‌شود!
EXCEPTION WHEN OTHERS THEN
    -- handle error
END;
```
> **توصیه مهندسی:** از قرار دادن بلوک‌های `EXCEPTION` در حلقه‌های پرتکرار پرهیز کنید؛ به‌جای آن وجود رکورد را با شرط `IF EXISTS (...)` بررسی نمایید.

---

## ۵. تمرین سناریومحور و پاسخ

**صورت تمرین:**  
می‌خواهید ایندکسی تابعی بسازید: `CREATE INDEX idx_user_domain ON store.users (fn_get_domain(email));`  
اما دیتابیس خطای زیر را صادر می‌کند:  
`ERROR: functions in index expression must be marked IMMUTABLE`  
دلیل چیست، در حالی که این تابع صرفاً دامنه ایمیل را جدا می‌کند؟

**پاسخ:**  
اگر هنگام تعریف تابع وضعیت فراریت مشخص نشود، دیتابیس به‌صورت پیش‌فرض آن را `VOLATILE` در نظر می‌گیرد و موتور نمی‌تواند روی خروجی متغیر ایندکس بسازد.  
اصلاح تابع:
```sql
CREATE OR REPLACE FUNCTION fn_get_domain(email TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE STRICT PARALLEL SAFE
AS $$
    SELECT split_part(email, '@', 2);
$$;
```
اکنون ساخت ایندکس با موفقیت انجام می‌شود.

---

## منابع رسمی
- [مستندات PostgreSQL: فصل ۴۳ - زبان روال‌مند PL/pgSQL](https://www.postgresql.org/docs/current/plpgsql.html)
- [مستندات PostgreSQL: دسته‌بندی فراریت توابع (Function Volatility)](https://www.postgresql.org/docs/current/xfunc-volatility.html)

</div>

