<div dir="rtl">

[← فهرست و مسیر یادگیری](../README.md) | [English Version](01_013_full_text_search_English.md)

# 013 — جستجوی متنی پیشرفته (Full-Text Search)

## هدف یادگیری
پیاده‌سازی موتور جستجوی متنی بومی، دقیق و سازمانی در PostgreSQL بدون نیاز به ابزارهای خارجی مثل Elasticsearch؛ تسلط بر ساختارهای `tsvector` و `tsquery`، رتبه‌بندی نتایج بر اساس میزان ارتباط (`ts_rank`)، هایلایت کردن عبارات جستجو و ایندکس‌گذاری GIN.

---

## ۱. چرا استفاده از `LIKE '%text%'` در پروداکشن مردود است؟

```sql
-- DANGEROUS AT SCALE:
SELECT * FROM store.products WHERE description LIKE '%distributed%';
```
- عدم امکان استفاده از ایندکس‌های B-Tree (وجود علامت `%` در ابتدا موتور را وادار به اسکن کامل جدول می‌کند).
- عدم درک ریشه کلمات (Stemming)؛ جستجوی `running` رکوردهای شامل `run` یا `runs` را پیدا نمی‌کند.
- عدم وجود نمره ارتباط (Relevance Score)؛ امکان مرتب‌سازی نتایج بر اساس میزان تطابق وجود ندارد.

---

## ۲. مفاهیم پایه: `tsvector` و `tsquery`

- **`tsvector` (بردار متنی):** فهرستی مرتب از ریشه‌های یکتای واژگان (Lexemes) به همراه موقعیت و وزن اهمیت آن‌ها (`A, B, C, D`).
- **`tsquery` (پرس‌وجوی متنی):** واژگانی که با عملگرهای منطقی (`&` برای AND، `|` برای OR، `!` برای NOT و `<->` برای مجاورت) ترکیب شده‌اند.

```sql
-- Convert text to normalized lexemes:
-- Returns: 'databas':2 'engin':4 'postgr':1
SELECT to_tsvector('english', 'Postgres databases and engines');

-- Create boolean search queries:
SELECT to_tsquery('english', 'postgres & (database | engine)');

-- websearch_to_tsquery (Parses Google-style queries with quotes and minus signs):
-- Search: postgres "high availability" -mysql
SELECT websearch_to_tsquery('english', 'postgres "high availability" -mysql');
```

---

## ۳. الگوی استاندارد و با کارایی بالا در اسکیما

همواره بردار متنی را در قالب یک ستون محاسباتی ذخیره‌شده (Stored Generated Column) مجهز به ایندکس GIN پیاده‌سازی کنید:

```sql
ALTER TABLE store.products 
ADD COLUMN search_vector tsvector 
GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
) STORED;

-- Create GIN index for sub-millisecond search across millions of rows
CREATE INDEX idx_products_search_gin ON store.products USING GIN (search_vector);
```

---

## ۴. رتبه‌بندی نتایج و هایلایت کردن کلمات (Snippet)

```sql
SELECT 
    id,
    title,
    -- Calculate relevance score based on word frequency and weights (A=1.0, B=0.4)
    ts_rank_cd(search_vector, query) AS rank_score,
    -- Extract context headline snippet with highlighted tags
    ts_headline(
        'english', 
        description, 
        query, 
        'StartSel=<b>, StopSel=</b>, MaxWords=20, MinWords=5'
    ) AS snippet
FROM store.products, 
     websearch_to_tsquery('english', 'database engineering') query
WHERE search_vector @@ query
ORDER BY rank_score DESC
LIMIT 10;
```

---

## ۵. مقایسه جستجوی متنی داخلی PostgreSQL با Elasticsearch

| معیار مقایسه | جستجوی متنی داخلی PostgreSQL | موتور مجزا (Elasticsearch / Meilisearch) |
| :--- | :--- | :--- |
| **یکپارچگی داده (Consistency)** | **کاملاً همگام و ACID.** داده به محض ذخیره شدن قابل جستجو است. | غیرهمگام (Eventual Consistency) و دارای تأخیر در ایندکس. |
| **هزینه زیرساخت و نگهداری** | **صفر.** روی همان کلاستر موجود اجرا می‌شود. | بالا (سرورهای مستقل، تنظیمات JVM، رم زیاد، مدیریت کلاستر). |
| **جستجوی فازی و غلط‌های املایی** | پایه‌ای از طریق افزونه `pg_trgm`. | بسیار پیشرفته (الگوریتم BM25 و موتورهای آوایی). |
| **چه زمانی کافی است؟** | تا ۱۰ الی ۲۰ میلیون سند متنی با نیازهای جستجوی استاندارد تجاری. | صدها میلیون سند، جستجوهای فست‌دار پیچیده و لاگ‌کاوی گسترده. |

---

## ۶. تمرین سناریومحور و پاسخ

**صورت تمرین:**  
کاربری واژه `'systems'` را جستجو می‌کند در حالی که در متن محصول واژه `'system'` درج شده است. چرا عملگر `search_vector @@ to_tsquery('english', 'systems')` نتیجه را با موفقیت پیدا می‌کند اما عملگر `LIKE '%systems%'` شکست می‌خورد؟

**پاسخ:**  
دیکشنری متنی انگلیسی PostgreSQL از الگوریتم ریشه‌یابی Snowball Stemmer استفاده می‌کند. این الگوریتم هم واژه جمع `'systems'` و هم واژه مفرد `'system'` را به ریشه واحد `'system'` تبدیل می‌کند. در نتیجه عملگر `@@` ریشه‌های یکسان واژگان را تطبیق می‌دهد، در حالی که `LIKE` صرفاً کاراکترهای خام رشته متنی را مقایسه می‌کند.

---

## منابع رسمی
- [مستندات PostgreSQL: فصل ۱۲ - جستجوی متنی (Full Text Search)](https://www.postgresql.org/docs/current/textsearch.html)
- [مستندات PostgreSQL: دیکشنری‌ها و پارسرهای متنی](https://www.postgresql.org/docs/current/textsearch-parsers.html)

</div>

