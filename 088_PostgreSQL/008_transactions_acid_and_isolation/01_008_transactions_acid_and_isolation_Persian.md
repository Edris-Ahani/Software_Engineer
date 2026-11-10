<div dir="rtl">

[← فهرست و مسیر یادگیری](../README.md) | [English Version](01_008_transactions_acid_and_isolation_English.md)

# 008 — تراکنش‌ها، اصول ACID و سطوح ایزولاسیون

## هدف یادگیری
تسلط بر نحوه تضمین قواعد ACID در PostgreSQL، تفاوت رفتاری سطوح ایزولاسیون (`Read Committed`، `Repeatable Read` و `Serializable`)، شناخت ناهنجاری‌های همزمانی نظیر Write Skew و الگوی Retry سمت کلاینت برای خطای `40001`.

---

## ۱. تضمین اصول ACID در معماری PostgreSQL

- **یکپارچگی (Atomicity):** تضمین از طریق لاگ WAL و مکانیزم Abort تراکنش. هر خطایی باعث نادیده گرفته شدن تغییرات ناپایدار می‌شود.
- **سازگاری (Consistency):** تضمین از طریق قیدهای کلید خارجی، CHECK و تریگرها به‌صورت همزمان یا در انتهای تراکنش (`DEFERRABLE`).
- **ایزولاسیون (Isolation):** پیاده‌سازی از طریق Snapshot Isolation و سیستم MVCC به‌جای استفاده از قفل‌های سنگین و بلاک‌کننده.
- **ماندگاری (Durability):** رکوردهای تغییرات قبل از اعلام موفقیت Commit توسط دستور `fsync` روی رسانه فیزیکی پایدار می‌شوند. خاموش کردن `synchronous_commit = off` سرعت نوشتن را تا ۱۰ برابر افزایش می‌دهد ولی در صورت قطعی ناگهانی برق سرور، امکان از دست رفتن چند میلی‌ثانیه تراکنش آخر وجود دارد.

---

## ۲. مقایسه سطوح ایزولاسیون در PostgreSQL

| سطح ایزولاسیون | خواندن کثیف (Dirty Read) | خواندن غیرقابل تکرار (Non-Repeatable Read) | فانتوم (Phantom Read) | انحراف نوشتن (Write Skew) |
| :--- | :--- | :--- | :--- | :--- |
| **`READ COMMITTED` (پیش‌فرض)** | جلوگیری می‌شود | **رخ می‌دهد** | **رخ می‌دهد** | **رخ می‌دهد** |
| **`REPEATABLE READ`** | جلوگیری می‌شود | جلوگیری می‌شود | جلوگیری می‌شود | **رخ می‌دهد** |
| **`SERIALIZABLE`** | جلوگیری می‌شود | جلوگیری می‌شود | جلوگیری می‌شود | جلوگیری می‌شود |

> **نکات اختصاصی PostgreSQL:**  
> ۱. سطح `READ UNCOMMITTED` در این دیتابیس دقیقاً مشابه `READ COMMITTED` رفتار می‌کند زیرا در ساختار MVCC خواندن کثیف عملاً ناممکن است.  
> ۲. سطح `REPEATABLE READ` در PostgreSQL علاوه بر جلوگیری از Non-Repeatable Read، مانع Phantom Read نیز می‌شود!

```sql
-- Setting isolation level for a specific transaction
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
-- Statements executed here share a frozen database snapshot from transaction start
COMMIT;
```

---

## ۳. ناهنجاری‌های همزمانی داده‌ها

### خواندن غیرقابل تکرار (Non-Repeatable Read)
تراکنش الف سطر شماره ۱۰ را با قیمت ۱۰ دلار می‌خواند. تراکنش ب قیمت را به ۱۵ دلار تغییر داده و Commit می‌کند. حال تراکنش الف مجدداً همان سطر را می‌خواند و مقدار ۱۵ را می‌بیند! در سطح `Repeatable Read`، تراکنش الف همچنان مقدار اولیه ۱۰ را خواهد دید.

### ناهنجاری Write Skew (تنها در Serializable مهار می‌شود)
سیستم آنکال بیمارستان را در نظر بگیرید که طبق قانون همواره باید حداقل ۱ پزشک شیفت باشد:
۱. پزشک علی و رضا هر دو در شیفت هستند (تعداد = ۲).
۲. علی تراکنش ۱ را برای خروج از شیفت آغاز می‌کند: شرط (تعداد >= ۲) برقرار است؛ وضعیت علی به مرخصی تغییر می‌کند.
۳. همزمان رضا تراکنش ۲ را برای خروج آغاز می‌کند: شرط (تعداد >= ۲) همچنان برقرار است؛ وضعیت رضا نیز به مرخصی تغییر می‌کند.
۴. در سطوح `Read Committed` و `Repeatable Read` **هر دو تراکنش با موفقیت Commit می‌شوند** و تعداد پزشکان شیفت صفر می‌شود!
۵. تنها در سطح `SERIALIZABLE` سیستم ضدوابستگی خواندن و نوشتن (SIREAD Locks) متوجه چرخه تداخل شده و یکی از تراکنش‌ها را با خطای زیر لغو می‌کند:  
   `ERROR: 40001: could not serialize access due to read/write dependencies among transactions`.

---

## ۴. الگوی استاندارد تلاش مجدد (Retry Loop) در برنامه‌ها

هنگام استفاده از سطوح ایزولاسیون بالا، کد اپلیکیشن **باید** الگوی تلاش مجدد بر پایه وقفه نمایی (Exponential Backoff) داشته باشد:

```python
# Pseudo-code for production transaction retry pattern
def execute_with_retry(db_pool, tx_logic, max_attempts=5):
    for attempt in range(max_attempts):
        try:
            with db_pool.connection() as conn:
                with conn.transaction():
                    conn.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;")
                    return tx_logic(conn)
        except SerializationFailureError: # SQLSTATE 40001
            time.sleep(0.05 * (2 ** attempt)) # Exponential backoff
    raise Exception("Max transaction retry limit exceeded")
```

---

## ۵. تمرین سناریومحور و پاسخ

**صورت تمرین:**  
دو تراکنش همزمان در سطح `REPEATABLE READ` اجرا می‌شوند:
```sql
-- Transaction 1:
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
UPDATE store.products SET price_cents = price_cents + 100 WHERE id = 1;

-- Transaction 2 (simultaneously):
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
UPDATE store.products SET price_cents = price_cents + 200 WHERE id = 1;
```
اگر تراکنش ۱ اول کامیت شود، چه سرنوشتی در انتظار تراکنش ۲ خواهد بود؟

**پاسخ:**  
تراکنش ۲ تا زمان اتمام تراکنش ۱ در حالت انتظار می‌ماند. به محض کامیت تراکنش ۱، تراکنش ۲ بلافاصله با خطای زیر متوقف می‌شود:  
`ERROR: could not serialize access due to concurrent update (SQLSTATE 40001)`  
زیرا در سطح `REPEATABLE READ`، تراکنش مجاز به تغییر سطری نیست که پس از گرفته شدن تصویر اولیه اسنپ‌شات آن، توسط تراکنش دیگری ویرایش و ذخیره شده باشد.

---

## منابع رسمی
- [مستندات PostgreSQL: سطوح ایزولاسیون تراکنش‌ها](https://www.postgresql.org/docs/current/transaction-iso.html)
- [مستندات PostgreSQL: ایزولاسیون اسنپ‌شات سریالایزبل (SSI)](https://wiki.postgresql.org/wiki/SSI)

</div>

