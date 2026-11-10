[← Contents and learning path](../README.md) | [فارسی](01_010_window_functions_and_ctes_Persian.md)

# 010 — Window Functions and Recursive CTEs

## Learning Goals
Construct advanced analytical queries using Common Table Expressions (CTEs) and Window Functions. Learn when to use `MATERIALIZED` vs inlined CTEs, traverse hierarchical tree structures with `WITH RECURSIVE`, and calculate running totals, ranks, and rolling time-series metrics.

---

## 1. Common Table Expressions (CTEs) and Materialization

Since PostgreSQL 12, the query optimizer inlines CTEs automatically (treating them like subqueries) unless explicitly instructed otherwise:

```sql
-- Inlined CTE: Optimizer can push down WHERE clauses into the CTE
WITH active_users AS (
    SELECT id, email, metadata
    FROM store.users
    WHERE is_active = TRUE
)
SELECT * FROM active_users WHERE email LIKE '%@example.com';

-- Explicit MATERIALIZED CTE: Forces PostgreSQL to compute the CTE once as a temporary table
-- Useful to prevent expensive multi-execution if the CTE is referenced multiple times in the query
WITH regional_summary AS MATERIALIZED (
    SELECT metadata->>'country' AS country, count(*) AS total_customers
    FROM store.users
    GROUP BY metadata->>'country'
)
SELECT * FROM regional_summary WHERE total_customers > 100;
```

---

## 2. Recursive CTEs: Hierarchical Trees and Graph Traversal

A recursive CTE consists of an **Anchor Member** unioned with a **Recursive Member** until no new rows are produced:

```sql
-- Hierarchical organizational or category tree
CREATE TABLE store.categories (
    category_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_id INT REFERENCES store.categories(category_id)
);

-- Recursive path and depth calculation
WITH RECURSIVE category_tree AS (
    -- 1. Anchor member: Root categories (no parent)
    SELECT category_id, name, parent_id, 1 AS depth, name::TEXT AS breadcrumb
    FROM store.categories
    WHERE parent_id IS NULL

    UNION ALL

    -- 2. Recursive member: Join child rows to parent rows
    SELECT c.category_id, c.name, c.parent_id, ct.depth + 1, ct.breadcrumb || ' > ' || c.name
    FROM store.categories c
    JOIN category_tree ct ON c.parent_id = ct.category_id
)
SELECT category_id, depth, breadcrumb 
FROM category_tree 
ORDER BY breadcrumb;
```

---

## 3. Window Functions Architecture

Window functions compute aggregate values across a related partition of rows without collapsing the result into a single row (preserving individual record granularity):

```sql
SELECT 
    order_id,
    user_id,
    order_date,
    total_amount_cents,
    -- 1. Ranking within each customer
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY total_amount_cents DESC) AS customer_order_rank,
    -- 2. Cumulative running spending total per user
    SUM(total_amount_cents) OVER (
        PARTITION BY user_id 
        ORDER BY order_date 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS cumulative_spent_cents,
    -- 3. Prior order amount for comparison
    LAG(total_amount_cents, 1) OVER (
        PARTITION BY user_id 
        ORDER BY order_date
    ) AS previous_order_cents
FROM store.orders;
```

### Ranking Functions Difference: `ROW_NUMBER` vs `RANK` vs `DENSE_RANK`
For values `[100, 100, 50]`:
- `ROW_NUMBER()`: `1, 2, 3` (Unique sequential integers).
- `RANK()`: `1, 1, 3` (Ties receive same rank; subsequent rank skips).
- `DENSE_RANK()`: `1, 1, 2` (Ties receive same rank; no gap in numbering).

---

## 4. 7-Day Rolling Moving Average

```sql
SELECT 
    order_date,
    SUM(total_amount_cents) AS daily_revenue,
    -- 7-day moving average calculation
    AVG(SUM(total_amount_cents)) OVER (
        ORDER BY order_date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS rolling_7day_avg
FROM store.orders
GROUP BY order_date
ORDER BY order_date;
```

---

## 5. Exercise and Verification

**Exercise:**
You need to find the top 2 highest-value orders for each customer. A developer writes:
`SELECT * FROM store.orders WHERE ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY total_amount_cents DESC) <= 2;`
Why does PostgreSQL immediately reject this query with a syntax error, and what is the proper idiomatic pattern?

**Answer:**
Window functions are evaluated in the execution pipeline **after** `WHERE`, `GROUP BY`, and `HAVING` filters. Therefore, window functions cannot be directly used in a `WHERE` clause.
The proper solution is wrapping the query in a CTE or derived table:
```sql
WITH ranked_orders AS (
    SELECT order_id, user_id, total_amount_cents,
           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY total_amount_cents DESC) AS rnk
    FROM store.orders
)
SELECT order_id, user_id, total_amount_cents
FROM ranked_orders
WHERE rnk <= 2;
```

---

## Official References
- [PostgreSQL Documentation: Chapter 7.8 - WITH Queries (Common Table Expressions)](https://www.postgresql.org/docs/current/queries-with.html)
- [PostgreSQL Documentation: Chapter 3.5 - Window Functions](https://www.postgresql.org/docs/current/tutorial-window.html)

