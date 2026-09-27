# Web Security & OWASP Top 10

## What is it?
Web Security is the practice of protecting websites, web applications, and APIs from cyber threats and unauthorized access. The **OWASP (Open Worldwide Application Security Project) Top 10** is a standard awareness document for developers and web application security. It represents a broad consensus about the most critical security risks to web applications.

## Key Concepts and Vulnerabilities (OWASP Top 10 Examples)
1. **Broken Access Control**: Attackers can bypass access control checks by modifying the URL, internal application state, or the HTML page, or by simply using an API attack tool to access other users' data.
   - *Prevention*: Implement Role-Based Access Control (RBAC), deny access by default, and validate authorization on the server-side for every request.
2. **Injection (e.g., SQL Injection)**: Untrusted data is sent to an interpreter as part of a command or query. The attacker's hostile data can trick the interpreter into executing unintended commands or accessing data without proper authorization.
   - *Prevention*: Use parameterized queries (Prepared Statements) or ORMs/ODMs. Never concatenate strings to build SQL queries.
3. **Cross-Site Scripting (XSS)**: Attackers inject malicious client-side scripts into web pages viewed by other users. This allows attackers to steal session cookies, deface websites, or redirect users to malicious sites.
   - *Prevention*: Escape/encode untrusted HTTP request data before putting it into an HTML page. Frameworks like React and Angular automatically escape variables by default.
4. **Cross-Site Request Forgery (CSRF)**: An attack that forces an end user to execute unwanted actions on a web application in which they're currently authenticated.
   - *Prevention*: Use Anti-CSRF tokens and SameSite cookie attributes.

## Other Important Security Concepts for Backend
- **CORS (Cross-Origin Resource Sharing)**: A security mechanism built into modern web browsers. It restricts web pages from making requests to a different domain than the one that served the web page, unless the server explicitly allows it via CORS headers.
- **Hashing vs. Encryption**: Passwords must always be *hashed* (one-way, e.g., using bcrypt or Argon2) with a unique salt, never encrypted (two-way) or stored in plain text.

## What Problems Does It Solve?
- **Data Breaches**: Prevents sensitive user data (passwords, credit cards, PII) from being stolen.
- **Reputation Loss**: Protects the company from the devastating legal and PR consequences of being hacked.

## Examples

### SQL Injection Vulnerability Example (Node.js)
```javascript
// VERY BAD: Vulnerable to SQL Injection
// If user inputs:  jane@example.com' OR '1'='1
// The query becomes: SELECT * FROM users WHERE email = 'jane@example.com' OR '1'='1' (Returns all users!)
const email = req.body.email;
const query = `SELECT * FROM users WHERE email = '${email}'`;
db.execute(query);

// GOOD: Using Parameterized Queries
// The database treats the input strictly as data, not as executable code.
const email = req.body.email;
const query = `SELECT * FROM users WHERE email = $1`;
db.execute(query, [email]);
```
