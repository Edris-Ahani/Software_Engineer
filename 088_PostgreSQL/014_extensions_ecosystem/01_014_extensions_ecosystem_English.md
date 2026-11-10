[← Contents and learning path](../README.md) | [فارسی](01_014_extensions_ecosystem_Persian.md)

# 014 — Extensions Ecosystem: pgvector, pg_trgm, and PostGIS

## Learning Goals
Harness PostgreSQL's extensible plugin architecture. Learn how to store and index AI vector embeddings with `pgvector`, execute typo-tolerant fuzzy substring searches with `pg_trgm`, query remote tables with Foreign Data Wrappers (`postgres_fdw`), and handle geospatial data with `PostGIS`.

---

## 1. Extension Architecture Overview

Unlike monolithic database engines, PostgreSQL allows external C libraries to hook directly into the parser, type system, index engine, and planner:

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

## 2. AI Vector Search with `pgvector`

`pgvector` turns PostgreSQL into a native vector database for Large Language Models (LLMs), RAG (Retrieval-Augmented Generation), and semantic search:

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

### Vector Indexing: HNSW vs. IVFFlat

| Dimension | **HNSW** (Hierarchical Navigable Small World) | **IVFFlat** (Inverted File Flat) |
| :--- | :--- | :--- |
| **Search Speed & Recall** | Outstanding. Delivers >98% recall at sub-millisecond latencies. | Good. Requires tuning `probes` per query. |
| **Build Time & RAM** | Higher RAM footprint during index build. | Low RAM; quick index construction. |
| **Training Requirement** | None. Can be created on empty or small tables immediately. | Requires table to already contain representative data clusters. |

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

## 3. Fuzzy Text Matching with `pg_trgm`

Trigrams break text into overlapping 3-character slices (e.g., `"word"` becomes `["  w", " wo", "ord", "rd "]`):

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

## 4. Querying Remote Databases with `postgres_fdw`

Foreign Data Wrappers allow your application to query tables residing on separate PostgreSQL clusters as if they were local tables:

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

## 5. Exercise and Verification

**Exercise:**
A query searching for product titles with `WHERE title ILIKE '%cloud%'` performs a slow sequential scan across 5 million products. A B-Tree index on `title` exists but is completely ignored by the planner. Why is the B-Tree ignored, and how does `pg_trgm` solve this?

**Answer:**
A B-Tree index is sorted lexicographically from left to right. Because the search pattern begins with a wildcard (`%cloud%`), the B-Tree cannot perform an ordered root-to-leaf traversal.
*Solution:* Create a trigram GIN index:
`CREATE INDEX idx_products_trgm ON store.products USING GIN (title gin_trgm_ops);`
The GIN index stores individual 3-character trigrams (`"  c"`, `" cl"`, `"lou"`, `"oud"`, `"ud "`). The planner uses a Bitmap Index Scan to intersect matching trigram leaves, accelerating the query by several orders of magnitude.

---

## Official References
- [pgvector Official GitHub & Documentation](https://github.com/pgvector/pgvector)
- [PostgreSQL Documentation: Chapter 44 - pg_trgm Extension](https://www.postgresql.org/docs/current/pgtrgm.html)
- [PostgreSQL Documentation: postgres_fdw Foreign Data Wrapper](https://www.postgresql.org/docs/current/postgres-fdw.html)

