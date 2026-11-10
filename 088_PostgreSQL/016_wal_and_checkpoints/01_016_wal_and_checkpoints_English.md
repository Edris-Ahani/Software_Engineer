[← Contents and learning path](../README.md) | [فارسی](01_016_wal_and_checkpoints_Persian.md)

# 016 — Write-Ahead Logging (WAL) and Checkpoints

## Learning Goals
Understand PostgreSQL's durability engine. Learn how Write-Ahead Logging (WAL) guarantees crash recovery, the mechanics of Log Sequence Numbers (LSNs), how Checkpoints operate, and how to tune checkpoint smoothing to eliminate I/O latency spikes.

---

## 1. Why Write-Ahead Logging?

Writing updates directly to 8KB data pages scattered across random disk locations is prohibitively slow. WAL solves this by converting random I/O into fast sequential append-only writes:

```text
Transaction Modifies Row
          |
          v
1. Generate WAL Record (Delta representation of the byte change)
          |
          v
2. Append to WAL Buffers in Memory
          |
          v
3. Flush to Disk: Write & fsync to pg_wal/000000010000000000000001 (Sequential)
          |
          v
4. Report "COMMIT SUCCESS" to client!
          |
   (At this instant, the actual 8KB Data Page in Shared Buffers is STILL DIRTY in RAM!)
```

---

## 2. Log Sequence Numbers (LSN) and Crash Recovery

Every WAL record has a 64-bit monotonically increasing byte offset known as the **Log Sequence Number (LSN)**:
Example: `0/16B3748`.

- Every physical 8KB data page has a header containing `pd_lsn` (the LSN of the latest WAL record that modified that page).
- **The Golden Durability Rule:** An 8KB data page can **never** be written to disk until the WAL record matching or exceeding its `pd_lsn` has been flushed to disk (`fsync`).
- **Crash Recovery (REDO):** During a crash, PostgreSQL loads the last valid Checkpoint record, scans WAL forward, and reapplies any changes whose LSN > `pd_lsn` on disk.

```sql
-- Inspect current write LSN
SELECT pg_current_wal_lsn(), pg_walfile_name(pg_current_wal_lsn());
```

---

## 3. Checkpoints and Smooth I/O Spreading

A Checkpoint is a planned point in time where the engine guarantees that all dirty shared buffers modified before the checkpoint start have been flushed to disk.

```text
Checkpoint Initiation
          │
          ├── 1. Identify all dirty pages currently in Shared Buffers
          ├── 2. Slowly write and sync them to disk over time
          ├── 3. Write checkpoint record to WAL
          └── 4. Recycle / delete older WAL segments no longer needed for recovery
```

### Eliminating I/O Spikes via `checkpoint_completion_target`

```ini
# Production configuration in postgresql.conf
checkpoint_timeout = 15min              # Run checkpoint every 15 minutes
max_wal_size = 16GB                     # Max WAL allowed before forcing emergency checkpoint
min_wal_size = 2GB
checkpoint_completion_target = 0.9      # Spread dirty page writes over 90% of the timeout
```

> **Why `checkpoint_completion_target = 0.9`?**  
> If `checkpoint_timeout = 15min`, the engine spreads the write workload across $15 \times 0.9 = 13.5$ minutes. This eliminates sudden I/O saturation and keeps query latencies smooth.

---

## 4. Full Page Writes (`full_page_writes = on`)

Operating systems typically write data in 4KB blocks, whereas PostgreSQL pages are 8KB. If the OS crashes mid-write, a page becomes **torn** (half new data, half old data).  
With `full_page_writes = on`, PostgreSQL writes the entire 8KB page image to WAL the very first time that page is dirtied after a checkpoint, allowing recovery to heal torn pages perfectly. Never disable this in production!

---

## 5. Exercise and Verification

**Exercise:**
Your production database logs display:
`LOG: checkpoints are occurring too frequently (every 45 seconds)`
`HINT: Consider increasing the configuration parameter "max_wal_size".`
What caused this log, and what performance risk does it indicate?

**Answer:**
Checkpoints are triggered either when `checkpoint_timeout` expires or when the volume of generated WAL reaches `max_wal_size`.
Under heavy write load, if `max_wal_size` is too small (e.g., default 1GB), checkpoints fire prematurely every 45 seconds. This causes extreme disk I/O thrashing and forces frequent Full Page Writes, bloating the WAL further.
*Solution:* Increase `max_wal_size = 16GB` or `32GB`.

---

## Official References
- [PostgreSQL Documentation: Chapter 30 - Reliability and the Write-Ahead Log](https://www.postgresql.org/docs/current/wal.html)
- [PostgreSQL Documentation: Checkpoints and Configuration](https://www.postgresql.org/docs/current/wal-configuration.html)

