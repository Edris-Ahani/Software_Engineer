# PostgreSQL Lab — Execution Guide

[← Back to Handbook README](README.md) | [راهنمای فارسی](00_HOW_TO_RUN_Persian.md)

This directory provides an end-to-end, reproducible Docker environment containing **PostgreSQL 16 with pgvector**, **PgBouncer**, and automated test suites.

---

## 1. Prerequisites

- Docker Engine 24.0+ and Docker Compose v2.
- Python 3.10+ (optional, for running `smoke_test.py` from host).
- `psql` command-line utility (optional, alternatively use `docker exec`).

---

## 2. Directory Layout of the Lab

```text
088_PostgreSQL/_lab/
├── compose.yaml
├── pgbouncer.ini
├── userlist.txt
├── smoke_test.py
└── init_db/
    ├── 01_schema.sql
    └── 02_seed_data.sql
```

---

## 3. Starting the Lab Environment

From the root of this chapter (`088_PostgreSQL/_lab`), run:

```bash
cd 088_PostgreSQL/_lab
docker compose up -d
```

Check the status of running containers:

```bash
docker compose ps
```

You should see two active containers:
- `pg_primary` listening on host port `5432`.
- `pg_bouncer` listening on host port `6432`.

---

## 4. Connecting via psql

### Direct connection to PostgreSQL (port 5432):
```bash
# Via host psql:
psql -h localhost -p 5432 -U postgres -d engineering_db

# Or directly inside the container without local psql:
docker exec -it pg_primary psql -U postgres -d engineering_db
```
*(Default password is `postgres_secure_pass`)*

### Connection via PgBouncer (port 6432):
```bash
psql -h localhost -p 6432 -U postgres -d engineering_db
```

---

## 5. Running Automated Behavior Tests

We provide an automated Python smoke-test script verifying container readiness, extension installation (`vector`, `pg_trgm`, `pg_stat_statements`), table creation, and connection pooling.

```bash
python smoke_test.py
```

Expected output:
```text
[OK] PostgreSQL connectivity verified.
[OK] Extensions verified: pgvector, pg_trgm, pg_stat_statements.
[OK] Seed data verified: 100,000 indexed records ready.
[OK] PgBouncer pooler connection verified on port 6432.
All tests passed successfully!
```

---

## 6. Tearing Down the Lab

When finished with experiments:

```bash
docker compose down -v
```
*(Flag `-v` removes persistent volumes so you can start clean on your next run).*

