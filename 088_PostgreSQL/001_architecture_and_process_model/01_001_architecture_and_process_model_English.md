[← Contents and learning path](../README.md) | [فارسی](01_001_architecture_and_process_model_Persian.md)

# 001 — PostgreSQL Architecture and Process Model

## Learning Goals
Understand PostgreSQL's client-server process architecture, process isolation model, and shared memory structures. Prerequisites: Operating system concepts (processes, shared memory, IPC, threads).

---

## 1. Process Architecture Overview

PostgreSQL does **not** follow a multi-threaded architecture (like MySQL InnoDB or Microsoft SQL Server). Instead, it relies on a **process-based model** using dedicated operating system processes coordinated via System V IPC / POSIX Shared Memory.

```text
+-------------------------------------------------------------------------+
|                          Postmaster (Main Daemon)                       |
+-------------------------------------------------------------------------+
       |                  |                    |                  |
       v                  v                    v                  v
+--------------+   +--------------+     +--------------+   +--------------+
| Client Conn  |   | Client Conn  |     | Background   |   | Background   |
| Backend #1   |   | Backend #2   |     | Checkpointer |   | Background   |
| (OS Process) |   | (OS Process) |     | (OS Process) |   | Writer       |
+--------------+   +--------------+     +--------------+   +--------------+
       \                  /                    |                  |
        v                v                     v                  v
+-------------------------------------------------------------------------+
|                             SHARED MEMORY                               |
|  +--------------------+ +--------------------+ +---------------------+  |
|  |   Shared Buffers   | |    WAL Buffers     | |      CLOG/SLRU      |  |
|  +--------------------+ +--------------------+ +---------------------+  |
|  |                    Lock Manager & IPC Semaphores                  |  |
+-------------------------------------------------------------------------+
                                   |
                                   v
                      Physical Disk (Data & WAL)
```

### The Postmaster (Main Server Process)
When PostgreSQL starts up, the primary daemon (`postgres` binary) executes as the supervisor. Its duties:
- Allocate shared memory and initialize synchronization locks.
- Spawn auxiliary background processes (`checkpointer`, `background writer`, `walwriter`, `autovacuum launcher`, `stats collector`).
- Listen on network sockets (default TCP `5432` and Unix domain socket).
- Fork a dedicated backend process for each authenticated client connection.

---

## 2. Key Auxiliary Background Processes

| Process | Primary Duty | Production Impact |
| :--- | :--- | :--- |
| **Checkpointer** | Flushes dirty shared buffers to disk on scheduled intervals (`checkpoint_timeout`). | High disk I/O burst if `checkpoint_completion_target` is not tuned. |
| **Background Writer (bgwriter)** | Proactively cleans dirty pages in small batches before backends need free buffers. | Reduces latency spikes for foreground backend writes. |
| **WAL Writer** | Flushes Write-Ahead Log records from memory buffer to persistent disk. | Guarantees transaction commit durability (`fsync`). |
| **Autovacuum Launcher** | Monitors table dead-tuple ratios and spawns worker processes to reclaim disk space. | Prevents transaction ID wraparound and table bloat. |
| **Stats Collector** | Aggregates runtime statistics on table reads, index scans, and row counts. | Supplies the cost-based query planner with current statistics. |

---

## 3. PostgreSQL Memory Architecture

PostgreSQL categorizes memory into **Shared Memory Areas** (accessible by all processes) and **Process-Local Memory** (allocated per backend process).

```text
+-------------------------------------------------------------------------+
| TOTAL MEMORY USAGE                                                      |
|                                                                         |
| [ Shared Memory Area ]                                                  |
| ├── shared_buffers       (Typically 25% of system RAM)                  |
| ├── wal_buffers          (Default ~16MB)                                |
| └── max_locks_per_transaction structures                                |
|                                                                         |
| [ Per-Backend Private Memory ] (Allocated per active query/connection)  |
| ├── work_mem             (Sort, hash, merge joins per operation)       |
| ├── maintenance_work_mem (VACUUM, CREATE INDEX, ALTER TABLE)           |
| └── temp_buffers         (Temporary tables session storage)             |
+-------------------------------------------------------------------------+
```

> **Critical Formula for Sizing:**
> $$\text{Peak RAM Usage} \approx \text{shared\_buffers} + (\text{max\_connections} \times \text{work\_mem} \times \text{operations\_per\_query})$$
> Setting `work_mem = 64MB` with `max_connections = 500` can lead to Out-Of-Memory (OOM) killer terminating PostgreSQL under concurrent sort/hash queries!

---

## 4. Practical Demonstration

Run the following SQL queries inside `psql` to inspect active processes and memory settings:

```sql
-- View all background and client processes
SELECT pid, backend_type, usename, client_addr, state, query
FROM pg_stat_activity
ORDER BY backend_type;

-- Inspect active memory configurations
SHOW shared_buffers;
SHOW work_mem;
SHOW maintenance_work_mem;
SHOW max_connections;
```

---

## 5. Exercise and Verification

**Exercise:**
A production server with 32 GB RAM has `max_connections = 400` and `work_mem = 128MB`. A heavy analytical query performs 3 distinct sort and hash aggregate nodes in a single execution plan. What is the theoretical maximum private memory this single query might allocate, and what risk does this configuration present?

**Answer:**
Each sort or hash node can consume up to `work_mem` independently. 
$3 \times 128\text{ MB} = 384\text{ MB}$ for that single query.
If 100 concurrent users run similar queries simultaneously:
$100 \times 384\text{ MB} = 38.4\text{ GB}$, exceeding the total physical RAM of the host. The OS OOM killer will terminate the PostgreSQL postmaster process, resulting in database crash and recovery.
*Resolution:* Keep `work_mem` conservative (e.g., 8MB-16MB) globally, and increase it only within dedicated reporting sessions using `SET work_mem = '256MB';`.

---

## Official References
- [PostgreSQL Documentation: Chapter 19 - Server Configuration](https://www.postgresql.org/docs/current/runtime-config.html)
- [PostgreSQL Documentation: Chapter 28 - Monitoring Database Activity](https://www.postgresql.org/docs/current/monitoring-stats.html)

