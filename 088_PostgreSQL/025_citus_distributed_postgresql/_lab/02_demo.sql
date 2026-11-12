\set ON_ERROR_STOP on

-- Run once in the fresh lesson database, after cluster registration.
-- This small shard count is for teaching, not a production recommendation.
SET citus.shard_count = 8;

CREATE SCHEMA citus_demo;

CREATE TABLE citus_demo.order_statuses (
    status_code text PRIMARY KEY,
    display_name text NOT NULL
);

SELECT create_reference_table('citus_demo.order_statuses');

CREATE TABLE citus_demo.tenants (
    tenant_id bigint PRIMARY KEY,
    tenant_name text NOT NULL
);

SELECT create_distributed_table(
    'citus_demo.tenants',
    'tenant_id',
    colocate_with => 'none'
);

CREATE TABLE citus_demo.orders (
    tenant_id bigint NOT NULL,
    order_id bigint NOT NULL,
    status_code text NOT NULL,
    total_amount numeric(12, 2) NOT NULL CHECK (total_amount >= 0),
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (tenant_id, order_id)
);

SELECT create_distributed_table(
    'citus_demo.orders',
    'tenant_id',
    colocate_with => 'citus_demo.tenants'
);

CREATE TABLE citus_demo.order_items (
    tenant_id bigint NOT NULL,
    order_id bigint NOT NULL,
    line_number integer NOT NULL CHECK (line_number > 0),
    sku text NOT NULL,
    quantity integer NOT NULL CHECK (quantity > 0),
    unit_price numeric(12, 2) NOT NULL CHECK (unit_price >= 0),
    PRIMARY KEY (tenant_id, order_id, line_number)
);

SELECT create_distributed_table(
    'citus_demo.order_items',
    'tenant_id',
    colocate_with => 'citus_demo.orders'
);

ALTER TABLE citus_demo.orders
    ADD CONSTRAINT orders_tenant_fk
    FOREIGN KEY (tenant_id) REFERENCES citus_demo.tenants (tenant_id);

ALTER TABLE citus_demo.orders
    ADD CONSTRAINT orders_status_fk
    FOREIGN KEY (status_code)
    REFERENCES citus_demo.order_statuses (status_code);

ALTER TABLE citus_demo.order_items
    ADD CONSTRAINT order_items_order_fk
    FOREIGN KEY (tenant_id, order_id)
    REFERENCES citus_demo.orders (tenant_id, order_id);

CREATE INDEX orders_tenant_created_at_idx
    ON citus_demo.orders (tenant_id, created_at DESC);

INSERT INTO citus_demo.order_statuses (status_code, display_name) VALUES
    ('new', 'New'),
    ('paid', 'Paid');

INSERT INTO citus_demo.tenants (tenant_id, tenant_name) VALUES
    (10, 'North Shop'),
    (20, 'South Shop'),
    (30, 'West Shop');

-- The same order ID can exist in different tenants.
INSERT INTO citus_demo.orders
    (tenant_id, order_id, status_code, total_amount) VALUES
    (10, 1001, 'paid', 120.00),
    (10, 1002, 'new', 80.00),
    (20, 1001, 'paid', 50.00);

INSERT INTO citus_demo.order_items
    (tenant_id, order_id, line_number, sku, quantity, unit_price) VALUES
    (10, 1001, 1, 'BOOK-01', 2, 60.00),
    (10, 1002, 1, 'BAG-01', 1, 80.00),
    (20, 1001, 1, 'PEN-01', 5, 10.00);

-- Expected: two orders for tenant 10, with totals 120.00 and 80.00.
SELECT tenant_id, order_id, total_amount
FROM citus_demo.orders
WHERE tenant_id = 10
ORDER BY order_id;

-- Expected: order 1001 -> 120.00, order 1002 -> 80.00.
SELECT orders.order_id,
       sum(items.quantity * items.unit_price) AS calculated_total
FROM citus_demo.orders AS orders
JOIN citus_demo.order_items AS items
    ON items.tenant_id = orders.tenant_id
   AND items.order_id = orders.order_id
WHERE orders.tenant_id = 10
GROUP BY orders.order_id
ORDER BY orders.order_id;

-- Expected: New -> 80.00, Paid -> 120.00 for tenant 10.
SELECT statuses.display_name, sum(orders.total_amount) AS total_amount
FROM citus_demo.orders AS orders
JOIN citus_demo.order_statuses AS statuses
    ON statuses.status_code = orders.status_code
WHERE orders.tenant_id = 10
GROUP BY statuses.display_name
ORDER BY statuses.display_name;

-- Expected: three orders, with a total of 250.00 across all tenants.
SELECT count(*) AS order_count, sum(total_amount) AS total_amount
FROM citus_demo.orders;

-- These SELECT statements execute during EXPLAIN ANALYZE.
EXPLAIN (ANALYZE, BUFFERS)
SELECT order_id, total_amount
FROM citus_demo.orders
WHERE tenant_id = 10;

EXPLAIN (ANALYZE, BUFFERS)
SELECT tenant_id, sum(total_amount)
FROM citus_demo.orders
GROUP BY tenant_id;

SELECT logicalrelid::regclass AS table_name,
       partmethod,
       colocationid
FROM pg_dist_partition
WHERE logicalrelid::regclass::text LIKE 'citus_demo.%'
ORDER BY logicalrelid::regclass::text;

SELECT table_name, shardid, nodename, nodeport, shard_size
FROM citus_shards
WHERE table_name::text LIKE 'citus_demo.%'
ORDER BY table_name::text, shardid, nodename;
