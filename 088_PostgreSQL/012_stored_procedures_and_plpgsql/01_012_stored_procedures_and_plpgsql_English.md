[← Contents and learning path](../README.md) | [فارسی](01_012_stored_procedures_and_plpgsql_Persian.md)

# 012 — Stored Procedures, PL/pgSQL Functions, and Triggers

## Learning Goals
Understand PL/pgSQL procedural language internals. Learn the critical distinction between Functions and Procedures (transaction control), function volatility categories (`IMMUTABLE`, `STABLE`, `VOLATILE`), trigger design, and the performance cost of exception blocks.

---

## 1. Functions vs. Stored Procedures

| Dimension | `CREATE FUNCTION` | `CREATE PROCEDURE` (PostgreSQL 11+) |
| :--- | :--- | :--- |
| **Transaction Control** | Cannot start or commit transactions. Runs strictly inside caller's transaction. | Can execute explicit `COMMIT` and `ROLLBACK` within the procedure body! |
| **Invocation Syntax** | Called via `SELECT my_function(...)` | Called via `CALL my_procedure(...)` |
| **Primary Use Case** | Computations, data transformations, row generators. | Large batch updates, bulk archivals in chunked transaction loops. |

```sql
-- Stored Procedure demonstrating transactional chunking
CREATE OR REPLACE PROCEDURE store.archive_old_orders(batch_size INT)
LANGUAGE plpgsql
AS $$
DECLARE
    rows_affected INT;
BEGIN
    LOOP
        -- Delete in small batches to avoid holding long locks
        DELETE FROM store.orders
        WHERE order_id IN (
            SELECT order_id 
            FROM store.orders 
            WHERE status = 'DELIVERED' AND order_date < '2024-01-01'
            LIMIT batch_size
        );
        
        GET DIAGNOSTICS rows_affected = ROW_COUNT;
        
        -- Explicitly commit this batch so locks and WAL buffers are released
        COMMIT;
        
        EXIT WHEN rows_affected = 0;
    END LOOP;
END;
$$;
```

---

## 2. Function Volatility Categories

PostgreSQL's cost-based query planner relies on volatility declarations to determine whether a function call can be cached or folded:

```text
1. IMMUTABLE:
   Cannot modify database; guaranteed to return identical result given identical arguments.
   Example: LOWER('ABC'), 2 + 2, MD5('text').
   -> Evaluated ONCE at plan-time by the optimizer. Required for Expression Indexes!

2. STABLE:
   Cannot modify database; returns identical result within a single table scan/statement,
   but can change between statements.
   Example: NOW(), CURRENT_TIMESTAMP, reading a config table.

3. VOLATILE (Default):
   Can modify database or return different values on consecutive calls even in same row scan.
   Example: random(), clock_timestamp(), nextval('my_seq').
   -> Must be re-evaluated for EVERY single row!
```

---

## 3. High-Performance Audit Trigger

```sql
CREATE TABLE store.audit_log (
    audit_id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    action VARCHAR(10) NOT NULL,
    row_data JSONB NOT NULL,
    changed_by VARCHAR(100) NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE OR REPLACE FUNCTION store.fn_log_user_audit()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO store.audit_log (table_name, action, row_data, changed_by)
    VALUES (
        TG_TABLE_NAME,
        TG_OP,
        CASE TG_OP
            WHEN 'DELETE' THEN to_jsonb(OLD)
            ELSE to_jsonb(NEW)
        END,
        current_user
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_audit
AFTER INSERT OR UPDATE OR DELETE ON store.users
FOR EACH ROW
EXECUTE FUNCTION store.fn_log_user_audit();
```

---

## 4. The Hidden Cost of `EXCEPTION` in PL/pgSQL

```sql
-- DANGEROUS PATTERN IN HIGH-FREQUENCY LOOPS:
BEGIN
    -- When entering a BEGIN ... EXCEPTION block,
    -- PostgreSQL creates an internal SAVEPOINT (subtransaction).
    -- If executed in a loop of 100,000 iterations, it creates 100,000 savepoints,
    -- causing subtransaction cache overflows (Subtrans SLRU lock contention)!
EXCEPTION WHEN OTHERS THEN
    -- handle error
END;
```
> **Guideline:** Avoid placing `EXCEPTION` blocks inside tight PL/pgSQL loops. Check existence using `IF EXISTS (...)` or handle failures at the batch boundary.

---

## 5. Exercise and Verification

**Exercise:**
You want to create an index on `store.users (fn_get_domain(email))`. PostgreSQL throws:
`ERROR: functions in index expression must be marked IMMUTABLE`.
Why did this happen if the function simply extracts the domain string from an email address?

**Answer:**
If you did not explicitly declare the function as `IMMUTABLE` when defining it, PostgreSQL defaults to `VOLATILE`.
Fix:
```sql
CREATE OR REPLACE FUNCTION fn_get_domain(email TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE STRICT PARALLEL SAFE
AS $$
    SELECT split_part(email, '@', 2);
$$;
```
Now creating the functional index succeeds.

---

## Official References
- [PostgreSQL Documentation: Chapter 43 - PL/pgSQL - Procedural Language](https://www.postgresql.org/docs/current/plpgsql.html)
- [PostgreSQL Documentation: Function Volatility Categories](https://www.postgresql.org/docs/current/xfunc-volatility.html)

