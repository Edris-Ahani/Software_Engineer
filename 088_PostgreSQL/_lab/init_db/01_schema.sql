-- 01_schema.sql: Initial schema setup for PostgreSQL lab
-- Ensure required extensions are loaded
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Enable schema separation
CREATE SCHEMA IF NOT EXISTS store;
CREATE SCHEMA IF NOT EXISTS analytics;

-- 1. Users table demonstrating UUID, constraints, and audit timestamps
CREATE TABLE store.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

-- 2. Products table with category, price, inventory, and vector embedding for AI semantic search
CREATE TABLE store.products (
    id BIGSERIAL PRIMARY KEY,
    sku VARCHAR(64) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    embedding vector(3), -- 3-dimensional demonstration vector
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

-- 3. Partitioned orders table (range partitioning by order_date)
CREATE TABLE store.orders (
    order_id BIGSERIAL,
    order_date DATE NOT NULL,
    user_id UUID NOT NULL REFERENCES store.users(id) ON DELETE CASCADE,
    total_amount_cents INTEGER NOT NULL CHECK (total_amount_cents >= 0),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    shipping_address JSONB NOT NULL,
    CONSTRAINT pk_orders PRIMARY KEY (order_id, order_date)
) PARTITION BY RANGE (order_date);

-- Partitions for 2026 quarters
CREATE TABLE store.orders_2026_q1 PARTITION OF store.orders
    FOR VALUES FROM ('2026-01-01') TO ('2026-04-01');

CREATE TABLE store.orders_2026_q2 PARTITION OF store.orders
    FOR VALUES FROM ('2026-04-01') TO ('2026-07-01');

CREATE TABLE store.orders_2026_q3 PARTITION OF store.orders
    FOR VALUES FROM ('2026-07-01') TO ('2026-10-01');

CREATE TABLE store.orders_2026_q4 PARTITION OF store.orders
    FOR VALUES FROM ('2026-10-01') TO ('2027-01-01');

-- Default partition for out-of-range dates
CREATE TABLE store.orders_default PARTITION OF store.orders DEFAULT;

-- 4. Order items table
CREATE TABLE store.order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    order_date DATE NOT NULL,
    product_id BIGINT NOT NULL REFERENCES store.products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0),
    CONSTRAINT fk_order FOREIGN KEY (order_id, order_date) REFERENCES store.orders(order_id, order_date) ON DELETE CASCADE
);

-- Indexes for performance demonstration
CREATE INDEX idx_users_email ON store.users(email);
CREATE INDEX idx_users_metadata_gin ON store.users USING GIN (metadata);
CREATE INDEX idx_products_trgm ON store.products USING GIN (title gin_trgm_ops);
CREATE INDEX idx_products_tags ON store.products USING GIN (tags);
CREATE INDEX idx_products_vector ON store.products USING hnsw (embedding vector_l2_ops);

