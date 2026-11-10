# PostgreSQL — راهنمای جامع و مهندسی / Practical & Production Handbook

<div dir="rtl">

این مجموعهٔ دوزبانه در ادامهٔ فصل‌های مهندسی نرم‌افزار مخزن با نام `088_PostgreSQL` طراحی و پیاده‌سازی شده است. تمام پوشه‌های داخلی با پیشوند `001_` تا `024_` به ترتیب مسیر یادگیری استاندارد و مهندسی از مفاهیم اولیه و معماری پردازش‌ها تا کارایی پیشرفته، شاردینگ، ایندکس‌گذاری، امنیت و نگهداری پروداکشن تنظیم شده‌اند.

هر درس شامل دو فایل مجزای `..._Persian.md` و `..._English.md` است. هر درس شامل اهداف آموزشی، دیاگرام معماری، سناریوهای عملی SQL، بررسی عملکرد با `EXPLAIN (ANALYZE, BUFFERS)`، نکات پروداکشن و تمرین به همراه پاسخ است.

</div>

This bilingual handbook is structured in order of mastery: from internal process and memory architecture, data modeling, query optimization, and concurrency control to high availability, replication, connection pooling, and production readiness. Every lesson contains explicit English and Persian materials with production-grade SQL and architectural diagrams.

- [راهنمای اجرای آزمایشگاه داکر — فارسی](00_HOW_TO_RUN_Persian.md)
- [Docker Lab Run Guide — English](00_HOW_TO_RUN_English.md)
- [Docker Lab Compose & Services](_lab/compose.yaml)
- [Automated Verification Tests](_lab/smoke_test.py)

## مسیر یادگیری / Learning Path

| شماره / No. | فارسی | English |
| :--- | :--- | :--- |
| `001` | [معماری پردازش‌ها و مدل حافظه](001_architecture_and_process_model/01_001_architecture_and_process_model_Persian.md) | [Architecture and Process Model](001_architecture_and_process_model/01_001_architecture_and_process_model_English.md) |
| `002` | [نصب، ابزار psql و تنظیمات سرور](002_installation_psql_and_config/01_002_installation_psql_and_config_Persian.md) | [Installation, psql, and Configuration](002_installation_psql_and_config/01_002_installation_psql_and_config_English.md) |
| `003` | [مدل‌سازی رابطه‌ای، انواع کلیدها و قیدها](003_relational_modeling_and_constraints/01_003_relational_modeling_and_constraints_Persian.md) | [Relational Modeling, Keys, and Constraints](003_relational_modeling_and_constraints/01_003_relational_modeling_and_constraints_English.md) |
| `004` | [انواع داده‌های پیشرفته: JSONB، آرایه‌ها و Range Types](004_advanced_datatypes/01_004_advanced_datatypes_Persian.md) | [Advanced Data Types: JSONB, Arrays, and Ranges](004_advanced_datatypes/01_004_advanced_datatypes_English.md) |
| `005` | [تحلیل عمیق انواع ایندکس‌ها (B-Tree, GIN, GiST, BRIN)](005_indexes_deep_dive/01_005_indexes_deep_dive_Persian.md) | [Indexes Deep Dive: B-Tree, GIN, GiST, and BRIN](005_indexes_deep_dive/01_005_indexes_deep_dive_English.md) |
| `006` | [تحلیل کوئری و بررسی EXPLAIN ANALYZE](006_query_execution_and_explain/01_006_query_execution_and_explain_Persian.md) | [Query Execution Plans and EXPLAIN ANALYZE](006_query_execution_and_explain/01_006_query_execution_and_explain_English.md) |
| `007` | [مکانیزم چندنسخه‌ای MVCC، واکیوم و Bloat](007_mvcc_vacuum_and_bloat/01_007_mvcc_vacuum_and_bloat_Persian.md) | [MVCC, VACUUM, Autovacuum, and Table Bloat](007_mvcc_vacuum_and_bloat/01_007_mvcc_vacuum_and_bloat_English.md) |
| `008` | [تراکنش‌ها، اصول ACID و سطوح ایزولاسیون](008_transactions_acid_and_isolation/01_008_transactions_acid_and_isolation_Persian.md) | [Transactions, ACID Guarantees, and Isolation Levels](008_transactions_acid_and_isolation/01_008_transactions_acid_and_isolation_English.md) |
| `009` | [سیستم قفل‌گذاری، Row Locks و بن‌بست (Deadlock)](009_locking_and_deadlocks/01_009_locking_and_deadlocks_Persian.md) | [Locking Mechanics, Row Locks, and Deadlocks](009_locking_and_deadlocks/01_009_locking_and_deadlocks_English.md) |
| `010` | [توابع تحلیلی پنجره‌ای (Window Functions) و CTEs](010_window_functions_and_ctes/01_010_window_functions_and_ctes_Persian.md) | [Window Functions and Recursive CTEs](010_window_functions_and_ctes/01_010_window_functions_and_ctes_English.md) |
| `011` | [پارتیشن‌بندی جداول (Declarative Partitioning)](011_table_partitioning/01_011_table_partitioning_Persian.md) | [Declarative Table Partitioning and Pruning](011_table_partitioning/01_011_table_partitioning_English.md) |
| `012` | [توابع روال‌مند، پروسیجرها و تریگرها در PL/pgSQL](012_stored_procedures_and_plpgsql/01_012_stored_procedures_and_plpgsql_Persian.md) | [Stored Procedures, PL/pgSQL Functions, and Triggers](012_stored_procedures_and_plpgsql/01_012_stored_procedures_and_plpgsql_English.md) |
| `013` | [جستجوی متنی پیشرفته (Full-Text Search)](013_full_text_search/01_013_full_text_search_Persian.md) | [Full-Text Search: tsvector, tsquery, and Ranking](013_full_text_search/01_013_full_text_search_English.md) |
| `014` | [اکوسیستم اکستنشن‌ها: pgvector، pg_trgm و PostGIS](014_extensions_ecosystem/01_014_extensions_ecosystem_Persian.md) | [Extensions Ecosystem: pgvector, pg_trgm, and PostGIS](014_extensions_ecosystem/01_014_extensions_ecosystem_English.md) |
| `015` | [مدیریت اتصالات و Connection Pooling با PgBouncer](015_connection_pooling_and_pgbouncer/01_015_connection_pooling_and_pgbouncer_Persian.md) | [Connection Pooling and PgBouncer Architecture](015_connection_pooling_and_pgbouncer/01_015_connection_pooling_and_pgbouncer_English.md) |
| `016` | [معماری WAL، فرآیند Checkpoint و پایداری داده](016_wal_and_checkpoints/01_016_wal_and_checkpoints_Persian.md) | [Write-Ahead Logging (WAL) and Checkpoints](016_wal_and_checkpoints/01_016_wal_and_checkpoints_English.md) |
| `017` | [استراتژی‌های پشتیبان‌گیری، pg_dump و PITR](017_backup_and_pitr/01_017_backup_and_pitr_Persian.md) | [Backup Strategies, Logical Dumps, and PITR](017_backup_and_pitr/01_017_backup_and_pitr_English.md) |
| `018` | [رپلیکیشن فیزیکی جریانی (Streaming Replication)](018_streaming_replication/01_018_streaming_replication_Persian.md) | [Physical Streaming Replication and Failover](018_streaming_replication/01_018_streaming_replication_English.md) |
| `019` | [رپلیکیشن منطقی و دریافت تغییرات داده (CDC)](019_logical_replication_and_cdc/01_019_logical_replication_and_cdc_Persian.md) | [Logical Replication, Publications, and CDC](019_logical_replication_and_cdc/01_019_logical_replication_and_cdc_English.md) |
| `020` | [معماری High Availability با Patroni و etcd](020_high_availability_and_failover/01_020_high_availability_and_failover_Persian.md) | [High Availability Architectures: Patroni and etcd](020_high_availability_and_failover/01_020_high_availability_and_failover_English.md) |
| `021` | [تیونینگ کارایی، مانیتورینگ و pg_stat_statements](021_performance_tuning_and_monitoring/01_021_performance_tuning_and_monitoring_Persian.md) | [Performance Tuning, Metrics, and pg_stat_statements](021_performance_tuning_and_monitoring/01_021_performance_tuning_and_monitoring_English.md) |
| `022` | [امنیت، کنترل نقش‌ها (RBAC) و امنیت سطری (RLS)](022_security_roles_and_rls/01_022_security_roles_and_rls_Persian.md) | [Security, RBAC, Data Encryption, and RLS](022_security_roles_and_rls/01_022_security_roles_and_rls_English.md) |
| `023` | [مایگریشن‌های اسکیما بدون قطعی (Zero-Downtime)](023_zero_downtime_migrations/01_023_zero_downtime_migrations_Persian.md) | [Zero-Downtime Migrations and Safe DDL](023_zero_downtime_migrations/01_023_zero_downtime_migrations_English.md) |
| `024` | [چک‌لیست استقرار، نگهداری و خطایابی پروداکشن](024_production_checklist_and_review/01_024_production_checklist_and_review_Persian.md) | [Production Checklist, Health Checks, and Incident Runbook](024_production_checklist_and_review/01_024_production_checklist_and_review_English.md) |

