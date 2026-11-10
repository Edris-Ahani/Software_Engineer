[← Contents and learning path](../README.md) | [فارسی](01_021_performance_tuning_and_monitoring_Persian.md)

# 021 — Performance Tuning, Metrics, and pg_stat_statements

## Learning Goals
Master hardware-aligned PostgreSQL engine tuning. Understand `shared_buffers` double-buffering with the OS page cache, adjust planner storage costs (`random_page_cost` on NVMe), and identify high-impact query bottlenecks using `pg_stat_statements`.

---

## 1. Core Hardware Tuning Parameters

```ini
# Sizing for a dedicated 64 GB RAM / 16-Core NVMe Server:

# 1. Shared memory: 25% of total system RAM
# (Avoid setting higher than 40%; PostgreSQL relies on Linux OS Page Cache for double buffering!)
shared_buffers = 16GB

# 2. Planner memory hint: ~75% of RAM (shared_buffers + available OS page cache)
effective_cache_size = 48GB

# 3. Fast storage cost tuning:
# Default 4.0 assumes slow magnetic rotating hard drives.
# On NVMe SSDs, random reads cost almost the same as sequential reads!
random_page_cost = 1.1
seq_page_cost = 1.0

# 4. Multi-core parallelism:
max_worker_processes = 16
max_parallel_workers_per_gather = 4
max_parallel_workers = 16

# 5. Maintenance memory:
maintenance_work_mem = 2GB
```

---

## 2. Profiling Production with `pg_stat_statements`

`pg_stat_statements` aggregates performance metrics across all normalized query executions:

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Top 5 queries consuming the most total CPU and execution time:
SELECT 
    round(total_exec_time::numeric, 2) AS total_time_ms,
    calls,
    round(mean_exec_time::numeric, 2) AS mean_time_ms,
    round((100 * total_exec_time / sum(total_exec_time) OVER ())::numeric, 2) AS pct_total_load,
    rows,
    substr(query, 1, 80) AS query_preview
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 5;
```

### Finding Queries Spilling to Temporary Disk Files:
```sql
SELECT query, calls, temp_blks_written, temp_blks_read
FROM pg_stat_statements
WHERE temp_blks_written > 0
ORDER BY temp_blks_written DESC
LIMIT 5;
```
*(Any query appearing here requires an increased `work_mem` or query refactoring).*

---

## 3. Vital Health Metrics

### A. Buffer Cache Hit Ratio
Evaluates whether queries are satisfied from RAM or incurring physical disk reads:
```sql
SELECT 
    sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) * 100.0 AS cache_hit_ratio
FROM pg_statio_user_tables;
```
> **Benchmark:** Production systems must maintain a Cache Hit Ratio **above 99.0%**. If it falls below 95%, active working sets exceed `shared_buffers`.

### B. Transaction ID (XID) Wraparound Tracking
PostgreSQL limits active transaction IDs to $2^{31}$ (~2 billion). If `autovacuum_freeze_max_age` is reached, PostgreSQL forces emergency shutdown to prevent data corruption:

```sql
SELECT datname, age(datfrozenxid) AS xid_age,
       (2^31 - age(datfrozenxid))::bigint AS tx_until_wraparound_shutdown
FROM pg_database
ORDER BY age(datfrozenxid) DESC;
```

---

## 4. Terminating Stuck Long-Running Queries

```sql
-- Find queries running longer than 5 minutes
SELECT pid, now() - query_start AS duration, query, state
FROM pg_stat_activity
WHERE state != 'idle' AND (now() - query_start) > INTERVAL '5 minutes';

-- Graceful cancellation:
SELECT pg_cancel_backend(12345);

-- Forceful kill (terminates backend process):
SELECT pg_terminate_backend(12345);
```

---

## 5. Exercise and Verification

**Exercise:**
A query performs an index scan on an NVMe storage server taking 5 ms. However, the query planner consistently chooses a slow 450 ms `Seq Scan` unless you manually run `SET enable_seqscan = off;`. Why does the planner make this poor choice, and how do you fix it permanently?

**Answer:**
The planner uses `random_page_cost` to estimate the cost of fetching pages via index pointers. With the default `random_page_cost = 4.0`, the optimizer calculates that jumping around the index to fetch pages on spinning disk is 4x more expensive than streaming the table sequentially (`seq_page_cost = 1.0`).
*Permanent Fix:* On modern NVMe SSDs, configure `random_page_cost = 1.1` in `postgresql.conf` and reload. The optimizer will immediately choose the index scan naturally.

---

## Official References
- [PostgreSQL Documentation: Chapter 19.4 - Memory Configuration](https://www.postgresql.org/docs/current/runtime-config-resource.html)
- [PostgreSQL Documentation: pg_stat_statements Extension](https://www.postgresql.org/docs/current/pgstatstatements.html)

