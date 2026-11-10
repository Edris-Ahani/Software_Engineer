[← Contents and learning path](../README.md) | [فارسی](01_023_zero_downtime_migrations_Persian.md)

# 023 — Zero-Downtime Migrations and Safe DDL

## Learning Goals
Execute zero-downtime schema migrations on terabyte-scale production tables. Master non-blocking index creation (`CONCURRENTLY`), safe foreign key validation via `NOT VALID`, lock timeout guardrails, and the Expand/Contract migration pattern.

---

## 1. The Fundamental Law of Safe DDL

> **The Golden Rule:** Every schema migration script in production **must** be bounded by lock timeouts to prevent queuing active traffic:

```sql
-- Always prefix migrations with lock guardrails:
SET lock_timeout = '2s';       -- Abort if lock cannot be acquired within 2 seconds
SET statement_timeout = '30s';  -- Abort if DDL execution exceeds 30 seconds
```
If an active query blocks your migration, your DDL script aborts immediately rather than queuing incoming web traffic behind an `ACCESS EXCLUSIVE` lock.

---

## 2. Safe Index Creation and Deletion (`CONCURRENTLY`)

Standard `CREATE INDEX` takes a `SHARE` lock that blocks all concurrent `INSERT`, `UPDATE`, and `DELETE` queries until the index finishes building!

```sql
-- DANGEROUS: Blocks writes for minutes/hours on large tables
-- CREATE INDEX idx_orders_status ON store.orders(status);

-- SAFE ZERO-DOWNTIME: Builds index in background across multiple passes
-- Takes only SHARE UPDATE EXCLUSIVE lock (Permits continuous reads and writes!)
CREATE INDEX CONCURRENTLY idx_orders_status ON store.orders(status);

-- Dropping index safely without blocking reads or writes:
DROP INDEX CONCURRENTLY idx_orders_status;
```

> **Note on Transactions:** `CONCURRENTLY` commands cannot run inside an explicit `BEGIN ... COMMIT` transaction block.

---

## 3. Adding Constraints Without Table Locks (`NOT VALID`)

Adding a `FOREIGN KEY` or `CHECK` constraint normally locks the table while verifying all existing historical rows.  
The zero-downtime solution splits the operation into two distinct phases:

```sql
-- Phase 1: Add constraint marked 'NOT VALID'
-- Takes ACCESS EXCLUSIVE for only ~1 millisecond!
-- From this moment forward, all NEW rows are validated. Existing rows are not checked yet.
ALTER TABLE store.orders 
ADD CONSTRAINT fk_orders_user_safe 
FOREIGN KEY (user_id) REFERENCES store.users(id) 
NOT VALID;

-- Phase 2: Validate existing rows in background
-- Takes SHARE UPDATE EXCLUSIVE (Reads and writes continue uninterrupted!)
ALTER TABLE store.orders 
VALIDATE CONSTRAINT fk_orders_user_safe;
```

---

## 4. Adding a `NOT NULL` Column Safely

```sql
-- Step 1: Add column without NOT NULL (Instant in PostgreSQL 11+)
ALTER TABLE store.users ADD COLUMN phone_number VARCHAR(30);

-- Step 2: Add CHECK constraint as NOT VALID (Instant)
ALTER TABLE store.users 
ADD CONSTRAINT check_users_phone_not_null 
CHECK (phone_number IS NOT NULL) NOT VALID;

-- Step 3: Validate constraint concurrently without blocking
ALTER TABLE store.users 
VALIDATE CONSTRAINT check_users_phone_not_null;

-- Step 4: Convert to native NOT NULL constraint
-- (Instant in PG 12+ because PostgreSQL proves validity from the existing validated check constraint!)
ALTER TABLE store.users ALTER COLUMN phone_number SET NOT NULL;

-- Step 5: Clean up redundant check constraint
ALTER TABLE store.users DROP CONSTRAINT check_users_phone_not_null;
```

---

## 5. Renaming Columns: The Expand / Contract Pattern

Renaming a column directly in production (`ALTER TABLE users RENAME COLUMN old TO new`) causes instant HTTP 500 errors if old application pods are still querying the old column name.

```text
Phase 1 (Expand):
- Add the new column alongside old column.
- Deploy Application V1: Reads from old column; dual-writes to both old and new columns.
- Backfill historical data in background chunks.

Phase 2 (Migrate):
- Deploy Application V2: Reads from new column; writes to new column.

Phase 3 (Contract):
- Drop old column safely using zero-downtime DDL.
```

---

## 6. Exercise and Verification

**Exercise:**
A migration running `CREATE INDEX CONCURRENTLY` fails halfway through due to a temporary deadlock error. When you inspect `\di`, the index is present with an `INVALID` status. Can queries use this index, and what should you do?

**Answer:**
No, queries **cannot** use an `INVALID` index. However, the invalid index still consumes disk space and continues to be updated during every `INSERT` and `UPDATE`, slowing down write performance!
*Proper Cleanup:*
1. Drop the corrupted invalid index:
   `DROP INDEX CONCURRENTLY idx_orders_status;`
2. Re-run `CREATE INDEX CONCURRENTLY`.

---

## Official References
- [PostgreSQL Documentation: CREATE INDEX CONCURRENTLY](https://www.postgresql.org/docs/current/sql-createindex.html#SQL-CREATEINDEX-CONCURRENTLY)
- [PostgreSQL Documentation: Non-blocking Constraint Validation](https://www.postgresql.org/docs/current/sql-altertable.html)

