[← Contents and learning path](../README.md) | [فارسی](01_009_locking_and_deadlocks_Persian.md)

# 009 — Locking Mechanics, Row Locks, and Deadlocks

## Learning Goals
Master PostgreSQL's multi-layered lock manager: 8 table-level lock modes, row-level locking (`FOR UPDATE`, `SKIP LOCKED`), application-level Advisory Locks, and deadlock prevention techniques.

---

## 1. Table-Level Lock Modes and Conflicts

PostgreSQL employs 8 distinct table lock modes arranged in a strict conflict matrix:

```text
Table Lock Hierarchy (Lowest to Highest Restriction):
1. ACCESS SHARE              (Taken by SELECT)
2. ROW SHARE                 (Taken by SELECT FOR UPDATE / FOR SHARE)
3. ROW EXCLUSIVE             (Taken by INSERT, UPDATE, DELETE)
4. SHARE UPDATE EXCLUSIVE    (Taken by VACUUM, ANALYZE, CREATE INDEX CONCURRENTLY)
5. SHARE                     (Taken by CREATE INDEX standard)
6. SHARE ROW EXCLUSIVE       (Taken by CREATE TRIGGER, certain ALTER TABLE)
7. EXCLUSIVE                 (Blocks concurrent writes and reads with FOR UPDATE)
8. ACCESS EXCLUSIVE          (Taken by DROP TABLE, TRUNCATE, ALTER TABLE, VACUUM FULL)
                             -> Blocks ALL reads and writes!
```

> **The Lock Queue Pitfall:**  
> If an `ALTER TABLE` statement requests an `ACCESS EXCLUSIVE` lock, it waits for active `SELECT` statements to finish. Crucially, **all subsequent SELECT statements are queued behind the waiting ALTER TABLE**, causing an immediate connection pool exhaustion cascade! Always use `SET lock_timeout = '2s';` before running DDL in production.

---

## 2. Row-Level Locks and Job Queues with `SKIP LOCKED`

```sql
-- Standard pessimistic lock (blocks other transactions trying to lock the same row)
SELECT * FROM store.products 
WHERE id = 42 
FOR UPDATE;

-- High-throughput Concurrent Job Queue:
-- Multiple worker processes can claim unique unassigned tasks simultaneously
-- without blocking or waiting on each other!
BEGIN;
SELECT order_id, order_date
FROM store.orders
WHERE status = 'PENDING'
ORDER BY order_id
LIMIT 5
FOR UPDATE SKIP LOCKED;

-- Process the orders, then:
UPDATE store.orders 
SET status = 'PROCESSING'
WHERE order_id IN (...);
COMMIT;
```

---

## 3. Application-Level Advisory Locks

Advisory locks provide arbitrary application locking backed by PostgreSQL's Lock Manager without requiring artificial database rows or external coordination engines like ZooKeeper or Redis:

```sql
-- Session-level advisory lock (persists until explicitly released or session disconnects)
SELECT pg_advisory_lock(123456);
-- Critical section (e.g., executing single daily billing batch)
SELECT pg_advisory_unlock(123456);

-- Non-blocking try-lock: Returns TRUE if acquired, FALSE immediately if busy
SELECT pg_try_advisory_lock(987654);

-- Transaction-level advisory lock (automatically released at COMMIT or ROLLBACK)
SELECT pg_advisory_xact_lock(456789);
```

---

## 4. Deadlock Detection and Diagnosis

A deadlock occurs when two transactions wait for resources held by each other. PostgreSQL checks for dependency cycles when a lock request waits longer than `deadlock_timeout` (default: 1 second):

```sql
-- Inspect active locks and blocked sessions
SELECT
    blocked_locks.pid     AS blocked_pid,
    blocked_activity.usename  AS blocked_user,
    blocking_locks.pid    AS blocking_pid,
    blocking_activity.usename AS blocking_user,
    blocked_activity.query    AS blocked_statement,
    blocking_activity.query   AS blocking_statement
FROM  pg_catalog.pg_locks         blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks         blocking_locks 
    ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database
    AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
    AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
    AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
    AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid
    AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
    AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
    AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
    AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

### Universal Rule for Deadlock Prevention:
**Always lock records and tables in the exact same deterministic order across all application endpoints** (e.g., sort primary keys ascending before issuing `SELECT ... FOR UPDATE` or bulk updates).

---

## 5. Exercise and Verification

**Exercise:**
Ten parallel microservice workers dequeue background jobs from an `incoming_events` table using `SELECT * FROM incoming_events LIMIT 1 FOR UPDATE;`. All workers experience high latency and block each other. What single syntax change eliminates this bottleneck?

**Answer:**
Append `SKIP LOCKED`:
`SELECT * FROM incoming_events LIMIT 1 FOR UPDATE SKIP LOCKED;`
Without `SKIP LOCKED`, every worker attempts to lock the exact same first row in the table, serializing all 10 processes into a queue. With `SKIP LOCKED`, each worker skips already locked rows and immediately locks the next available free row with zero contention.

---

## Official References
- [PostgreSQL Documentation: Chapter 13.3 - Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html)
- [PostgreSQL Documentation: Advisory Lock Functions](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-ADVISORY-LOCKS)

