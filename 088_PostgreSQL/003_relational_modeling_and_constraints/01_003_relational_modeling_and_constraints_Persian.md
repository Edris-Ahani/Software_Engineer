<div dir="rtl">

[← فهرست و مسیر یادگیری](../README.md) | [English Version](01_003_relational_modeling_and_constraints_English.md)

# 003 — مدل‌سازی رابطه‌ای، انواع کلیدها و قیدهای یکپارچگی داده

## هدف یادگیری
طراحی اسکیماهای استاندارد با تضمین سلامت داده در لایه دیتابیس؛ درک تفاوت کلیدهای جایگزین و طبیعی، مدیریت چندپارگی ایندکس بر اثر UUID، ضرورت ایندکس‌گذاری کلیدهای خارجی و قیدهای پیشرفته عدم تداخل (Exclusion Constraints).

---

## ۱. استراتژی‌های انتخاب کلید اصلی (Primary Key)

| نوع کلید | حجم ذخیره‌سازی | کارایی ایندکس (B-Tree Locality) | امنیت / غیرقابل حدس بودن |
| :--- | :--- | :--- | :--- |
| **`BIGINT IDENTITY`** | ۸ بایت | فوق‌العاده. به دلیل صعودی بودن، داده‌ها به انتهای برگه‌های B-Tree اضافه می‌شوند و حافظه کش دست‌نخورده می‌ماند. | ضعیف؛ امکان شمارش کل رکوردهای تجاری از طریق آدرس URL فراهم است. |
| **`UUIDv4` (رندوم)** | ۱۶ بایت | ضعیف در حجم نوشتاری بالا. رندوم بودن باعث درج تصادفی در کل صفحات درخت B-Tree، شکستن برگه‌ها (Page Splits) و تخلیه مکرر کش می‌شود. | بسیار بالا؛ هیچ ترتیبی قابل حدس نیست. |
| **`UUIDv7` (وابسته به زمان)** | ۱۶ بایت | عالی. ترکیب میلی‌ثانیه زمان در ابتدای بایت‌ها باعث رفتار ترتیبی همانند اعداد صعودی در ساختار B-Tree می‌شود. | عالی؛ تلفیق نظم مکانی بدون افشای تعداد رکوردها. |

```sql
-- Modern ANSI SQL standard Identity column (replaces legacy SERIAL)
CREATE TABLE store.merchants (
    merchant_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(200) NOT NULL
);

-- Recommended standard for distributed entity IDs
CREATE TABLE store.devices (
    device_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registered_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);
```

---

## ۲. دام بزرگ کلیدهای خارجی (Foreign Key) و ایندکس‌های گم‌شده

> **قانون طلایی کارایی در PostgreSQL:**  
> ساخت کلید خارجی (`FOREIGN KEY`) در PostgreSQL **به‌هیچ‌وجه** به‌صورت خودکار روی ستون جدول فرزند ایندکس نمی‌سازد!

اگر روی ستون ارجاع‌دهنده جدول فرزند ایندکس نسازید، با هر بار `DELETE` یا `UPDATE` روی سطر جدول والد (حتی با `ON DELETE CASCADE` یا `RESTRICT`)، دیتابیس مجبور به اسکن کامل (Sequential Scan) تمام جدول فرزند چندمیلیونی می‌شود که سیستم را به قفل کامل می‌کشاند!

```sql
-- Always index foreign key referencing columns on child tables
CREATE TABLE store.order_notes (
    note_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    order_date DATE NOT NULL,
    note_text TEXT NOT NULL,
    CONSTRAINT fk_order_notes FOREIGN KEY (order_id, order_date) 
        REFERENCES store.orders(order_id, order_date) ON DELETE CASCADE
);

-- Crucial: Create supporting index for foreign key cascades
CREATE INDEX idx_order_notes_order_fk ON store.order_notes (order_id, order_date);
```

---

## ۳. قیدهای اعتبارسنجی (CHECK) و تایپ‌های دامنه‌ای (DOMAINS)

بهترین روش برای تضمین منطق کسب‌وکار بدون وابستگی به باگ‌های کدهای کلاینت:

```sql
-- Custom reusable domain type
CREATE DOMAIN email_address AS VARCHAR(255)
    CHECK (VALUE ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Multi-column CHECK constraint on table
CREATE TABLE store.discounts (
    discount_id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('PERCENTAGE', 'FIXED_AMOUNT')),
    percentage_value NUMERIC(5,2) CHECK (percentage_value BETWEEN 0 AND 100),
    fixed_amount_cents INTEGER CHECK (fixed_amount_cents >= 0),
    -- Ensure values match discount type
    CONSTRAINT check_discount_validity CHECK (
        (discount_type = 'PERCENTAGE' AND percentage_value IS NOT NULL AND fixed_amount_cents IS NULL) OR
        (discount_type = 'FIXED_AMOUNT' AND fixed_amount_cents IS NOT NULL AND percentage_value IS NULL)
    )
);
```

---

## ۴. قیدهای عدم تداخل پیشرفته (Exclusion Constraints با GiST)

جلوگیری از رزروهای همزمان و تداخل بازه‌های زمانی در سطح انجین دیتابیس بدون نیاز به قفل‌های کند اپلیکیشن:

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE store.room_reservations (
    reservation_id BIGSERIAL PRIMARY KEY,
    room_number INT NOT NULL,
    time_slot TSRANGE NOT NULL,
    -- Disallow overlapping time slots for the exact same room
    CONSTRAINT no_overlapping_reservations 
        EXCLUDE USING gist (room_number WITH =, time_slot WITH &&)
);

-- Test insertion:
INSERT INTO store.room_reservations (room_number, time_slot)
VALUES (101, tsrange('2026-05-01 10:00:00', '2026-05-01 12:00:00'));

-- This conflicting insertion will fail immediately with constraint violation:
-- INSERT INTO store.room_reservations (room_number, time_slot)
-- VALUES (101, tsrange('2026-05-01 11:30:00', '2026-05-01 13:00:00'));
```

---

## ۵. تمرین سناریومحور و پاسخ

**صورت تمرین:**  
یکی از توسعه‌دهندگان می‌گوید: «من روی کلید خارجی جدول سفارشات `ON DELETE CASCADE` گذاشته‌ام، پس حذف مشتریان قبلی با سرعت بالا انجام خواهد شد.» آیا این حرف صحیح است؟ چگونه می‌توان کلیدهای خارجی فاقد ایندکس را در کل دیتابیس پیدا کرد؟

**پاسخ:**  
خیر؛ این ادعا در محیط‌های واقعی کاملاً نادرست است. اگر جدول سفارشات دارای ۵ میلیون سطر باشد و ستون `customer_id` ایندکس نداشته باشد، حذف یک مشتری باعث اسکن خطی تمام ۵ میلیون سطر شده و کل عملیات دیتابیس معطل جدول قفل‌شده خواهد ماند.  
کوئری شناسایی تمام کلیدهای خارجی بدون ایندکس:

```sql
SELECT
    conrelid::regclass AS child_table,
    conname AS foreign_key_name,
    pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
WHERE contype = 'f'
  AND NOT EXISTS (
      SELECT 1 FROM pg_index i
      WHERE i.indrelid = c.conrelid
        AND c.conkey = (i.indkey::int2[])[1:array_length(c.conkey, 1)]
  );
```

---

## منابع رسمی
- [مستندات PostgreSQL: تعریف جداول و قیدها (Constraints)](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [مستندات PostgreSQL: بازه‌ها و قیدهای Exclusion](https://www.postgresql.org/docs/current/rangetypes.html)

</div>

