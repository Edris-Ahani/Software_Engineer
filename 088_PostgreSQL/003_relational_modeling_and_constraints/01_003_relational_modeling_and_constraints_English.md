[← Contents and learning path](../README.md) | [فارسی](01_003_relational_modeling_and_constraints_Persian.md)

# 003 — Relational Modeling, Keys, and Constraints

## Learning Goals
Design robust relational schemas enforcing data integrity at the database layer. Understand surrogate vs natural keys, UUID index fragmentation, foreign key index requirements, and advanced exclusion constraints.

---

## 1. Primary Key Strategies: BIGSERIAL vs UUIDv4 vs UUIDv7

| Key Type | Storage | Index Performance | Predictability / Security |
| :--- | :--- | :--- | :--- |
| **`BIGINT GENERATED ALWAYS AS IDENTITY`** | 8 bytes | Excellent. Monotonically increasing values append sequentially to rightmost B-Tree leaf. | High predictability: exposes total record count and enumeration attack vector. |
| **`UUIDv4` (`gen_random_uuid()`)** | 16 bytes | Poor for high-volume writes. Random values scatter insertions throughout the B-Tree, causing high cache misses and disk write amplification. | Completely unpredictable. |
| **`UUIDv7` (Timestamp-ordered UUID)** | 16 bytes | Excellent. Prefix contains millisecond timestamp, providing sequential B-Tree locality while preserving global uniqueness. | High security without index fragmentation penalty. |

```sql
-- Modern ANSI SQL standard Identity column (replaces legacy SERIAL)
CREATE TABLE store.merchants (
    merchant_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(200) NOT NULL
);

-- Recommended standard for distributed entity IDs
CREATE TABLE store.devices (
    device_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registered_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);
```

---

## 2. Foreign Key Caveats and Missing Indexes

> **Critical Performance Pitfall:**  
> In PostgreSQL, creating a `FOREIGN KEY` does **NOT** automatically create an index on the referencing child column. 

When you delete or update a row in the parent table with `ON DELETE CASCADE` or `RESTRICT`, PostgreSQL must perform a **Full Table Sequential Scan** on the child table if no supporting index exists!

```sql
-- Always index foreign key referencing columns on child tables
CREATE TABLE store.order_notes (
    note_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    order_date DATE NOT NULL,
    note_text TEXT NOT NULL,
    CONSTRAINT fk_order_notes FOREIGN KEY (order_id, order_date) 
        REFERENCES store.orders(order_id, order_date) ON DELETE CASCADE
);

-- Crucial: Create supporting index for foreign key cascades
CREATE INDEX idx_order_notes_order_fk ON store.order_notes (order_id, order_date);
```

---

## 3. CHECK and Domain Constraints

Enforce business logic directly at the database engine level to guarantee data sanity regardless of the application framework connecting to it:

```sql
-- Custom reusable domain type
CREATE DOMAIN email_address AS VARCHAR(255)
    CHECK (VALUE ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Multi-column CHECK constraint on table
CREATE TABLE store.discounts (
    discount_id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('PERCENTAGE', 'FIXED_AMOUNT')),
    percentage_value NUMERIC(5,2) CHECK (percentage_value BETWEEN 0 AND 100),
    fixed_amount_cents INTEGER CHECK (fixed_amount_cents >= 0),
    -- Ensure values match discount type
    CONSTRAINT check_discount_validity CHECK (
        (discount_type = 'PERCENTAGE' AND percentage_value IS NOT NULL AND fixed_amount_cents IS NULL) OR
        (discount_type = 'FIXED_AMOUNT' AND fixed_amount_cents IS NOT NULL AND percentage_value IS NULL)
    )
);
```

---

## 4. Exclusion Constraints (`EXCLUDE USING gist`)

Prevent scheduling or temporal booking conflicts using native PostgreSQL exclusion constraints instead of vulnerable application-level read-then-write checks:

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE store.room_reservations (
    reservation_id BIGSERIAL PRIMARY KEY,
    room_number INT NOT NULL,
    time_slot TSRANGE NOT NULL,
    -- Disallow overlapping time slots for the exact same room
    CONSTRAINT no_overlapping_reservations 
        EXCLUDE USING gist (room_number WITH =, time_slot WITH &&)
);

-- Test insertion:
INSERT INTO store.room_reservations (room_number, time_slot)
VALUES (101, tsrange('2026-05-01 10:00:00', '2026-05-01 12:00:00'));

-- This conflicting insertion will fail immediately with constraint violation:
-- INSERT INTO store.room_reservations (room_number, time_slot)
-- VALUES (101, tsrange('2026-05-01 11:30:00', '2026-05-01 13:00:00'));
```

---

## 5. Exercise and Verification

**Exercise:**
A junior engineer states: "I added `ON DELETE CASCADE` to my foreign key, so deleting a customer record will be blazing fast." Is this statement accurate? What query can you run to verify foreign keys that lack supporting indexes across your database?

**Answer:**
The statement is dangerous and often incorrect. If the child table contains millions of rows and lacks an index on the foreign key column, deleting a single row in the parent table forces PostgreSQL to sequentially scan millions of child rows, locking tables and spiking CPU.

Query to detect unindexed foreign keys:
```sql
SELECT
    conrelid::regclass AS child_table,
    conname AS foreign_key_name,
    pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
WHERE contype = 'f'
  AND NOT EXISTS (
      SELECT 1 FROM pg_index i
      WHERE i.indrelid = c.conrelid
        AND c.conkey = (i.indkey::int2[])[1:array_length(c.conkey, 1)]
  );
```

---

## Official References
- [PostgreSQL Documentation: Chapter 5 - Data Definition and Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [PostgreSQL Documentation: Range Types and Exclusion Constraints](https://www.postgresql.org/docs/current/rangetypes.html)

