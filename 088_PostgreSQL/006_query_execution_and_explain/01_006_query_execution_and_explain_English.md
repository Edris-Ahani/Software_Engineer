[← Contents and learning path](../README.md) | [فارسی](01_006_query_execution_and_explain_Persian.md)

# 006 — Query Execution Plans and EXPLAIN ANALYZE

## Learning Goals
Deconstruct PostgreSQL's Cost-Based Optimizer (CBO). Decipher execution plan trees using `EXPLAIN (ANALYZE, BUFFERS)`, identify memory spillage to disk, and master scan types and join algorithms.

---

## 1. The Query Processing Pipeline

```text
SQL Query Text
      |
      v
 [ Parser ] ---------> Parse Tree (Syntax validation)
      |
      v
 [ Rewriter ] -------> Rewrite Tree (Applies VIEWs, RLS, and Rule system)
      |
      v
 [ Optimizer/Planner ]-> Paths Evaluated via Cost Estimator (Catalog Statistics)
      |
      v
 Execution Plan -----> Selected Lowest-Cost Plan Tree
      |
      v
 [ Executor ] --------> Accesses Shared Buffers / Disk & Returns Result Tuples
```

---

## 2. Anatomy of `EXPLAIN (ANALYZE, BUFFERS)`

Always include `BUFFERS` when analyzing queries in development or staging. Wall-clock timing can be deceptive due to OS cache, but buffer page counts are deterministic:

```sql
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT u.full_name, count(o.order_id) AS total_orders
FROM store.users u
JOIN store.orders o ON o.user_id = u.id
WHERE u.metadata @> '{"country": "IR"}'
GROUP BY u.full_name
ORDER BY total_orders DESC
LIMIT 10;
```

### Understanding the Plan Output Metrics

```text
->  Sort (cost=1420.50..1421.25 rows=300 width=36) (actual time=12.41..12.45 rows=10 loops=1)
      Sort Key: (count(o.order_id)) DESC
      Sort Method: quicksort  Memory: 48kB
      Buffers: shared hit=412 read=18
```

- **`cost=1420.50..1421.25`**: Planner units (arbitrary disk page fetch cost). `1420.50` is startup cost before producing the first row; `1421.25` is total cost to deliver all rows.
- **`actual time=12.41..12.45`**: Real wall-clock elapsed time in milliseconds for this node.
- **`loops=1`**: Number of times this execution node was invoked. Multiply `actual time` and `rows` by `loops` to determine true resource consumption!
- **`shared hit=412`**: Number of 8KB memory pages retrieved directly from RAM (`shared_buffers`).
- **`shared read=18`**: Number of 8KB blocks read from physical OS disk cache or NVMe storage.

---

## 3. Scan Strategies Compared

```text
1. Sequential Scan (Seq Scan):
   Reads table physical pages sequentially from first block to last block.
   Optimal when retrieving > 15-20% of the table's total rows.

2. Index Scan:
   Navigates B-Tree to find matching Tuple IDs (TIDs), then accesses heap page for each.
   Optimal for highly selective queries (< 5% of table). Can suffer if TIDs scatter randomly.

3. Index-Only Scan:
   Retrieves all requested attributes directly from the index leaves.
   Requires page to be marked clean in the Visibility Map.

4. Bitmap Index Scan + Bitmap Heap Scan:
   Step 1: Scans index and constructs an in-memory Bitmap of matching physical page numbers.
   Step 2: Scans table pages in strictly ascending physical disk block order.
   Eliminates random disk thrashing and allows combining multiple indexes with AND/OR!
```

---

## 4. Join Algorithms in the Planner

| Join Algorithm | Mechanism | When Chosen |
| :--- | :--- | :--- |
| **Nested Loop** | For each row in the outer table, probes the inner table (ideally via index). | Small outer table joined with an indexed inner table. |
| **Hash Join** | Builds an in-memory Hash Table of the smaller table in `work_mem`, then streams the larger table to probe. | Large unsorted datasets with equality join predicates (`=`). |
| **Merge Join** | Both tables must be pre-sorted on join keys. Steps through both lists concurrently like a zipper. | Large datasets already ordered by an index or explicit SORT node. |

---

## 5. Identifying Performance Red Flags

```text
[!] Row Count Discrepancy:
    Planner estimated rows=1, but actual rows=145,000.
    Cause: Stale statistics in pg_statistic. Solution: RUN 'ANALYZE table_name;'

[!] Disk Spillage (External Merge):
    'Sort Method: external merge  Disk: 84320kB'
    Cause: Data being sorted exceeded 'work_mem'. Spilling to temporary disk files kills speed!
    Solution: Increase 'work_mem' for that operation.
```

---

## 6. Exercise and Verification

**Exercise:**
You observe an execution plan containing:
`Sort Method: external merge  Disk: 34120kB`
The query takes 2.8 seconds. How do you tune this query's session to complete in RAM, and how does `EXPLAIN (ANALYZE, BUFFERS)` change?

**Answer:**
The sort required ~34 MB of temporary scratch disk because `work_mem` was smaller than the dataset being sorted.
Fix within session:
```sql
SET work_mem = '64MB';
```
Re-running the query plan will show:
`Sort Method: quicksort  Memory: ~35000kB`
Execution time typically drops by 80-90% because disk write/read I/O is completely eliminated.

---

## Official References
- [PostgreSQL Documentation: Chapter 14 - Performance Tips and EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)
- [PostgreSQL Documentation: Planner Cost Constants](https://www.postgresql.org/docs/current/runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS)

