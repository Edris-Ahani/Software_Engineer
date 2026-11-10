[← Contents and learning path](../README.md) | [فارسی](01_008_transactions_acid_and_isolation_Persian.md)

# 008 — Transactions, ACID Guarantees, and Isolation Levels

## Learning Goals
Understand how PostgreSQL implements ACID guarantees. Learn the behavior of isolation levels (`Read Committed`, `Repeatable Read`, `Serializable`), identify concurrency anomalies like Write Skew, and design client-side transaction retry loops for serialization failures (`40001`).

---

## 1. ACID Guarantees in PostgreSQL

- **Atomicity:** Ensured via Write-Ahead Log (WAL) and abort mechanisms. If an error occurs, uncommitted page modifications are discarded.
- **Consistency:** Enforced via DDL constraints, foreign keys, and check rules checked synchronously at statement or transaction boundary (`DEFERRABLE`).
- **Isolation:** Implemented via Snapshot Isolation (MVCC) rather than naive locking.
- **Durability:** WAL records are flushed to persistent media via `fsync` before reporting commit success. Setting `synchronous_commit = off` trades durability for extreme throughput (up to 10x write speed) with a risk of losing milliseconds of committed transactions during a hard OS power crash.

---

## 2. Isolation Levels Comparison in PostgreSQL

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read | Serialization Anomaly (Write Skew) |
| :--- | :--- | :--- | :--- | :--- |
| **`READ COMMITTED` (Default)** | Prevented | **Possible** | **Possible** | **Possible** |
| **`REPEATABLE READ`** | Prevented | Prevented | Prevented | **Possible** |
| **`SERIALIZABLE`** | Prevented | Prevented | Prevented | Prevented |

> **PostgreSQL Quirks:**
> 1. In PostgreSQL, `READ UNCOMMITTED` is treated identically to `READ COMMITTED` (dirty reads are physically impossible due to MVCC).
> 2. `REPEATABLE READ` in PostgreSQL prevents both Non-Repeatable Reads **and** Phantom Reads!

```sql
-- Setting isolation level for a specific transaction
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
-- Statements executed here share a frozen database snapshot from transaction start
COMMIT;
```

---

## 3. Concurrency Phenomena Explained

### Non-Repeatable Read (Read Committed)
Transaction A reads Row 10 (price = $10). Transaction B updates Row 10 (price = $15) and commits. Transaction A re-reads Row 10 and now sees $15. In `Repeatable Read`, Transaction A continues to see $10.

### Write Skew Anomaly (Prevented ONLY by Serializable)
Consider an on-call system requiring at least 1 active doctor:
1. Doctors Alice and Bob are on call (count = 2).
2. Alice starts Tx1 to go off-call: checks `count >= 2`, updates Alice to off-call.
3. Simultaneously, Bob starts Tx2 to go off-call: checks `count >= 2`, updates Bob to off-call.
4. Under `Read Committed` and `Repeatable Read`, **both transactions succeed**, leaving 0 doctors on call!
5. Under `SERIALIZABLE`, PostgreSQL detects the read-write anti-dependency conflict and aborts one transaction with:
   `ERROR: 40001: could not serialize access due to read/write dependencies among transactions`.

---

## 4. Handling `40001 Serialization Failure` in Applications

When using `SERIALIZABLE` or `REPEATABLE READ`, client applications **must** implement exponential backoff retry loops:

```python
# Pseudo-code for production transaction retry pattern
def execute_with_retry(db_pool, tx_logic, max_attempts=5):
    for attempt in range(max_attempts):
        try:
            with db_pool.connection() as conn:
                with conn.transaction():
                    conn.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;")
                    return tx_logic(conn)
        except SerializationFailureError: # SQLSTATE 40001
            time.sleep(0.05 * (2 ** attempt)) # Exponential backoff
    raise Exception("Max transaction retry limit exceeded")
```

---

## 5. Exercise and Verification

**Exercise:**
Two transactions concurrently execute:
```sql
-- Transaction 1:
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
UPDATE store.products SET price_cents = price_cents + 100 WHERE id = 1;

-- Transaction 2 (simultaneously):
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
UPDATE store.products SET price_cents = price_cents + 200 WHERE id = 1;
```
Transaction 1 commits first. What happens to Transaction 2?

**Answer:**
Transaction 2 blocks waiting for Transaction 1 to finish. When Transaction 1 commits, Transaction 2 immediately aborts with:
`ERROR: could not serialize access due to concurrent update (SQLSTATE 40001)`.
In `REPEATABLE READ`, a transaction cannot update a row that has been updated by a concurrent transaction that committed after the snapshot was established.

---

## Official References
- [PostgreSQL Documentation: Chapter 13.2 - Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [PostgreSQL Documentation: Serializable Snapshot Isolation (SSI)](https://wiki.postgresql.org/wiki/SSI)

