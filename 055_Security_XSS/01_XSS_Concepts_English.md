# Security: Cross-Site Scripting (XSS)

## What is it?
Cross-Site Scripting (XSS) is a vulnerability where an attacker injects malicious JavaScript into a legitimate website or web application. When other users visit the compromised page, the injected script executes in their browser, allowing the attacker to steal session cookies, passwords, or perform actions on their behalf.

## Types of XSS
1. **Stored XSS (Persistent)**: The attacker submits a malicious script (e.g., in a blog comment or forum post). The server saves it to the database. Later, when an innocent user loads the page, the database serves the script, and their browser executes it.
2. **Reflected XSS (Non-Persistent)**: The malicious script is hidden inside a URL. The attacker tricks a victim into clicking the link `http://example.com/search?q=<script>alert('Hacked')</script>`. The server reads the URL and reflects it straight back onto the page.

## How to Prevent It
1. **Output Encoding (Escaping)**: Never render user-generated content directly as raw HTML. Always convert special characters into HTML entities (e.g., `<` becomes `&lt;`). 
   *Note: Modern frontend frameworks like React, Angular, and Vue do this automatically when rendering text variables (e.g., `{user.name}` in React is safe by default).*
2. **Content Security Policy (CSP)**: An HTTP header that acts as a strict whitelist, telling the browser exactly which domains are allowed to load scripts. It blocks any inline `<script>` tags written by an attacker.
3. **HttpOnly Cookies**: If an attacker successfully executes an XSS attack, their first goal is usually to steal the `document.cookie`. Marking sensitive authentication cookies as `HttpOnly` prevents JavaScript from reading them entirely.
