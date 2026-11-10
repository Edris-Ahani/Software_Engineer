[← Contents and learning path](../README.md) | [فارسی](01_015_connection_pooling_and_pgbouncer_Persian.md)

# 015 — Connection Pooling and PgBouncer Architecture

## Learning Goals
Understand why connection pooling is essential for PostgreSQL's process-based architecture. Learn the mechanics of **PgBouncer**, master the 3 pooling modes (Session, Transaction, Statement), understand session-state gotchas (prepared statements, temporary tables), and calculate optimal pool sizes.

---

## 1. Why Connection Pooling is Mandatory in PostgreSQL

Because PostgreSQL allocates an independent operating system process for each client connection, scaling connections naively to thousands leads to server collapse:

```text
Without Pooler (5,000 Web Clients direct to PostgreSQL):
Clients (5000) ──────> 5,000 OS Processes spawned
                      ├── Memory: 5,000 x 10MB = 50 GB RAM wasted on connection overhead!
                      └── CPU: Massive context switching degrades throughput to near zero!

With PgBouncer Pooler:
Clients (5000) ──────> PgBouncer (Single Event Loop) ──[ 30-50 Connections ]──> PostgreSQL
```

### Optimal Backend Pool Size Formula
Scientific benchmarking demonstrates that PostgreSQL achieves peak transactions per second (TPS) when active connections closely track physical CPU cores:

$$\text{Optimal Connections} = (\text{CPU Cores} \times 2) + \text{Disk Spindle / NVMe Factor}$$

For a 16-core server with fast NVMe storage:
$$\text{Optimal Pool} \approx (16 \times 2) + 4 = 36\text{ connections}$$
Allowing thousands of connections directly into PostgreSQL actually **slows down** overall system throughput!

---

## 2. The 3 PgBouncer Pooling Modes

| Mode | Lifetime of Backend Allocation | Concurrency Scaling | Application Compatibility |
| :--- | :--- | :--- | :--- |
| **Session Pooling** | Entire duration of client TCP session. | Low (1 client = 1 DB process). | 100% compatible with all PostgreSQL features. |
| **Transaction Pooling (Standard)** | Only for duration of a single transaction (`BEGIN` to `COMMIT`). | **Extreme** (10,000 idle clients served by 30 DB backends). | Breaks session-level `SET`, `LISTEN/NOTIFY`, and temporary tables. |
| **Statement Pooling** | Borrowed for a single SQL statement. | Maximum. | Breaks multi-statement transactions (`BEGIN ... COMMIT` impossible). Rarely used. |

---

## 3. Transaction Pooling Gotchas and Solutions

When running under Transaction Pooling, your application session state changes do not persist across transactions because different transactions may land on completely different backend processes:

```text
[Gotcha 1] Prepared Statements:
Historically failed because statements prepared on Backend A were unknown to Backend B.
Solution: PgBouncer 1.21+ supports client-side prepared statement tracking automatically!

[Gotcha 2] Session Configurations:
Avoid 'SET search_path = my_schema;'.
Solution: Use transaction-scoped settings: 'SET LOCAL search_path = my_schema;'.

[Gotcha 3] Temporary Tables:
Created temporary tables vanish or become orphaned when the transaction ends.
Solution: Use unlogged tables or pass state via JSONB/Arrays.
```

---

## 4. PgBouncer Configuration (`pgbouncer.ini`)

```ini
[databases]
engineering_db = host=127.0.0.1 port=5432 dbname=engineering_db

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432
auth_type = scram-sha-256
auth_file = /etc/pgbouncer/userlist.txt

# Connection limits
pool_mode = transaction
max_client_conn = 5000         # Up to 5,000 web clients can connect
default_pool_size = 30         # Maximum 30 physical backend connections to Postgres
reserve_pool_size = 5          # Emergency overflow connections
```

---

## 5. Exercise and Verification

**Exercise:**
An e-commerce API under peak Black Friday traffic suddenly crashes with:
`FATAL: remaining connection slots are reserved for non-replication superuser connections`.
The team decides to raise `max_connections = 5000` in `postgresql.conf` and restart. Why is this a dangerous mistake, and what should be done instead?

**Answer:**
Raising `max_connections` to 5000 in `postgresql.conf` allocates immense shared memory lock structures and causes the operating system kernel to spend all CPU cycles context-switching between 5,000 competing processes. The database CPU will spike to 100% while throughput drops to zero.
*Proper Fix:* Keep `max_connections = 100` in PostgreSQL, place **PgBouncer** in front with `pool_mode = transaction`, and set `max_client_conn = 5000` in PgBouncer. Client applications queue safely in PgBouncer while PostgreSQL executes transactions at maximum hardware efficiency.

---

## Official References
- [PgBouncer Official Documentation & Usage](https://www.pgbouncer.org/)
- [PostgreSQL Wiki: Number of Database Connections](https://wiki.postgresql.org/wiki/Number_Of_Database_Connections)

