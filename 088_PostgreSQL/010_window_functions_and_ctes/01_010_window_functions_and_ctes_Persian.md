<div dir="rtl">

[← فهرست و مسیر یادگیری](../README.md) | [English Version](01_010_window_functions_and_ctes_English.md)

# 010 — توابع تحلیلی پنجره‌ای (Window Functions) و CTEs

## هدف یادگیری
تسلط بر کوئری‌نویسی تحلیلی با استفاده از عبارات جدول مشترک (CTEs) و توابع پنجره‌ای (Window Functions)؛ درک تفاوت Inlining و `MATERIALIZED` در CTEها، پیمایش درخت‌ها و ساختارهای سلسله‌مراتبی با `WITH RECURSIVE` و محاسبه‌ی میانگین متحرک و رتبه‌بندی رکوردها.

---

## ۱. عبارات جدول مشترک (CTEs) و مفهوم Materialization

از نسخه ۱۲ به بعد در PostgreSQL، بهینه‌ساز به‌صورت خودکار کدهای CTE را درون کوئری اصلی ادغام (Inline) می‌کند تا شرایط `WHERE` را به داخل آن هدایت کند، مگر اینکه صریحاً آن را تغییر دهید:

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

## ۲. عبارات بازگشتی (Recursive CTEs): درخت‌ها و گراف‌ها

یک CTE بازگشتی از دو بخش تشکیل شده است: **عضو لنگر (Anchor Member)** و **عضو بازگشتی (Recursive Member)** که با `UNION ALL` متصل می‌شوند تا زمانی که ردیف جدیدی تولید نشود:

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

## ۳. معماری و کاربرد توابع پنجره‌ای (Window Functions)

توابع پنجره‌ای مقادیر تجمعی و محاسباتی را در مجموعه‌ای از ردیف‌های مرتبط بدون فشرده‌سازی سطرها (برخلاف `GROUP BY` که سطرها را در یک خروجی ادغام می‌کند) محاسبه می‌کنند:

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

### تفاوت توابع رتبه‌بندی: `ROW_NUMBER` در برابر `RANK` در برابر `DENSE_RANK`
برای مقادیر ورودی `[100, 100, 50]`:
- `ROW_NUMBER()`: اعداد یکتای پیوسته `1, 2, 3`.
- `RANK()`: مقادیر برابر رتبه یکسان می‌گیرند و عدد بعدی پرش دارد: `1, 1, 3`.
- `DENSE_RANK()`: مقادیر برابر رتبه یکسان می‌گیرند بدون پرش در شماره بعدی: `1, 1, 2`.

---

## ۴. محاسبه میانگین متحرک ۷ روزه (Rolling Moving Average)

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

## ۵. تمرین سناریومحور و پاسخ

**صورت تمرین:**  
می‌خواهید ۲ سفارش گران‌قیمت هر مشتری را استخراج کنید. اگر کوئری زیر را بنویسید:  
`SELECT * FROM store.orders WHERE ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY total_amount_cents DESC) <= 2;`  
چرا PostgreSQL فوراً با خطای سینتکس مانع اجرای آن می‌شود و راه‌حل استاندارد چیست؟

**پاسخ:**  
توابع پنجره‌ای در خط لوله اجرای موتور پایگاه‌داده، **پس از فیلترهای `WHERE`، `GROUP BY` و `HAVING`** پردازش می‌شوند. بنابراین شرط `WHERE` هنوز از وجود مقدار این تابع مطلع نیست.  
راه‌حل استاندارد قراردادن کوئری در یک CTE یا Subquery است:
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

## منابع رسمی
- [مستندات PostgreSQL: کوئری‌های WITH و CTEs](https://www.postgresql.org/docs/current/queries-with.html)
- [مستندات PostgreSQL: راهنمای توابع پنجره‌ای (Window Functions)](https://www.postgresql.org/docs/current/tutorial-window.html)

</div>

