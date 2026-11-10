<div dir="rtl">

[← فهرست و مسیر یادگیری](../README.md) | [English Version](01_005_indexes_deep_dive_English.md)

# 005 — تحلیل عمیق انواع ایندکس‌ها: B-Tree، GIN، GiST و BRIN

## هدف یادگیری
تسلط بر ساختار و موتورهای دسترسی مختلف ایندکس در PostgreSQL؛ انتخاب دقیق بین B-Tree، GIN، GiST و BRIN، بهینه‌سازی خواندن بدون رجوع به جدول اصلی با Covering Indexes (`INCLUDE`) و کاهش حجم ایندکس با Partial Indexes.

---

## ۱. جدول مقایسه‌ای موتورهای ایندکس

```text
+--------------------------------------------------------------------------------+
| نوع ایندکس     | مهم‌ترین کاربرد                    | عملگرهای مورد پشتیبانی    |
+----------------+-----------------------------------+---------------------------+
| B-Tree         | جستجوهای تک‌مقداری و مرتب‌سازی    | =, <, <=, >, >=, BETWEEN  |
| GIN            | داده‌های ترکیبی، آرایه‌ها و JSONB | @>, ?, ?|, &&, @@ (متن)   |
| GiST           | داده‌های مکانی، بازه‌ای، فازی و FTS| &&, @>, <@, <-> (فاصله)   |
| BRIN           | جداول عظیم لاگ و داده‌های زمانی   | =, <, <=, >, >=, BETWEEN  |
| SP-GiST        | ساختارهای نامتوازن مثل آی‌پی، ترای| <<, >>, =, <@             |
| Hash           | تساوی دقیق O(1) (به ندرت استفاده) | =                         |
+--------------------------------------------------------------------------------+
```

---

## ۲. ایندکس‌های پوشش‌دهنده (Covering Indexes با عبارت `INCLUDE`)

در ایندکس پیش‌فرض B-Tree، برگه‌های درخت حاوی مقدار کلید و آدرس سطر فیزیکی روی دیسک (`TID`) هستند. اگر کوئری ستون‌های دیگری را درخواست کند، موتور دیتابیس باید به دیسک یا کش جدول رجوع کند (Heap Fetch).

### اسکن مستقیم از ایندکس (Index-Only Scan)
با افزودن ستون‌های غیرکلیدی در بند `INCLUDE`، دیتابیس تمام داده‌های درخواستی را مستقیماً از برگه‌های ایندکس بازمی‌گرداند:

```sql
-- Standard lookup requiring heap fetch for 'status' and 'total_amount_cents'
-- CREATE INDEX idx_orders_user ON store.orders(user_id);

-- Covering Index: Stores user_id in the B-Tree search structure,
-- and attaches status and total_amount_cents at the leaf payload without tree overhead
CREATE INDEX idx_orders_user_covering 
ON store.orders (user_id) 
INCLUDE (status, total_amount_cents);

-- This query now performs an ultra-fast Index-Only Scan:
EXPLAIN (ANALYZE, BUFFERS)
SELECT status, total_amount_cents
FROM store.orders
WHERE user_id = '00000000-0000-0000-0000-000000000001'::uuid;
```

> **پیش‌نیاز حیاتی Index-Only Scan:** نقشهٔ رویت‌پذیری (Visibility Map) باید تایید کند که صفحهٔ فیزیکی بدون نسخه مرده (Dead Tuple) است. بنابراین انجام منظم عملیات `VACUUM` الزامی است.

---

## ۳. جادوی ایندکس BRIN در کلان‌داده‌ها

ایندکس BRIN (Block Range Index) کل صفحات دیسک (پیش‌فرض: ۱۲۸ صفحه دیسک / ۱ مگابایت) را خلاصه کرده و فقط مقدار `[MIN, MAX]` هر محدوده بلوک را نگه می‌دارد.

```text
BRIN Page Summary:
[Block 000-127]: Min Date: 2026-01-01, Max Date: 2026-01-05
[Block 128-255]: Min Date: 2026-01-06, Max Date: 2026-01-10
[Block 256-383]: Min Date: 2026-01-11, Max Date: 2026-01-15
```

- **بهترین سناریو:** جداول لاگ، رخدادها، تراکنش‌های مالی و داده‌های سری زمانی که به ترتیب زمان ثبت به انتهای جدول اضافه می‌شوند (Append-only).
- **صرفه‌جویی در فضا:** جدولی با ۵۰۰ میلیون سطر که به ۱۵ گیگابایت ایندکس B-Tree نیاز دارد، با BRIN تنها **کمتر از ۲۰ مگابایت** فضا می‌گیرد!

```sql
CREATE TABLE analytics.event_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    payload TEXT
);

-- Ultra-lightweight BRIN index on physical timestamp order
CREATE INDEX idx_event_logs_brin 
ON analytics.event_logs USING BRIN (created_at) 
WITH (pages_per_range = 64);
```

---

## ۴. ایندکس‌های شرطی (Partial) و تابعی (Expression)

از هدر رفتن فضای رم و دیسک برای داده‌های غیرکاربردی جلوگیری کنید:

```sql
-- Partial Index: Index ONLY failed jobs requiring investigation
-- Excludes 99.9% successful rows, saving enormous RAM and write overhead
CREATE INDEX idx_orders_failed 
ON store.orders (order_id) 
WHERE status = 'FAILED';

-- Expression / Functional Index: Case-insensitive unique search
CREATE UNIQUE INDEX idx_users_email_lower 
ON store.users (LOWER(email));
```

---

## ۵. تمرین سناریومحور و پاسخ

**صورت تمرین:**  
جدولی از رخدادهای سیستمی با ۲۰۰ میلیون سطر دارید که داده‌ها صرفاً به‌ترتیب زمان (`event_time`) درج می‌شوند. کوئری‌ها بازه زمانی ۷ روز گذشته را جستجو می‌کنند. ایندکس B-Tree فعلی بیش از ۶ گیگابایت حجم دارد و رم سرور را اشغال کرده است. چه راهکاری پیشنهاد می‌دهید و محدودیت آن چیست؟

**پاسخ:**  
جایگزینی با **ایندکس BRIN** (`CREATE INDEX ... USING BRIN (event_time)`).  
حجم ایندکس از ۶ گیگابایت به حدود ۱۵ مگابایت کاهش می‌یابد و فضای رم برای کش بافرها آزاد می‌شود.  
*محدودیت:* ساختار BRIN به همبستگی فیزیکی داده‌ها روی دیسک با مقادیر منطقی وابسته است. اگر آپدیت‌های نامنظم روی داده‌های قدیمی رخ دهد یا سطرها بدون ترتیب زمانی درج شوند، بازه‌های فیزیکی خراب شده و کارایی اسکن افت می‌کند.

---

## منابع رسمی
- [مستندات PostgreSQL: فصل ۱۱ - ایندکس‌ها](https://www.postgresql.org/docs/current/indexes.html)
- [مستندات PostgreSQL: انواع و رفتارهای ایندکس (Index Types)](https://www.postgresql.org/docs/current/indexes-types.html)

</div>

