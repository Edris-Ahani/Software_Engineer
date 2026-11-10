[← Contents and learning path](../README.md) | [فارسی](01_022_security_roles_and_rls_Persian.md)

# 022 — Security, RBAC, Data Encryption, and Row-Level Security (RLS)

## Learning Goals
Implement multi-tenant data security and access controls. Master Role-Based Access Control (RBAC), enforce least privilege with `DEFAULT PRIVILEGES`, encrypt sensitive data columns with `pgcrypto`, and eliminate cross-tenant data leaks using native Row-Level Security (RLS).

---

## 1. Role-Based Access Control (RBAC) Architecture

In PostgreSQL, users and groups are unified under the single concept of **Roles**:

```sql
-- 1. Create functional group roles (NOLOGIN)
CREATE ROLE db_readonly NOLOGIN;
CREATE ROLE db_readwrite NOLOGIN;

-- 2. Assign standard schema privileges to group roles
GRANT USAGE ON SCHEMA store TO db_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA store TO db_readonly;

GRANT USAGE ON SCHEMA store TO db_readwrite;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA store TO db_readwrite;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA store TO db_readwrite;

-- 3. Crucial: Apply DEFAULT PRIVILEGES for future tables created in the schema!
ALTER DEFAULT PRIVILEGES IN SCHEMA store 
GRANT SELECT ON TABLES TO db_readonly;

ALTER DEFAULT PRIVILEGES IN SCHEMA store 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO db_readwrite;

-- 4. Create application user role and assign membership
CREATE ROLE api_service_user WITH LOGIN PASSWORD 'strong_scram_pass' INHERIT;
GRANT db_readwrite TO api_service_user;
```

---

## 2. Row-Level Security (RLS) for Multi-Tenant Isolation

Row-Level Security guarantees that queries automatically filter rows based on contextual session parameters, even if an attacker attempts an unrestricted `SELECT * FROM store.documents`:

```text
Application Client ──[ SET LOCAL app.tenant_id = 'tenant_A' ]──> PostgreSQL
                                                                        │
                                                                        v
                                                          RLS Engine Appends Filter:
                                                  WHERE tenant_id = 'tenant_A' (Hardware Enforced)
```

### Implementing Multi-Tenant RLS:
```sql
CREATE TABLE store.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT
);

-- Enable RLS on the table
ALTER TABLE store.documents ENABLE ROW LEVEL SECURITY;
-- Force RLS even for table owners:
ALTER TABLE store.documents FORCE ROW LEVEL SECURITY;

-- Create policy evaluating session variable:
CREATE POLICY tenant_isolation_policy ON store.documents
    AS RESTRICTIVE
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
```

### Testing the Policy:
```sql
-- Client connects and binds session to Tenant A:
SET LOCAL app.current_tenant_id = 'a0000000-0000-0000-0000-000000000001';

-- Only rows matching Tenant A are visible; all others are transparently invisible!
SELECT id, title FROM store.documents;
```

---

## 3. Column-Level Encryption with `pgcrypto`

Protect highly sensitive fields (e.g., National IDs, Credit Cards) at rest using symmetric or public-key PGP encryption:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt data during INSERT
INSERT INTO store.users (id, email, full_name)
VALUES (
    gen_random_uuid(),
    'customer@example.com',
    -- Store as encrypted ciphertext
    pgp_sym_encrypt('Confidential Real Name', 'my_secret_encryption_key')
);

-- Decrypt dynamically when authorized:
SELECT email, 
       pgp_sym_decrypt(full_name::bytea, 'my_secret_encryption_key') AS decrypted_name
FROM store.users
WHERE email = 'customer@example.com';
```

---

## 4. Hardening Network Security (`pg_hba.conf`)

Enforce encrypted SSL/TLS connections for all external application network access:

```text
# Require encrypted TLS for all remote hosts
hostssl   all   all   0.0.0.0/0   scram-sha-256
```

---

## 5. Exercise and Verification

**Exercise:**
A developer tests an RLS policy using the `postgres` superuser account and complains: "Row-Level Security does not work; I can still see all other tenants' data!" What is the explanation, and how do you test RLS correctly?

**Answer:**
By default, **Superusers bypass all Row-Level Security policies** to prevent accidental lockouts during administrative maintenance.
To properly test RLS:
1. Switch to a non-superuser application role:
   `SET ROLE api_service_user;`
2. Or explicitly force RLS on the table even for owners:
   `ALTER TABLE store.documents FORCE ROW LEVEL SECURITY;`

---

## Official References
- [PostgreSQL Documentation: Chapter 5.8 - Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [PostgreSQL Documentation: Chapter 22 - Database Roles](https://www.postgresql.org/docs/current/user-manag.html)
- [PostgreSQL Documentation: pgcrypto Extension](https://www.postgresql.org/docs/current/pgcrypto.html)

