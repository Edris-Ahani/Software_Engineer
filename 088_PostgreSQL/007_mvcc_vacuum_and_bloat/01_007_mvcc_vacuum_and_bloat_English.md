[← Contents and learning path](../README.md) | [فارسی](01_007_mvcc_vacuum_and_bloat_Persian.md)

# 007 — MVCC, VACUUM, Autovacuum, and Table Bloat

## Learning Goals
Understand PostgreSQL's Multi-Version Concurrency Control (MVCC) internals, tuple headers (`xmin`, `xmax`, `ctid`), the cost of `UPDATE` statements, Heap-Only Tuples (HOT), and how to tune Autovacuum to prevent catastrophic table bloat and transaction ID wraparound.

---

## 1. MVCC Internal Mechanics

In PostgreSQL, **readers never block writers, and writers never block readers**. This is achieved by creating new physical versions of rows rather than mutating existing disk bytes in place:

```text
Physical Disk Page (8KB)
+-------------------------------------------------------------------------------+
| Page Header | Line Pointers [LP1, LP2, ...] ───┐                              |
+------------------------------------------------│------------------------------+
|                                                v                              |
| Tuple #1 (Original Row):                       Tuple #2 (Updated Row):        |
| - xmin: 501 (Created by Tx 501)                - xmin: 504 (Created by Tx 504)|
| - xmax: 504 (Deleted/Overwritten by Tx 504)    - xmax: 0   (Active)           |
| - ctid: (0, 2) [Points to newer version]       - ctid: (0, 2)                 |
| - Payload: status = 'PENDING'                  - Payload: status = 'PAID'     |
+-------------------------------------------------------------------------------+
```

### The Inherent Cost of `UPDATE`
When you execute an `UPDATE`:
1. The engine inserts a brand new tuple with the updated values.
2. The old tuple's `xmax` is set to the current transaction ID.
3. Once active transactions finish, the old tuple becomes a **Dead Tuple** (dead weight taking disk space).

---

## 2. Heap-Only Tuples (HOT) Optimization

Normally, updating a row requires adding a new index entry for every index on that table.  
The **HOT optimization** bypasses index overhead if:
1. No indexed column is modified by the `UPDATE`.
2. The page has enough free space to host the new tuple on the **same physical 8KB page**.

```sql
-- Reserve 20% free space per page specifically for fast HOT updates
ALTER TABLE store.orders SET (fillfactor = 80);
```

Check HOT update ratio in production:
```sql
SELECT relname,
       n_tup_upd,
       n_tup_hot_upd,
       round(100.0 * n_tup_hot_upd / nullif(n_tup_upd, 0), 2) AS hot_ratio_pct
FROM pg_stat_user_tables
WHERE n_tup_upd > 1000;
```

---

## 3. Standard VACUUM vs VACUUM FULL

| Feature | Standard `VACUUM` | `VACUUM FULL` |
| :--- | :--- | :--- |
| **Lock Level** | `SHARE UPDATE EXCLUSIVE` (Permits reads and writes). | `ACCESS EXCLUSIVE` (**Completely blocks all reads and writes**). |
| **Space Reclamation** | Marks dead tuple spaces as reusable by future `INSERT`/`UPDATE`. Does **not** shrink the OS file. | Rewrites entire table to a brand new physical file; shrinks OS disk size to zero dead space. |
| **Production Use** | Runs continuously in the background via Autovacuum. | Dangerous in production due to downtime. Use third-party `pg_repack` instead. |

---

## 4. Autovacuum Tuning Formula

Default PostgreSQL autovacuum settings are famously too conservative for high-throughput production workloads:

```ini
# Production adjustments in postgresql.conf
autovacuum_max_workers = 5
autovacuum_vacuum_cost_limit = 2000     # Increase from default 200 to allow faster I/O
autovacuum_vacuum_cost_delay = 2ms      # Throttle pause

# Default trigger formula:
# Dead tuples needed = autovacuum_vacuum_threshold + (autovacuum_vacuum_scale_factor * table_rows)
```

For large tables (e.g., 50 million rows), the default 20% scale factor means autovacuum will not wake up until **10 million rows become dead**! Tune aggressively per high-write table:

```sql
ALTER TABLE store.orders SET (
    autovacuum_vacuum_scale_factor = 0.02,  -- Trigger at 2% dead rows
    autovacuum_vacuum_threshold = 5000
);
```

---

## 5. Exercise and Verification

**Exercise:**
A table has 10 million rows and consumes 10 GB of disk space. After deleting 8 million rows and running standard `VACUUM`, the file on disk still occupies 10 GB according to `ls -lh`. Did VACUUM fail?

**Answer:**
No. Standard `VACUUM` marks the dead slots inside existing 8KB pages as reusable, recording them in the **Free Space Map (FSM)**. New inserts will occupy these vacant slots without growing the file. To physically return that space to the operating system without blocking queries, run `pg_repack`.

---

## Official References
- [PostgreSQL Documentation: Chapter 25.1 - Routine Vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)
- [PostgreSQL Documentation: Concurrency Control and MVCC](https://www.postgresql.org/docs/current/mvcc-intro.html)

