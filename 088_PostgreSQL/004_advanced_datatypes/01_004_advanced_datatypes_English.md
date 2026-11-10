[← Contents and learning path](../README.md) | [فارسی](01_004_advanced_datatypes_Persian.md)

# 004 — Advanced Data Types: JSONB, Arrays, and Range Types

## Learning Goals
Master semi-structured and non-scalar data types in PostgreSQL. Understand storage representation tradeoffs, JSONB querying and indexing (`jsonb_ops` vs `jsonb_path_ops`), array operations, and discrete/continuous range types.

---

## 1. JSON vs JSONB: Architectural Comparison

| Dimension | `JSON` | `JSONB` (Binary JSON) |
| :--- | :--- | :--- |
| **Storage Format** | Raw text string exact copy (preserves whitespace and key order). | Decomposed binary format with pre-parsed keys and type markers. |
| **Write Cost** | Fast (minimal parsing). | Slightly higher write cost (parses and organizes keys into binary tree). |
| **Read / Query Speed** | Slow (must re-parse entire JSON string on every access). | Extremely fast (supports direct O(1) key lookups without scanning text). |
| **Indexing Support** | No direct GIN indexing. Only functional/expression index. | Full Generalized Inverted Index (GIN) support for key/value searches. |
| **Duplicate Keys** | Retained. | Discarded; only the last duplicate value is preserved. |

> **Production Recommendation:** Always use `JSONB` unless you have an explicit legal or audit requirement to preserve exact textual whitespace.

---

## 2. JSONB Operators and Querying

```sql
-- Query JSONB column using operators
-- '->' extracts as JSON object; '->>' extracts as plain TEXT
SELECT id, 
       metadata->'preferences' AS prefs_json,
       metadata->'preferences'->>'dark_mode' AS is_dark_text
FROM store.users
WHERE metadata->>'tier' = 'gold';

-- Containment operator '@>' (Optimized for GIN indexes)
SELECT id, email
FROM store.users
WHERE metadata @> '{"country": "IR", "tier": "platinum"}';

-- Existence operator '?' and '?|' (checks for key presence)
SELECT id, email
FROM store.users
WHERE metadata ? 'preferences';
```

### JSONB Indexing Strategies: `jsonb_ops` vs `jsonb_path_ops`

```sql
-- Default GIN index (supports '@>', '?', '?&', '?|' on both keys and values)
CREATE INDEX idx_users_meta_default ON store.users USING GIN (metadata);

-- Path-only GIN index (smaller index size, supports only '@>', but faster lookups)
CREATE INDEX idx_users_meta_path ON store.users USING GIN (metadata jsonb_path_ops);

-- Expression B-Tree index for a specific high-frequency extracted scalar key
CREATE INDEX idx_users_tier_btree ON store.users ((metadata->>'tier'));
```

---

## 3. Native Array Types

PostgreSQL supports multidimensional arrays of any scalar data type:

```sql
-- Querying array containment and overlaps
-- Products tagged with 'enterprise'
SELECT id, title, tags
FROM store.products
WHERE 'enterprise' = ANY(tags);

-- Array containment operator '@>' (tags contains both 'enterprise' AND 'tech')
SELECT id, title
FROM store.products
WHERE tags @> ARRAY['enterprise', 'tech'];

-- Array overlap operator '&&' (tags contains ANY element in the list)
SELECT id, title
FROM store.products
WHERE tags && ARRAY['cloud', 'hardware'];

-- Expanding array elements into relational rows
SELECT id, title, unnest(tags) AS individual_tag
FROM store.products
LIMIT 10;
```

---

## 4. Range Types and Intervals

Range types represent contiguous intervals without requiring separate `start_date` and `end_date` columns:

```sql
-- Built-in range types:
-- int4range, int8range, numrange, tsrange, tstzrange, daterange

-- Determine if a date falls inside a seasonal campaign range
SELECT daterange('2026-03-21', '2026-06-21', '[]') @> '2026-05-15'::date AS is_in_spring;

-- Check if two employee shifts overlap
SELECT tsrange('2026-05-01 08:00', '2026-05-01 16:00') &&
       tsrange('2026-05-01 14:00', '2026-05-01 22:00') AS has_shift_overlap;
```

---

## 5. Exercise and Verification

**Exercise:**
A query searching for users with `metadata @> '{"country": "DE"}'` is slow. You observe two index definitions proposed by developers:
1. `CREATE INDEX idx_1 ON store.users USING GIN (metadata);`
2. `CREATE INDEX idx_2 ON store.users USING GIN (metadata jsonb_path_ops);`
Which index provides better read throughput and smaller index size for this containment query, and why?

**Answer:**
`idx_2` (`jsonb_path_ops`) is substantially better.
`jsonb_path_ops` hashes each JSON path and value together into single 32-bit hash tokens in the GIN index. It takes up to 60% less disk space than the default `jsonb_ops` and resolves `@>` containment checks faster. The only tradeoff is that `jsonb_path_ops` does not support key-existence checks (the `?` operator).

---

## Official References
- [PostgreSQL Documentation: Chapter 8.14 - JSON Types](https://www.postgresql.org/docs/current/datatype-json.html)
- [PostgreSQL Documentation: Chapter 8.17 - Range Types](https://www.postgresql.org/docs/current/rangetypes.html)

