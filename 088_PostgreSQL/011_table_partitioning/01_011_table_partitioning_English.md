[← Contents and learning path](../README.md) | [فارسی](01_011_table_partitioning_Persian.md)

# 011 — Declarative Table Partitioning and Pruning

## Learning Goals
Master native Declarative Table Partitioning (Range, List, Hash). Learn the mechanics of Partition Pruning, attach/detach operations for zero-downtime data archival, and primary key constraints on partitioned relations.

---

## 1. Partitioning Architectures

Partitioning splits a massive logical table into smaller physical backing tables without changing how client applications write queries (`INSERT`, `SELECT`, and `UPDATE` target the parent table):

```text
Logical Parent Table: store.orders (PARTITION BY RANGE (order_date))
                     │
     ┌───────────────┼───────────────┬───────────────┐
     v               v               v               v
orders_2026_q1  orders_2026_q2  orders_2026_q3  orders_2026_q4
[Jan-Mar 2026]  [Apr-Jun 2026]  [Jul-Sep 2026]  [Oct-Dec 2026]
```

### Partitioning Strategies
1. **RANGE Partitioning:** Best for time-series, log data, and date-based financial records.
2. **LIST Partitioning:** Best for discrete categorical keys (e.g., `country_code IN ('US', 'CA')`, `tenant_id`).
3. **HASH Partitioning:** Best for evenly distributing write throughput across $N$ partitions without logical boundaries.

---

## 2. Partition Pruning Mechanics

Partition Pruning allows the query optimizer to skip scanning partitions whose bounds cannot possibly satisfy the query's `WHERE` predicates:

```sql
-- Ensure pruning is enabled in configuration (default on)
SET enable_partition_pruning = on;

-- Query filtering on partition key:
EXPLAIN (ANALYZE, BUFFERS)
SELECT * 
FROM store.orders 
WHERE order_date BETWEEN '2026-02-01' AND '2026-02-15';
```

### Plan Inspection:
In the execution plan output, only `store.orders_2026_q1` is scanned. `orders_2026_q2`, `orders_2026_q3`, and `orders_2026_q4` are marked as **`(never executed)`** and omitted completely from disk I/O!

---

## 3. The Primary Key Rule on Partitioned Tables

> **Absolute Constraint Rule:**  
> A unique constraint or `PRIMARY KEY` on a partitioned table **must include all the columns in the partition key**.

```sql
-- Valid Primary Key:
CREATE TABLE store.metrics (
    metric_id BIGINT,
    recorded_at TIMESTAMPTZ,
    value NUMERIC(10,2),
    PRIMARY KEY (metric_id, recorded_at)
) PARTITION BY RANGE (recorded_at);

-- INVALID: PRIMARY KEY (metric_id) would fail because PostgreSQL 
-- enforces uniqueness on local partitions, not across independent partitions!
```

---

## 4. Zero-Downtime Data Archival (`DETACH CONCURRENTLY`)

Dropping or archiving billions of old rows via `DELETE FROM orders WHERE order_date < '2025-01-01'` triggers massive WAL generation and table bloat. Partitioning allows instantaneous O(1) drop or archive:

```sql
-- Step 1: Detach old partition concurrently without blocking active read/write queries
ALTER TABLE store.orders 
DETACH PARTITION store.orders_2025_q4 CONCURRENTLY;

-- Step 2: The detached partition is now a standalone independent table!
-- You can dump it to cold S3 storage:
-- pg_dump -t store.orders_2025_q4 engineering_db | gzip > archive_2025_q4.sql.gz

-- Step 3: Instantaneous drop without vacuum overhead:
DROP TABLE store.orders_2025_q4;
```

---

## 5. Exercise and Verification

**Exercise:**
A query on a partitioned table queries:
`SELECT * FROM store.orders WHERE user_id = '00000000-0000-0000-0000-000000000001'::uuid;`
The table is partitioned by `order_date`. Why does this query take longer than expected, and what architectural pattern solves this?

**Answer:**
Because the query does not specify `order_date`, the optimizer cannot prune any partitions. It must perform an index scan across **all** individual child partitions and combine the results via `Append`.
*Solution:* If high-frequency queries filter by `user_id` without dates, consider sub-partitioning (compound partition by date, then hash on user_id) or maintaining a global reverse lookup index table.

---

## Official References
- [PostgreSQL Documentation: Chapter 5.11 - Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)
- [PostgreSQL Documentation: ALTER TABLE Partition Operations](https://www.postgresql.org/docs/current/sql-altertable.html)

