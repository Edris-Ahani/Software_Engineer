[← Contents and learning path](../README.md) | [فارسی](01_013_full_text_search_Persian.md)

# 013 — Full-Text Search: tsvector, tsquery, and Ranking

## Learning Goals
Implement native, production-ready Full-Text Search (FTS) within PostgreSQL without requiring external infrastructure like Elasticsearch. Master `tsvector`, `tsquery`, relevance ranking (`ts_rank`), headline snippets, and GIN index optimization.

---

## 1. Why `LIKE '%text%'` Fails in Production

```sql
-- DANGEROUS AT SCALE:
SELECT * FROM store.products WHERE description LIKE '%distributed%';
```
- Cannot use B-Tree index (leading wildcard forces 100% sequential scan).
- Ignores word stems (searching `distributed` misses `distributes` or `distribution`).
- No relevance scoring (cannot rank matches by importance).

---

## 2. Core Concepts: `tsvector` and `tsquery`

- **`tsvector` (Text Search Vector):** A sorted list of distinct, stemmed lexemes mapped to their positional weights (`A, B, C, D`).
- **`tsquery` (Text Search Query):** Lexemes combined with boolean operators (`&` AND, `|` OR, `!` NOT, `<->` FOLLOWED BY).

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

## 3. High-Performance FTS Schema Pattern

Always precompute `tsvector` in a generated column backed by a GIN index:

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

## 4. Querying with Relevance Ranking and Highlighting

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

## 5. PostgreSQL FTS vs. Dedicated Search Engines (Elasticsearch)

| Dimension | PostgreSQL Native FTS | Elasticsearch / Meilisearch |
| :--- | :--- | :--- |
| **Data Consistency** | **Strict ACID (100% synchronous).** Zero lag between write and searchability. | Eventual consistency (indexing latency). |
| **Operational Overhead**| **Zero extra infrastructure.** Runs in existing PostgreSQL cluster. | High (separate JVM cluster, nodes, shards, memory overhead). |
| **Fuzzy / Typo Search** | Basic trigram matching via `pg_trgm`. | Advanced BM25, phonetic (Metaphone), deep language analyzers. |
| **When to Use** | Up to 10-20 million documents with standard boolean and stemmed search. | Hundreds of millions of documents, complex faceted search, heavy analytical aggregations. |

---

## 6. Exercise and Verification

**Exercise:**
A user searches for `'systems'` but the product description only contains `'system'`. Why does `search_vector @@ to_tsquery('english', 'systems')` match successfully, whereas `metadata->>'desc' LIKE '%systems%'` fails?

**Answer:**
Because PostgreSQL's `english` text search dictionary applies the **Snowball Stemmer**. Both `'systems'` and `'system'` are reduced to the identical canonical root lexeme: `'system'`. The `@@` match operator compares canonical lexemes, not raw substring characters.

---

## Official References
- [PostgreSQL Documentation: Chapter 12 - Full Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [PostgreSQL Documentation: Text Search Parsers and Dictionaries](https://www.postgresql.org/docs/current/textsearch-parsers.html)

