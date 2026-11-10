[← Contents and learning path](../README.md) | [فارسی](01_019_logical_replication_and_cdc_Persian.md)

# 019 — Logical Replication, Publications, and CDC

## Learning Goals
Master table-level Logical Replication and Change Data Capture (CDC). Understand Publisher-Subscriber architectures, `REPLICA IDENTITY` mechanics, stream changes to Kafka with Debezium/pgoutput, and evaluate tradeoffs against physical replication.

---

## 1. Logical vs. Physical Replication Comparison

| Feature | Physical Streaming Replication | Logical Replication |
| :--- | :--- | :--- |
| **Granularity** | Entire cluster (all databases and system catalogs). | **Individual tables** or schemas. |
| **Cross-Version Support** | Identical major versions and architectures only. | **Cross-version** (e.g., stream from PG 14 to PG 16). |
| **Target Node Writes** | Target is strictly Read-Only (`hot_standby`). | **Target is Read-Write** (can accept local writes/indexes). |
| **Schema & DDL** | DDL replicated automatically (exact block copy). | **DDL is NOT replicated.** Schema must exist on subscriber. |
| **Sequences** | Sequences replicated automatically. | Sequences are **not** replicated. |

---

## 2. Publisher-Subscriber Setup

```text
+------------------------------+                     +------------------------------+
|       PUBLISHER NODE         |                     |       SUBSCRIBER NODE        |
|                              |                     |                              |
| CREATE PUBLICATION pub_orders| ─── SQL Row Delta ─>| CREATE SUBSCRIPTION sub_ord  |
| FOR TABLE store.orders       |     (INSERT/UPDATE) | CONNECTION '...'             |
+------------------------------+                     +------------------------------+
```

### Step 1: Publisher Server Configuration
```ini
# postgresql.conf
wal_level = logical
max_replication_slots = 10
```

Create publication on specific tables:
```sql
CREATE PUBLICATION pub_store_orders 
FOR TABLE store.orders, store.order_items;

-- Or publish all tables in the entire database:
-- CREATE PUBLICATION pub_all FOR ALL TABLES;
```

### Step 2: Subscriber Server Configuration
```sql
-- Ensure matching schema already exists on subscriber!
CREATE SUBSCRIPTION sub_store_orders
CONNECTION 'host=publisher.example.internal port=5432 dbname=engineering_db user=replicator password=secret'
PUBLICATION pub_store_orders
WITH (copy_data = true);
```
*(Option `copy_data = true` performs an initial snapshot sync of existing rows before starting continuous streaming).*

---

## 3. The `REPLICA IDENTITY` Requirement for UPDATE and DELETE

When a row is updated or deleted on the publisher, PostgreSQL must identify which row to modify on the subscriber:

```sql
-- Default: Uses the Primary Key of the table
ALTER TABLE store.orders REPLICA IDENTITY DEFAULT;

-- Tables lacking a Primary Key require REPLICA IDENTITY FULL:
-- Writes the complete old row into WAL before every update/delete
-- WARNING: Generates massive WAL bloat on high-write tables!
ALTER TABLE store.legacy_logs REPLICA IDENTITY FULL;
```

---

## 4. Change Data Capture (CDC) and the Outbox Pattern

Logical decoding plugins (`pgoutput`, `wal2json`) allow streaming event pipelines directly from the PostgreSQL WAL into Apache Kafka via Debezium:

```text
Application ──[ Local Transaction ]──> Writes Business Data + Outbox Table
                                                 │
                                                 v
                                           pg_wal (WAL)
                                                 │
                                                 v
                                    Debezium CDC (Logical Decoding)
                                                 │
                                                 v
                                        Apache Kafka Topic
```

This guarantees **Transactional Outbox Consistency**: Events are emitted to Kafka if and only if the local database transaction successfully commits, eliminating dual-write split-brain bugs!

---

## 5. Exercise and Verification

**Exercise:**
You execute `ALTER TABLE store.orders ADD COLUMN priority VARCHAR(20);` on the Publisher. A minute later, an order is inserted with a priority value. The subscriber suddenly stops syncing, and `pg_stat_subscription` shows an error. What happened and how do you fix it?

**Answer:**
Logical replication does not replicate DDL schema mutations. When the publisher tried to stream a row containing the new `priority` column, the subscriber failed because its local table definition still lacked that column.
*Fix:*
1. Apply the identical DDL on the subscriber:
   `ALTER TABLE store.orders ADD COLUMN priority VARCHAR(20);`
2. The logical replication worker on the subscriber will automatically resume streaming without data loss.

---

## Official References
- [PostgreSQL Documentation: Chapter 31 - Logical Replication](https://www.postgresql.org/docs/current/logical-replication.html)
- [PostgreSQL Documentation: Logical Decoding Architecture](https://www.postgresql.org/docs/current/logicaldecoding.html)

