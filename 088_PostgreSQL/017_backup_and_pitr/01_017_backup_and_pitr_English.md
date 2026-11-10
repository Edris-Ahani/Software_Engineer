[← Contents and learning path](../README.md) | [فارسی](01_017_backup_and_pitr_Persian.md)

# 017 — Backup Strategies, Logical Dumps, and Point-In-Time Recovery (PITR)

## Learning Goals
Design production-grade disaster recovery architectures. Master the differences between logical (`pg_dump`) and physical backups (`pg_basebackup`), set up continuous WAL archiving, and execute Point-In-Time Recovery (PITR) to restore the database to an exact second before human error.

---

## 1. Logical vs. Physical Backups

| Dimension | Logical Backup (`pg_dump`) | Physical Backup (`pg_basebackup`) |
| :--- | :--- | :--- |
| **Mechanism** | Emits SQL statements (`CREATE TABLE`, `COPY`) extracting data rows. | Copies raw byte blocks from the filesystem data directory ($PGDATA). |
| **Speed & Scale** | Slow for large databases (>500 GB). Restoring requires rebuilding all indexes from scratch. | **Extremely fast.** Restoring is a raw file copy without index recomputation. |
| **PITR Support** | No. Can only restore to the exact moment the dump was taken. | **Yes.** Serves as the baseline for continuous WAL replay. |
| **Selective Scope**| Can export a single table, schema, or database. | Operates on the entire cluster data directory. |

---

## 2. High-Performance Logical Backup with `pg_dump`

Always use the **Custom format (`-Fc`)** or Directory format (`-Fd`) to enable multi-core parallel restore with `pg_restore`:

```bash
# Export using directory format with 4 parallel worker threads and compression
pg_dump -h localhost -p 5432 -U postgres -d engineering_db \
        -Fd -j 4 -Z 6 -f /backups/engineering_db_20260515.dump

# Parallel restore with 4 workers:
pg_restore -h localhost -p 5432 -U postgres -d engineering_db_restored \
           -j 4 -Fd /backups/engineering_db_20260515.dump
```

---

## 3. Physical Base Backup with `pg_basebackup`

```bash
# Stream physical base backup with checkpoint, progress bar, and compression
pg_basebackup -h 10.0.1.10 -p 5432 -U replicator \
              -D /backups/base_20260515 \
              -Ft -z -P -X stream
```

---

## 4. Point-In-Time Recovery (PITR) Architecture

PITR combines a periodic physical base backup with **continuous WAL archiving**:

```text
Continuous Time Line:
|----------------------- Base Backup (Sunday 00:00)
    |==== WAL Archive Segments Uploaded to Remote S3 Object Storage =====|
                                                                         * (Tuesday 14:15: Accidental DROP TABLE!)
Recovery Target: Restore Base Backup -> Replay archived WALs -> STOP at Tuesday 14:14:59!
```

### Server Configuration for Continuous Archiving (`postgresql.conf`):
```ini
wal_level = replica
archive_mode = on
archive_command = 'test ! -f /mnt/wal_archive/%f && cp %p /mnt/wal_archive/%f'
```

### Performing Point-In-Time Recovery:
1. Stop PostgreSQL and restore the base backup directory into `$PGDATA`.
2. Clear out existing `$PGDATA/pg_wal/`.
3. In `$PGDATA`, create the trigger file `recovery.signal`:
   `touch $PGDATA/recovery.signal`
4. Append recovery settings in `postgresql.conf`:
   ```ini
   restore_command = 'cp /mnt/wal_archive/%f %p'
   recovery_target_time = '2026-05-15 14:14:59 UTC'
   recovery_target_action = 'promote'
   ```
5. Start PostgreSQL. The engine reads the base backup, pulls WAL files from `/mnt/wal_archive/`, replays changes sequentially, and pauses right before the target timestamp!

---

## 5. Exercise and Verification

**Exercise:**
An engineer executes `DROP TABLE store.users;` at `10:35:20 AM`. You have a base backup from last midnight and a complete WAL archive. If you configure `recovery_target_time = '10:35:00 AM'`, will the dropped table and its data be restored? What happens if you do not set `recovery_target_action`?

**Answer:**
Yes, the table will be 100% recovered because the replay halts at `10:35:00`, twenty seconds before the drop command was issued.
If `recovery_target_action` is not configured, PostgreSQL defaults to `pause`. The database will enter a read-only paused state, allowing you to connect via `psql`, verify that the recovered data is intact, and then execute `SELECT pg_wal_replay_resume();` to promote the instance to a fully read-write database.

---

## Official References
- [PostgreSQL Documentation: Chapter 26 - Backup and Restore](https://www.postgresql.org/docs/current/backup.html)
- [PostgreSQL Documentation: Continuous Archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)

