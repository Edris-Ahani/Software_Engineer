-- 02_seed_data.sql: Populate representative sample dataset for realistic query plans
BEGIN;

-- Generate 1,000 realistic users
INSERT INTO store.users (id, email, full_name, metadata, is_active, created_at)
SELECT
    gen_random_uuid(),
    'user_' || i || '@example.com',
    'Customer ' || i,
    jsonb_build_object(
        'tier', CASE (i % 3) WHEN 0 THEN 'standard' WHEN 1 THEN 'gold' ELSE 'platinum' END,
        'country', CASE (i % 4) WHEN 0 THEN 'US' WHEN 1 THEN 'DE' WHEN 2 THEN 'CA' ELSE 'IR' END,
        'preferences', jsonb_build_object('newsletter', (i % 2 = 0), 'dark_mode', TRUE)
    ),
    (i % 20 != 0), -- 95% active
    clock_timestamp() - (i || ' minutes')::interval
FROM generate_series(1, 1000) AS s(i);

-- Insert 50 products with vector embeddings
INSERT INTO store.products (sku, title, description, category, price_cents, tags, embedding)
SELECT
    'SKU-' || LPAD(i::text, 5, '0'),
    'High Performance Product ' || i,
    'Enterprise-grade database and system engineering resource item #' || i,
    CASE (i % 5)
        WHEN 0 THEN 'Hardware'
        WHEN 1 THEN 'Software'
        WHEN 2 THEN 'Cloud'
        WHEN 3 THEN 'Networking'
        ELSE 'Books'
    END,
    (1000 + (i * 250)),
    ARRAY['tech', 'enterprise', 'v' || (i % 3 + 1)],
    ARRAY[sin(i::float), cos(i::float), (i % 10)::float / 10.0]::vector
FROM generate_series(1, 50) AS s(i);

-- Insert 10,000 orders distributed across 2026 partitions
INSERT INTO store.orders (order_date, user_id, total_amount_cents, status, shipping_address)
SELECT
    ('2026-01-01'::date + ((i % 360) || ' days')::interval)::date,
    (SELECT id FROM store.users OFFSET (i % 1000) LIMIT 1),
    ((i % 50 + 1) * 2500),
    CASE (i % 4)
        WHEN 0 THEN 'PENDING'
        WHEN 1 THEN 'PROCESSING'
        WHEN 2 THEN 'SHIPPED'
        ELSE 'DELIVERED'
    END,
    jsonb_build_object('city', 'Metropolis', 'postal_code', 10000 + (i % 90000))
FROM generate_series(1, 10000) AS s(i);

-- Insert 20,000 order items
INSERT INTO store.order_items (order_id, order_date, product_id, quantity, unit_price_cents)
SELECT
    o.order_id,
    o.order_date,
    (SELECT id FROM store.products OFFSET (o.order_id % 50) LIMIT 1),
    (o.order_id % 5 + 1),
    2500
FROM store.orders o
LIMIT 20000;

COMMIT;

-- Analyze statistics for optimizer accuracy
ANALYZE store.users;
ANALYZE store.products;
ANALYZE store.orders;
ANALYZE store.order_items;

