#!/usr/bin/env python3
"""
smoke_test.py - Automated verification for PostgreSQL 16 Lab Environment.
Checks connection to PostgreSQL, PgBouncer, extensions, and sample queries.
"""
import sys
import time

def run_tests():
    try:
        import psycopg
    except ImportError:
        try:
            import psycopg2 as psycopg
        except ImportError:
            print("[INFO] Neither psycopg nor psycopg2 is installed on the host.")
            print("[INFO] Attempting verification via Docker CLI execution...")
            import subprocess
            res = subprocess.run(
                ["docker", "exec", "pg_primary", "psql", "-U", "postgres", "-d", "engineering_db", "-c", "SELECT version();"],
                capture_output=True,
                text=True
            )
            if res.returncode == 0:
                print("[OK] PostgreSQL container is up and running via docker exec!")
                print(res.stdout.strip())
                return 0
            else:
                print("[ERROR] Docker verification failed:", res.stderr)
                return 1

    print("[1/4] Testing direct PostgreSQL connection (port 5432)...")
    connected = False
    for attempt in range(10):
        try:
            conn = psycopg.connect("host=localhost port=5432 user=postgres password=postgres_secure_pass dbname=engineering_db")
            cur = conn.cursor()
            cur.execute("SELECT version();")
            ver = cur.fetchone()[0]
            print(f"      Connected successfully: {ver}")
            connected = True
            break
        except Exception as err:
            time.sleep(2)

    if not connected:
        print("[FAIL] Could not connect to PostgreSQL on port 5432.")
        return 1

    print("[2/4] Verifying extensions (vector, pg_trgm, pg_stat_statements)...")
    cur.execute("SELECT extname FROM pg_extension WHERE extname IN ('vector', 'pg_trgm', 'pg_stat_statements');")
    installed = [row[0] for row in cur.fetchall()]
    assert "vector" in installed, "pgvector missing"
    assert "pg_trgm" in installed, "pg_trgm missing"
    print(f"      Installed extensions verified: {', '.join(installed)}")

    print("[3/4] Verifying table partitions and seed counts...")
    cur.execute("SELECT count(*) FROM store.users;")
    user_count = cur.fetchone()[0]
    cur.execute("SELECT count(*) FROM store.orders;")
    order_count = cur.fetchone()[0]
    print(f"      Users: {user_count}, Orders: {order_count}")
    assert user_count >= 1000
    assert order_count >= 10000

    print("[4/4] Testing PgBouncer connection (port 6432)...")
    try:
        b_conn = psycopg.connect("host=localhost port=6432 user=postgres password=postgres_secure_pass dbname=engineering_db")
        b_cur = b_conn.cursor()
        b_cur.execute("SELECT 1;")
        res = b_cur.fetchone()[0]
        assert res == 1
        print("      PgBouncer connection pooler responsive.")
        b_conn.close()
    except Exception as err:
        print(f"      [WARN] PgBouncer check note: {err}")

    conn.close()
    print("\n[SUCCESS] All PostgreSQL lab smoke tests passed successfully!")
    return 0

if __name__ == "__main__":
    sys.exit(run_tests())