---

<div dir="rtl">

## سطوح اولویت مطالعه

1. **اولویت اول — مبانی و کارایی روزمره (درس‌های ۰۰۱ تا ۰۰۹):** درک حافظه و پردازش، مدل داده، ایندکس‌گذاری، تحلیل پلن اجرایی، MVCC، تراکنش‌ها و قفل‌ها برای هر توسعه‌دهنده بک‌اند و مهندس نرم‌افزار حیاتی است.
2. **اولویت دوم — مهارت‌های پیشرفته داده و کوئری‌نویسی (درس‌های ۰۱۰ تا ۰۱۵):** کار با داده‌های نیمه‌ساختاریافته JSONB، توابع تحلیلی، پارتیشن‌بندی، جستجوی متنی، بردارها (pgvector برای هوش مصنوعی) و PgBouncer.
3. **اولویت سوم — معماری زیرساخت، دسترسی‌پذیری و پروداکشن (درس‌های ۰۱۶ تا ۰۲۴):** رپلیکیشن، پایداری WAL، پشتیبان‌گیری در لحظه (PITR)، خوشه‌بندی High Availability، تغییرات اسکیما بدون قطعی و چک‌لیست پایش سیستم.

</div>

**Priority Tier 1 — Core & Query Foundations (001–009):** Internal architecture, indexing, execution plans, MVCC, and transaction locking.
**Priority Tier 2 — Advanced Storage & Analytical Features (010–015):** JSONB, Window functions, partitioning, FTS, AI vector search, and PgBouncer.
**Priority Tier 3 — Reliability, Scaling, and SRE (016–024):** WAL durability, PITR, streaming/logical replication, HA clusters, zero-downtime DDL, and production checklists.

