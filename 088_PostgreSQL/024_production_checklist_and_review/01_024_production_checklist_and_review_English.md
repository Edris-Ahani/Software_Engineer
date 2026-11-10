[← Contents and learning path](../README.md) | [فارسی](01_024_production_checklist_and_review_Persian.md)

# 024 — Production Checklist, Health Checks, and Incident Runbook

## Learning Goals
Prepare PostgreSQL clusters for zero-failure production deployments. Conduct a comprehensive pre-launch infrastructure audit, implement alert thresholds for SRE teams, and execute step-by-step incident runbooks for disk saturation, connection exhaustion, and CPU spikes.

---

## 1. The Pre-Production Verification Checklist

Before opening traffic to a production PostgreSQL database, verify every item below:

```text
[ ] 1. HARDWARE & MEMORY SIZING
    ├── shared_buffers = 25% of system RAM
    ├── effective_cache_size = 75% of system RAM
    ├── work_mem = 16MB to 32MB (conservative default to avoid OOM killer)
    └── random_page_cost = 1.1 (if running on NVMe/SSD)

[ ] 2. WRITE-AHEAD LOG & DURABILITY
    ├── wal_level = replica (or logical if using CDC/Debezium)
    ├── max_wal_size = 16GB or 32GB (prevents premature checkpoint thrashing)
    ├── checkpoint_timeout = 15min
    ├── checkpoint_completion_target = 0.9 (smooths disk I/O)
    └── max_slot_wal_keep_size = 64GB (guards against dead replica disk filling)

[ ] 3. CONNECTION POOLING & CLIENT ARCHITECTURE
    ├── PgBouncer deployed in front of PostgreSQL (pool_mode = transaction)
    ├── max_connections in PostgreSQL kept lean (e.g., 100 to 200)
    └── Application connections routed to PgBouncer port 6432

[ ] 4. SECURITY & ACCESS CONTROL
    ├── password_encryption = scram-sha-256 in postgresql.conf
    ├── Host-based authentication (pg_hba.conf) enforces scram-sha-256 and SSL
    ├── Applications connect using restricted RBAC roles (NEVER superuser 'postgres')
    └── Sensitive PII columns protected via RLS or pgcrypto

[ ] 5. DISASTER RECOVERY & PITR
    ├── Automated physical basebackups scheduled daily
    ├── Continuous WAL archiving enabled and uploading to off-site cloud storage
    └── Point-In-Time Recovery (PITR) drill successfully tested on staging!
```

---

## 2. Production Incident Runbook: Top 3 Critical Scenarios

### Scenario A: Disk Space at 95% (Emergency Disk Exhaustion)
**Root Causes:** Inactive replication slot hoarding WAL files, or un-vacuumed table bloat.

```sql
-- 1. Check for abandoned replication slots hoarding WAL files:
SELECT slot_name, plugin, active, 
       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS retained_bytes
FROM pg_replication_slots
ORDER BY pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn) DESC;

-- If an inactive slot is holding tens of gigabytes, drop it immediately:
-- SELECT pg_drop_replication_slot('abandoned_standby_slot');

-- 2. Find largest disk-consuming tables and indexes:
SELECT relname, pg_size_pretty(pg_total_relation_size(oid)) AS total_size
FROM pg_class
WHERE relkind IN ('r', 'm')
ORDER BY pg_total_relation_size(oid) DESC
LIMIT 5;
```

---

### Scenario B: Connection Pool Exhaustion (`remaining connection slots reserved`)
**Root Causes:** Long-running transaction holding locks, slow unindexed queries, or absence of PgBouncer.

```sql
-- 1. Identify which PID is blocking other connections:
SELECT pid, usename, client_addr, state, now() - xact_start AS tx_age, query
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY xact_start ASC NULLS LAST
LIMIT 5;

-- 2. Cancel the offending query gracefully:
SELECT pg_cancel_backend(blocking_pid);

-- 3. If unresponsive, forcefully terminate the backend process:
SELECT pg_terminate_backend(blocking_pid);
```

---

### Scenario C: CPU Spikes to 100%
**Root Causes:** Unindexed sequential table scans, foreign keys lacking indexes, or hash joins spilling to disk.

```sql
-- 1. Find the top query driving CPU usage right now:
SELECT query, calls, total_exec_time, mean_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 3;

-- 2. Check for missing indexes on foreign key columns:
SELECT conrelid::regclass AS table_with_unindexed_fk, conname
FROM pg_constraint c
WHERE contype = 'f'
  AND NOT EXISTS (
      SELECT 1 FROM pg_index i
      WHERE i.indrelid = c.conrelid
        AND c.conkey = (i.indkey::int2[])[1:array_length(c.conkey, 1)]
  );
```

---

## 3. Final Architecture Review & Capstone Exercise

**Capstone Scenario:**
You are hired as Principal Data Architect for a high-traffic fintech processing 20,000 transactions/second. The existing single-node database experiences periodic 30-second lock freezes, connections drop during traffic bursts, and schema updates require taking the site down at midnight. 

**Architectural Solution Design:**
1. **Connection Layer:** Introduce **PgBouncer** in `transaction` pool mode on host port 6432. Fix PostgreSQL `max_connections = 150`, allowing up to 10,000 microservice pods to connect without context-switching degradation.
2. **High Availability:** Deploy a 3-node **Patroni + etcd** cluster behind **HAProxy** with health checking on port 8008, achieving automated failover with $RTO < 10\text{ seconds}$ and $RPO \approx 0$.
3. **Storage & Memory Tuning:** Set `shared_buffers = 25% RAM`, `random_page_cost = 1.1`, and `checkpoint_completion_target = 0.9` with `max_wal_size = 32GB`. This completely eliminates the periodic 30-second I/O lock freezes.
4. **Zero-Downtime DDL:** Enforce CI/CD pipeline rules: all migrations must use `SET lock_timeout = '2s';`, create indexes via `CREATE INDEX CONCURRENTLY`, and add foreign keys as `NOT VALID` followed by `VALIDATE CONSTRAINT`. Scheduled midnight maintenance downtime is permanently eliminated.

---

## Official References
- [PostgreSQL Documentation: Chapter 28 - Monitoring Database Activity](https://www.postgresql.org/docs/current/monitoring-stats.html)
- [PostgreSQL Documentation: Chapter 19 - Server Configuration Reference](https://www.postgresql.org/docs/current/runtime-config.html)

