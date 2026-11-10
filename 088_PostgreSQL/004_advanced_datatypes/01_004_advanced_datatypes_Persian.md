<div dir="rtl">

[← فهرست و مسیر یادگیری](../README.md) | [English Version](01_004_advanced_datatypes_English.md)

# 004 — انواع داده‌های پیشرفته: JSONB، آرایه‌ها و Range Types

## هدف یادگیری
تسلط بر ذخیره‌سازی و کوئری‌نویسی داده‌های نیمه‌ساختاریافته و بازه‌ای در PostgreSQL؛ بررسی عمیق تفاوت ساختار `JSON` و `JSONB`، استراتژی‌های ایندکس‌گذاری GIN، عملیات روی آرایه‌ها و کار با بازه‌های زمانی و عددی.

---

## ۱. تفاوت معماری JSON و JSONB

| معیار مقایسه | فرمت `JSON` | فرمت `JSONB` (باینری) |
| :--- | :--- | :--- |
| **نوع ذخیره‌سازی** | ذخیره متن خام عیناً با حفظ فاصله‌ها و ترتیب کلیدها. | ساختار باینری تجزیه‌شده (Decomposed Binary) با ایندکس داخلی کلیدها. |
| **سرعت نوشتن (Write)** | بسیار سریع (بدون پردازش معنایی سنگین). | اندکی کندتر (پردازش اولیه کلیدها و مرتب‌سازی ساختار باینری). |
| **سرعت خواندن (Read)** | کند (نیاز به Parse مجدد کل رشته متنی در هر بار خواندن). | فوق‌العاده سریع (دسترسی O(1) به کلیدها بدون اسکن متن). |
| **پشتیبانی از ایندکس** | عدم پشتیبانی از ایندکس معکوس GIN (فقط ایندکس Functional روی ستون متنی). | پشتیبانی کامل از ایندکس‌های معکوس پیشرفته (GIN Indexing). |
| **کلیدهای تکراری** | حفظ کلیدهای تکراری. | حذف موارد تکراری و نگهداری آخرین مقدار معتبر. |

> **قانون پروداکشن:** همواره از `JSONB` استفاده کنید، مگر اینکه الزام قانونی یا لاگینگی برای نگهداری دقیق قالب فاصله‌ها و متن خام وجود داشته باشد.

---

## ۲. عملگرها و کوئری‌های کاربردی JSONB

```sql
-- Query JSONB column using operators
-- '->' extracts as JSON object; '->>' extracts as plain TEXT
SELECT id, 
       metadata->'preferences' AS prefs_json,
       metadata->'preferences'->>'dark_mode' AS is_dark_text
FROM store.users
WHERE metadata->>'tier' = 'gold';

-- Containment operator '@>' (Optimized for GIN indexes)
SELECT id, email
FROM store.users
WHERE metadata @> '{"country": "IR", "tier": "platinum"}';

-- Existence operator '?' and '?|' (checks for key presence)
SELECT id, email
FROM store.users
WHERE metadata ? 'preferences';
```

### استراتژی‌های ایندکس‌گذاری JSONB: مقایسه `jsonb_ops` و `jsonb_path_ops`

```sql
-- Default GIN index (supports '@>', '?', '?&', '?|' on both keys and values)
CREATE INDEX idx_users_meta_default ON store.users USING GIN (metadata);

-- Path-only GIN index (smaller index size, supports only '@>', but faster lookups)
CREATE INDEX idx_users_meta_path ON store.users USING GIN (metadata jsonb_path_ops);

-- Expression B-Tree index for a specific high-frequency extracted scalar key
CREATE INDEX idx_users_tier_btree ON store.users ((metadata->>'tier'));
```

---

## ۳. انواع آرایه‌ای بومی (Array Types)

در PostgreSQL هر نوع داده اسکالر می‌تواند به‌صورت آرایه چندبعدی تعریف شود:

```sql
-- Querying array containment and overlaps
-- Products tagged with 'enterprise'
SELECT id, title, tags
FROM store.products
WHERE 'enterprise' = ANY(tags);

-- Array containment operator '@>' (tags contains both 'enterprise' AND 'tech')
SELECT id, title
FROM store.products
WHERE tags @> ARRAY['enterprise', 'tech'];

-- Array overlap operator '&&' (tags contains ANY element in the list)
SELECT id, title
FROM store.products
WHERE tags && ARRAY['cloud', 'hardware'];

-- Expanding array elements into relational rows
SELECT id, title, unnest(tags) AS individual_tag
FROM store.products
LIMIT 10;
```

---

## ۴. انواع بازه‌ای (Range Types)

انواع بازه‌ای بازنمایی مستقیم یک بازه پیوسته از مقادیر هستند و نیاز به تعریف دو ستون مجزای `start` و `end` را از بین می‌برند:

```sql
-- Built-in range types:
-- int4range, int8range, numrange, tsrange, tstzrange, daterange

-- Determine if a date falls inside a seasonal campaign range
SELECT daterange('2026-03-21', '2026-06-21', '[]') @> '2026-05-15'::date AS is_in_spring;

-- Check if two employee shifts overlap
SELECT tsrange('2026-05-01 08:00', '2026-05-01 16:00') &&
       tsrange('2026-05-01 14:00', '2026-05-01 22:00') AS has_shift_overlap;
```

---

## ۵. تمرین سناریومحور و پاسخ

**صورت تمرین:**  
کوئری‌ای با شرط `metadata @> '{"country": "DE"}'` روی جدولی با ۱۰ میلیون رکورد اجرا می‌شود. دو ایندکس زیر توسط تیم پیشنهاد شده است:
۱. `CREATE INDEX idx_1 ON store.users USING GIN (metadata);`
۲. `CREATE INDEX idx_2 ON store.users USING GIN (metadata jsonb_path_ops);`  
کدام ایندکس حجم دیسک کمتر و سرعت اجرای بالاتری برای عملگر شمول (`@>`) ارائه می‌دهد؟

**پاسخ:**  
ایندکس `idx_2` با کلاس عملگر `jsonb_path_ops`.  
این کلاس به‌جای ایندکس جداگانه‌ی تک‌تک کلیدها و مقادیر، هش مسیر کامل کلید و مقدار را به‌صورت توکن‌های ۳۲ بیتی ذخیره می‌کند. در نتیجه حجم فایل ایندکس روی دیسک تا ۶۰٪ کمتر بوده و جستجوی `@>` بسیار سریع‌تر انجام می‌شود. تنها نکته این است که `jsonb_path_ops` از عملگرهای بررسی وجود کلید (`?`) پشتیبانی نمی‌کند.

---

## منابع رسمی
- [مستندات PostgreSQL: انواع داده‌های JSON و JSONB](https://www.postgresql.org/docs/current/datatype-json.html)
- [مستندات PostgreSQL: انواع داده‌های بازه‌ای (Range Types)](https://www.postgresql.org/docs/current/rangetypes.html)

</div>

