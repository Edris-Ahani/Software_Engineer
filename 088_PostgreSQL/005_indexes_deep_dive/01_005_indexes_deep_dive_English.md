[← Contents and learning path](../README.md) | [فارسی](01_005_indexes_deep_dive_Persian.md)

# 005 — Indexes Deep Dive: B-Tree, GIN, GiST, and BRIN

## Learning Goals
Understand PostgreSQL's specialized index access methods. Learn when to employ B-Tree, GIN, GiST, and BRIN, optimize query paths via Covering Indexes (`INCLUDE`), construct partial indexes, and eliminate index bloat.

---

## 1. Index Access Methods Overview

```text
+--------------------------------------------------------------------------------+
| ACCESS METHOD  | PRIMARY USE CASE                  | SUPPORTED OPERATORS       |
+----------------+-----------------------------------+---------------------------+
| B-Tree         | General scalar lookups, sorting   | =, <, <=, >, >=, BETWEEN  |
| GIN            | Composite elements, JSONB, Arrays | @>, ?, ?|, &&, @@ (FTS)   |
| GiST           | Geospatial, multidimensional, FTS | &&, @>, <@, <-> (Distance)|
| BRIN           | Huge append-only time-series data | =, <, <=, >, >=, BETWEEN  |
| SP-GiST        | Non-balanced data, IP, Quadtrees  | <<, >>, =, <@             |
| Hash           | O(1) exact equality (rarely used) | =                         |
+--------------------------------------------------------------------------------+
```

---

## 2. B-Tree and Covering Indexes (`INCLUDE`)

A standard B-Tree index stores keys and points to the Heap Tuple ID (`TID` = `Page#, Offset#`). When a query requests columns not present in the index leaf, PostgreSQL must fetch the physical table page (Heap Fetch).

### Index-Only Scan with Covering Indexes
By appending non-search payload columns with the `INCLUDE` clause, PostgreSQL satisfies queries directly from the index leaves:

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

> **Requirement for Index-Only Scans:** The PostgreSQL **Visibility Map** must mark the page as all-visible; otherwise, the engine still visits the table heap to verify MVCC tuple visibility. Regular `VACUUM` is essential!

---

## 3. BRIN (Block Range Index): The Big Data Secret

BRIN summarizes entire disk page ranges (default: 128 table pages / 1MB block) by recording only the `[MIN, MAX]` value within each range.

```text
BRIN Page Summary:
[Block 000-127]: Min Date: 2026-01-01, Max Date: 2026-01-05
[Block 128-255]: Min Date: 2026-01-06, Max Date: 2026-01-10
[Block 256-383]: Min Date: 2026-01-11, Max Date: 2026-01-15
```

- **Ideal For:** Append-only log tables, event streams, and audit histories naturally clustered by time or sequential ID.
- **Disk Footprint:** A table of 500 million rows requiring a 15GB B-Tree index often requires **less than 20MB** with BRIN!

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

## 4. Partial and Expression Indexes

Avoid wasting index storage on non-selective or inactive rows:

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

## 5. Exercise and Verification

**Exercise:**
A reporting table has 200 million rows inserted strictly in chronological order (`event_time`). Queries always query date ranges like `WHERE event_time >= NOW() - INTERVAL '7 days'`. The DBA created a standard B-Tree index which occupies 6 GB of RAM, causing cache evictions. What alternative index should be evaluated, and what happens if data is updated out-of-order?

**Answer:**
A **BRIN (Block Range Index)** should be used (`CREATE INDEX ... USING BRIN (event_time)`). It will compress the index size from 6 GB down to ~15 MB, leaving RAM free for `shared_buffers`.
*Caveat with out-of-order data:* BRIN relies on correlation between physical disk placement and logical values. If extensive random updates or out-of-order inserts occur, range boundaries degrade, resulting in wider page scans.

---

## Official References
- [PostgreSQL Documentation: Chapter 11 - Indexes](https://www.postgresql.org/docs/current/indexes.html)
- [PostgreSQL Documentation: Index Types and Access Methods](https://www.postgresql.org/docs/current/indexes-types.html)

