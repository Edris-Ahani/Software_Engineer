<div dir="rtl">

[← فهرست و مسیر یادگیری](../README.md) | [English Version](01_014_extensions_ecosystem_English.md)

# 014 — اکوسیستم اکستنشن‌ها: pgvector، pg_trgm و PostGIS

## هدف یادگیری
تسلط بر معماری ماژولار افزونه‌ها (Extensions) در PostgreSQL؛ ذخیره‌سازی و ایندکس بردارها برای مدل‌های هوش مصنوعی با `pgvector`، جستجوی فازی و تسریع دستورات `LIKE '%...%'` با `pg_trgm`، کار با داده‌های مکانی در `PostGIS` و اتصال به سرورهای راه دور با `postgres_fdw`.

---

## ۱. معماری و چرخه حیات افزونه‌ها در PostgreSQL

برخلاف دیتابیس‌های تک‌سنگی، در PostgreSQL کتابخانه‌های توسعه‌یافته به زبان C می‌توانند مستقیماً به پارسر، موتور ایندکس، انواع داده و برنامه‌ریز کوئری اضافه شوند:

```sql
-- View all extensions available on the system
SELECT name, default_version, installed_version, comment 
FROM pg_available_extensions
WHERE installed_version IS NOT NULL;

-- Enabling an extension in the current database
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "postgres_fdw";
```

---

## ۲. جستجوی معنایی و هوش مصنوعی با `pgvector`

افزونه `pgvector` پایگاه‌داده PostgreSQL را به یک Vector Database بومی با پشتیبانی کامل از معماری RAG و مدل‌های زبانی بزرگ تبدیل می‌کند:

```sql
-- Create table with 1536-dimensional embeddings (e.g., OpenAI text-embedding-3-small)
CREATE TABLE store.document_embeddings (
    doc_id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding vector(1536)
);

-- Nearest Neighbor Search Operators:
-- '<->' : Euclidean distance (L2)
-- '<=>' : Cosine distance (Cosine similarity = 1 - cosine distance)
-- '<#>' : Negative inner product (Dot product)
```

### مقایسه ایندکس‌های برداری: HNSW در برابر IVFFlat

| معیار | ساختار **HNSW** (گراف جهان کوچک) | ساختار **IVFFlat** (فایل معکوس مسطح) |
| :--- | :--- | :--- |
| **سرعت و دقت بازخوانی (Recall)** | فوق‌العاده. بازخوانی بالای ۹۸٪ در زمان زیر میلی‌ثانیه. | خوب. نیازمند تنظیم پارامتر `probes` در هر جستجو. |
| **مصرف رم و زمان ساخت** | مصرف رم بالاتر هنگام ساخت ایندکس. | زمان ساخت سریع‌تر و مصرف رم بسیار کمتر. |
| **نیاز به داده اولیه** | نیاز ندارد. بلافاصله روی جدول خالی یا کوچک ساخته می‌شود. | قبل از ساخت جدول باید دارای رکوردهای نمونه برای کلاسترینگ باشد. |

```sql
-- Production HNSW index using Cosine distance:
CREATE INDEX idx_docs_hnsw ON store.document_embeddings 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Semantic search query retrieving top 5 most relevant documents:
SELECT doc_id, content, 
       1 - (embedding <=> '[0.012, -0.045, ...]'::vector) AS cosine_similarity
FROM store.document_embeddings
ORDER BY embedding <=> '[0.012, -0.045, ...]'::vector
LIMIT 5;
```

---

## ۳. جستجوی فازی و متنی با افزونه `pg_trgm`

افزونه Trigram متن را به بخش‌های همپوشان ۳ حرفی تقسیم می‌کند (مثلاً کلمه `"book"` به قطعات `["  b", " bo", "ook", "ok "]` تبدیل می‌شود):

```sql
-- Calculate similarity score between two strings (0.0 to 1.0)
SELECT similarity('PostgreSQL', 'Postgres'); -- Returns ~0.73

-- Accelerating arbitrary LIKE '%substring%' queries using GIN:
CREATE INDEX idx_products_title_trgm 
ON store.products USING GIN (title gin_trgm_ops);

-- This query now uses a Bitmap Index Scan instead of a sequential table scan:
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, title
FROM store.products
WHERE title LIKE '%Perform%';
```

---

## ۴. کوئری روی دیتابیس‌های دیگر با `postgres_fdw`

این افزونه امکان اجرای مستقیم دستورات SQL و Join بین جداول دیتابیس‌های مجزای راه دور و دیتابیس محلی را فراهم می‌کند:

```sql
CREATE EXTENSION IF NOT EXISTS postgres_fdw;

-- Define remote foreign server
CREATE SERVER billing_cluster
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host '10.0.1.50', port '5432', dbname 'billing_prod');

-- Map local database user to remote credentials
CREATE USER MAPPING FOR current_user
SERVER billing_cluster
OPTIONS (user 'readonly_analyst', password 'secret_token');

-- Import remote foreign table definition
IMPORT FOREIGN SCHEMA public LIMIT TO (invoices)
FROM SERVER billing_cluster INTO store;

-- Query remote invoices table and join with local store.users seamlessly!
SELECT u.email, inv.invoice_number, inv.amount
FROM store.users u
JOIN store.invoices inv ON inv.customer_email = u.email;
```

---

## ۵. تمرین سناریومحور و پاسخ

**صورت تمرین:**  
کوئری فیلتر عنوان کالا با عبارت `WHERE title ILIKE '%cloud%'` روی جدول ۵ میلیون رکوردی بسیار کند است. ایندکس B-Tree روی ستون `title` وجود دارد اما برنامه‌ریز آن را نادیده گرفته و اسکن کامل دیسک انجام می‌دهد. علت چیست و چگونه مشکل رفع می‌شود؟

**پاسخ:**  
ایندکس B-Tree داده‌ها را از چپ به راست مرتب می‌کند. وقتی الگوی جستجو با علامت درصد آغاز شود (`%cloud%`)، جستجوی ریشه‌ای B-Tree عملاً ناممکن است.  
*راه‌حل:* ایجاد ایندکس تری‌گرام از نوع GIN:  
`CREATE INDEX idx_products_trgm ON store.products USING GIN (title gin_trgm_ops);`  
ایندکس GIN تک‌تک تری‌گرام‌های ۳ حرفی کلمات را ثبت می‌کند و موتور می‌تواند با ادغام برگه‌های ایندکس (Bitmap Index Scan)، کوئری را در چند میلی‌ثانیه پاسخ دهد.

---

## منابع رسمی
- [مخزن رسمی و مستندات pgvector](https://github.com/pgvector/pgvector)
- [مستندات PostgreSQL: افزونه pg_trgm و جستجوی فازی](https://www.postgresql.org/docs/current/pgtrgm.html)
- [مستندات PostgreSQL: افزونه اتصال راه دور postgres_fdw](https://www.postgresql.org/docs/current/postgres-fdw.html)

</div>

