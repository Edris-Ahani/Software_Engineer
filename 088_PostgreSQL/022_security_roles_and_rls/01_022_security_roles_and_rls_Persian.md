<div dir="rtl">

[← فهرست و مسیر یادگیری](../README.md) | [English Version](01_022_security_roles_and_rls_English.md)

# 022 — امنیت، کنترل نقش‌ها (RBAC) و امنیت سطری (RLS)

## هدف یادگیری
پیاده‌سازی استانداردهای امنیتی سازمانی و تفکیک داده‌های چندمستاجره (Multi-Tenant)؛ مدیریت نقش‌ها بر مبنای اصل حداقل دسترسی (Least Privilege) با `DEFAULT PRIVILEGES`، رمزنگاری ستون‌های حساس با `pgcrypto` و جلوگیری از نشت داده بین مستاجرین با امنیت در سطح سطر (Row-Level Security).

---

## ۱. معماری کنترل دسترسی بر پایه نقش (RBAC)

در PostgreSQL، کاربران و گروه‌ها در مفهوم یکپارچه‌ای به نام **نقش (Role)** تعریف می‌شوند:

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

## ۲. امنیت در سطح سطر (Row-Level Security) در معماری‌های چندمستاجره

مکانیزم RLS تضمین می‌کند که کوئری‌ها به‌صورت خودکار بر اساس متغیرهای سشن فیلتر شوند، حتی اگر یک هکر موفق به تزریق SQL شود و کوئری بدون شرط `SELECT * FROM store.documents` اجرا کند:

```text
درخواست برنامه ──[ تنظیم متغیر سشن: app.tenant_id = 'tenant_A' ]──> موتور دیتابیس
                                                                            │
                                                                            v
                                                       موتور RLS شرط زیر را اجباری می‌کند:
                                                    WHERE tenant_id = 'tenant_A' (در سطح سخت‌افزار)
```

### پیاده‌سازی RLS برای تفکیک چندمستاجره:
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

### آزمایش عملی پالیسی RLS:
```sql
-- Client connects and binds session to Tenant A:
SET LOCAL app.current_tenant_id = 'a0000000-0000-0000-0000-000000000001';

-- Only rows matching Tenant A are visible; all others are transparently invisible!
SELECT id, title FROM store.documents;
```

---

## ۳. رمزنگاری ستون‌های حساس با افزونه `pgcrypto`

برای محافظت از داده‌های محرمانه (نظیر کدهای ملی و شماره کارت) در برابر دسترسی مستقیم دیسک:

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

## ۴. امن‌سازی ارتباط شبکه در `pg_hba.conf`

اجبار کلاینت‌های راه دور به برقراری اتصال رمزنگاری‌شده با TLS:

```text
# Require encrypted TLS for all remote hosts
hostssl   all   all   0.0.0.0/0   scram-sha-256
```

---

## ۵. تمرین سناریومحور و پاسخ

**صورت تمرین:**  
برنامه‌نویسی پالیسی RLS را با کاربر پیش‌فرض `postgres` آزمایش می‌کند و می‌گوید: «پالیسی RLS کار نمی‌کند؛ من همچنان می‌توانم تمام رکوردهای سایر مستاجرین را ببینم!» دلیل چیست و روش تست درست چگونه است؟

**پاسخ:**  
کاربران ارشد (Superuser) به صورت پیش‌فرض تمام پالیسی‌های Row-Level Security را دور می‌زنند (Bypass) تا در زمان‌های نگهداری و خطایابی اضطراری سیستم قفل نشود.  
برای تست واقعی:
۱. سوییچ به یک نقش کاربری عادی اپلیکیشن با دستور `SET ROLE api_service_user;`.
۲. یا اعمال اجباری RLS حتی برای مالک جدول با دستور `ALTER TABLE store.documents FORCE ROW LEVEL SECURITY;`.

---

## منابع رسمی
- [مستندات PostgreSQL: فصل ۵ - پالیسی‌های امنیت سطری (Row Security Policies)](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [مستندات PostgreSQL: فصل ۲۲ - مدیریت نقش‌ها و کاربران](https://www.postgresql.org/docs/current/user-manag.html)
- [مستندات PostgreSQL: افزونه رمزنگاری pgcrypto](https://www.postgresql.org/docs/current/pgcrypto.html)

</div>

