# Security: SQL Injection (SQLi)

## What is it?
SQL Injection is a code injection technique where an attacker executes malicious SQL statements that control a web application's database server. It occurs when user input is improperly sanitized and directly concatenated into a raw SQL query.

## How it works
Imagine a login query written in raw string concatenation:
```javascript
// BAD CODE
const username = req.body.username;
const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = 'xxx'";
```
If an attacker enters `admin' --` as their username, the resulting query becomes:
```sql
SELECT * FROM users WHERE username = 'admin' --' AND password = 'xxx'
```
In SQL, `--` means a comment. The database ignores the password check entirely, and the attacker successfully logs in as `admin` without knowing the password!

## How to Prevent It
Never use raw string concatenation for SQL queries.
1. **Parameterized Queries (Prepared Statements)**: This is the primary defense. The database engine treats the user input strictly as a *literal value*, never as executable code.
```javascript
// GOOD CODE (Node.js with pg)
const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
const values = [req.body.username, req.body.password];
client.query(query, values);
```
2. **Use an ORM**: Most modern Object-Relational Mappers (ORMs) like Prisma, TypeORM, or Entity Framework automatically use parameterized queries under the hood, protecting you by default.
