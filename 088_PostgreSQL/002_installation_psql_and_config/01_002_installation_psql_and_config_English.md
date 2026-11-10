[← Contents and learning path](../README.md) | [فارسی](01_002_installation_psql_and_config_Persian.md)

# 002 — Installation, psql Mastery, and Server Configuration

## Learning Goals
Master server configuration mechanics via `postgresql.conf` and `pg_hba.conf`, understand online reload vs restart constraints, and gain proficiency with CLI meta-commands in `psql`.

---

## 1. Core Configuration Files

PostgreSQL configuration resides within the cluster data directory (`$PGDATA`):

```text
$PGDATA/
├── postgresql.conf         # Engine parameters, memory, concurrency, logs
├── pg_hba.conf             # Host-Based Authentication (Client access control)
└── pg_ident.conf           # OS user to DB user mapping
```

### Understanding `pg_hba.conf` (Host-Based Authentication)
Every incoming TCP/Unix connection must match a line in `pg_hba.conf` evaluated sequentially from top to bottom.

```text
# TYPE    DATABASE        USER            ADDRESS                 METHOD
local     all             all                                     peer
host      all             all             127.0.0.1/32            scram-sha-256
host      engineering_db  app_user        10.0.0.0/16             scram-sha-256
host      all             all             0.0.0.0/0               reject
```

- **`local`**: Connections via local Unix domain socket.
- **`host`**: Plain or SSL TCP/IP connection.
- **`scram-sha-256`**: Modern cryptographically secure SASL password authentication (mandatory standard for production; avoid deprecated `md5` or `trust`).

---

## 2. Server Parameter Classes: Reload vs. Restart

PostgreSQL categorizes parameters into distinct contexts:

| Parameter Context | How to Apply | Example Parameters |
| :--- | :--- | :--- |
| **`sighup`** | Reload configuration without interrupting active connections (`SELECT pg_reload_conf();` or `pg_ctl reload`). | `log_min_duration_statement`, `work_mem`, `statement_timeout`, `autovacuum_work_mem` |
| **`postmaster`** | Requires full database instance restart. | `shared_buffers`, `max_connections`, `wal_level`, `shared_preload_libraries` |
| **`user` / `session`**| Can be overridden at runtime for the current session or transaction. | `SET work_mem = '64MB';`, `SET enable_seqscan = off;` |

Inspect whether a parameter requires a restart:
```sql
SELECT name, setting, unit, context
FROM pg_settings
WHERE name IN ('shared_buffers', 'work_mem', 'max_connections', 'log_min_duration_statement');
```

---

## 3. Essential `psql` Meta-Commands

Command-line `psql` is the most powerful tool for DBA tasks and performance inspection:

```bash
# Connect to remote PostgreSQL server
psql -h 127.0.0.1 -p 5432 -U postgres -d engineering_db
```

Within the `psql` interactive prompt:

| Meta-Command | Description |
| :--- | :--- |
| `\timing on` | Toggles query execution wall-clock time display. |
| `\x auto` | Toggles expanded table display (vertical column output for wide rows). |
| `\l+` | Lists all databases with owner, encoding, collation, and disk size. |
| `\dt+ [schema.*]` | Lists tables along with table size and persistence. |
| `\di+ [schema.*]` | Lists all indexes, their parent table, and disk size. |
| `\d+ table_name` | Displays table structure, column types, constraints, defaults, and child partitions. |
| `\dn+` | Lists all schemas and access privileges. |
| `\dx` | Lists installed extensions and versions. |
| `\copy table TO 'file.csv' CSV HEADER` | Client-side fast bulk export (does not require server filesystem permissions). |

---

## 4. Hands-on Experiment

Open `psql` and execute the following configuration exploration:

```sql
-- Check current client connection details
SELECT inet_client_addr(), inet_client_port(), current_user, current_database();

-- Measure query timing directly in psql
\timing on

-- View disk footprints of all tables in the 'store' schema
SELECT relname AS table_name,
       pg_size_pretty(pg_total_relation_size(c.oid)) AS total_size,
       pg_size_pretty(pg_relation_size(c.oid)) AS table_data_size,
       pg_size_pretty(pg_indexes_size(c.oid)) AS indexes_size
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'store' AND c.relkind = 'r'
ORDER BY pg_total_relation_size(c.oid) DESC;
```

---

## 5. Exercise and Verification

**Exercise:**
You updated `shared_buffers = 2GB` and `log_min_duration_statement = 500` in `postgresql.conf`. You then executed `SELECT pg_reload_conf();`. What happens to the two parameters, and how do you confirm the actual active values?

**Answer:**
`log_min_duration_statement` takes effect immediately for all subsequent statements because its context is `sighup`. 
However, `shared_buffers` remains unchanged at its prior value because shared memory allocation is fixed at daemon startup (context: `postmaster`).
To verify:
```sql
SELECT name, setting, pending_restart 
FROM pg_settings 
WHERE name IN ('shared_buffers', 'log_min_duration_statement');
```
The column `pending_restart` will display `true` for `shared_buffers`, proving it requires an engine restart.

---

## Official References
- [PostgreSQL Documentation: Chapter 20 - Client Authentication](https://www.postgresql.org/docs/current/client-authentication.html)
- [PostgreSQL Documentation: psql Utility Reference](https://www.postgresql.org/docs/current/app-psql.html)

