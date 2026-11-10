[← Contents and learning path](../README.md) | [فارسی](01_018_streaming_replication_Persian.md)

# 018 — Physical Streaming Replication and Failover

## Learning Goals
Understand PostgreSQL's physical byte-level streaming replication. Configure Primary-Standby clusters, master asynchronous vs synchronous commit guarantees, prevent disk saturation with Replication Slots (`max_slot_wal_keep_size`), and monitor replication lag.

---

## 1. Physical Streaming Replication Architecture

Physical replication streams raw WAL records over a TCP socket from the Primary to one or more Read-Only Standby replicas:

```text
+-----------------------+                         +-----------------------+
|    PRIMARY NODE       |                         |    STANDBY REPLICA    |
| (Read / Write)        |                         | (Read-Only Queries)   |
|                       |                         |                       |
|   Client Backends     |                         |   Client Queries      |
|          │            |                         |          │            |
|          v            |                         |          v            |
|      pg_wal           |                         |   Startup Process     |
|          │            |                         |   (Replays WAL bytes) |
|          v            |                         |          ^            |
|   walsender process   | ─── TCP Stream (WAL) ──>|   walreceiver process |
+-----------------------+                         +-----------------------+
```

---

## 2. Setting Up Streaming Replication

### Step 1: Primary Configuration (`postgresql.conf` & `pg_hba.conf`)
```ini
# postgresql.conf
wal_level = replica
max_wal_senders = 10
max_replication_slots = 10
hot_standby = on
```

Allow the replication user in `pg_hba.conf`:
```text
host    replication     replicator      10.0.1.0/24     scram-sha-256
```

Create a persistent physical replication slot:
```sql
SELECT pg_create_physical_replication_slot('standby_node_1');
```

### Step 2: Provisioning the Standby
Run `pg_basebackup` on the Standby node targeting the Primary:

```bash
pg_basebackup -h 10.0.1.10 -p 5432 -U replicator \
              -D /var/lib/postgresql/data -Fp -Xs -R \
              --slot=standby_node_1
```
*(The `-R` flag automatically writes connection details into `postgresql.auto.conf` and creates `standby.signal`).*

---

## 3. Asynchronous vs. Synchronous Replication

```ini
# Asynchronous (Default):
# Primary reports commit success immediately after flushing WAL locally.
# High throughput; small replication lag window during unexpected primary crash.

# Synchronous Replication:
synchronous_standby_names = 'FIRST 1 (standby_node_1, standby_node_2)'
synchronous_commit = on
```

### `synchronous_commit` Levels in Synchronous Replication:
- **`remote_write`**: Primary waits until standby acknowledges receipt of WAL and OS buffer write (survives DB crash, not OS crash).
- **`on` (Standard)**: Primary waits until standby flushes WAL to persistent disk via `fsync`.
- **`remote_apply`**: Primary waits until standby's startup process has replayed the WAL into Shared Buffers (guarantees immediate read-your-writes consistency on replicas!).

---

## 4. The Critical Danger of Replication Slots

A Replication Slot guarantees that the Primary will **never** delete WAL segments until the designated Standby has acknowledged receiving them.

> **Production Outage Warning:**  
> If a Standby server dies or loses network connectivity for several days, the Primary continues retaining all WAL files in `pg_wal/`. Eventually, the primary server's **disk reaches 100% full**, causing an emergency database shutdown!

### Protection Guardrail:
```ini
# Bound maximum WAL retained by inactive replication slots
max_slot_wal_keep_size = 64GB
```
If an offline replica lags past 64GB, the primary invalidates the slot and frees disk space to protect primary uptime.

---

## 5. Monitoring Replication Lag

```sql
-- Run on Primary:
SELECT 
    client_addr, 
    application_name, 
    state, 
    sync_state, 
    pg_wal_lsn_diff(pg_current_wal_lsn(), sent_lsn) AS bytes_pending_send,
    pg_wal_lsn_diff(sent_lsn, write_lsn) AS bytes_pending_write,
    pg_wal_lsn_diff(write_lsn, flush_lsn) AS bytes_pending_flush,
    pg_wal_lsn_diff(flush_lsn, replay_lsn) AS bytes_pending_replay
FROM pg_stat_replication;
```

---

## 6. Exercise and Verification

**Exercise:**
A web application routes read queries to a Standby replica. A user updates their profile and is redirected to their dashboard, but the dashboard still shows their old name. Two seconds later, refreshing the page displays the updated name. What phenomenon occurred, and what configuration solves this?

**Answer:**
This is **Replication Lag** under asynchronous replication. The update was committed on the Primary, but the Standby had not yet replayed that WAL record when the subsequent read arrived.
*Solutions:*
1. Configure `synchronous_commit = remote_apply` on the Primary for profile updates.
2. Or employ application-level read-your-writes routing (route queries for 5 seconds after a write to the Primary).

---

## Official References
- [PostgreSQL Documentation: Chapter 27 - High Availability, Load Balancing, and Replication](https://www.postgresql.org/docs/current/high-availability.html)
- [PostgreSQL Documentation: Streaming Replication Protocol](https://www.postgresql.org/docs/current/protocol-replication.html)

