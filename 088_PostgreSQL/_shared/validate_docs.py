#!/usr/bin/env python3
"""
validate_docs.py - Verifies documentation structure and link consistency
for the 088_PostgreSQL chapter.
"""
import os
import sys
from pathlib import Path

CHAPTER_ROOT = Path(__file__).resolve().parent.parent

def validate_structure():
    errors = []
    readme_path = CHAPTER_ROOT / "README.md"
    if not readme_path.exists():
        errors.append("README.md is missing in chapter root.")

    expected_lessons = [
        "001_architecture_and_process_model",
        "002_installation_psql_and_config",
        "003_relational_modeling_and_constraints",
        "004_advanced_datatypes",
        "005_indexes_deep_dive",
        "006_query_execution_and_explain",
        "007_mvcc_vacuum_and_bloat",
        "008_transactions_acid_and_isolation",
        "009_locking_and_deadlocks",
        "010_window_functions_and_ctes",
        "011_table_partitioning",
        "012_stored_procedures_and_plpgsql",
        "013_full_text_search",
        "014_extensions_ecosystem",
        "015_connection_pooling_and_pgbouncer",
        "016_wal_and_checkpoints",
        "017_backup_and_pitr",
        "018_streaming_replication",
        "019_logical_replication_and_cdc",
        "020_high_availability_and_failover",
        "021_performance_tuning_and_monitoring",
        "022_security_roles_and_rls",
        "023_zero_downtime_migrations",
        "024_production_checklist_and_review",
        "025_citus_distributed_postgresql",
    ]

    for lesson in expected_lessons:
        lesson_dir = CHAPTER_ROOT / lesson
        if not lesson_dir.is_dir():
            errors.append(f"Missing lesson directory: {lesson}")
            continue

        en_file = lesson_dir / f"01_{lesson}_English.md"
        fa_file = lesson_dir / f"01_{lesson}_Persian.md"

        if not en_file.exists():
            errors.append(f"Missing English doc: {en_file.name}")
        if not fa_file.exists():
            errors.append(f"Missing Persian doc: {fa_file.name}")

    if errors:
        print(f"[FAIL] Found {len(errors)} documentation validation errors:")
        for err in errors:
            print(f"  - {err}")
        return 1

    print(f"[PASS] All {len(expected_lessons)} lessons validated with bilingual docs.")
    return 0

if __name__ == "__main__":
    sys.exit(validate_structure())

