# Security: Cross-Site Request Forgery (CSRF)

## What is it?
CSRF (often pronounced "sea-surf") is an attack that forces an end user to execute unwanted actions on a web application in which they are currently authenticated. 
In a CSRF attack, the attacker does not steal your password or cookie. Instead, they trick your browser into using your active login cookie to make a malicious request on their behalf.

## How it works (The Attack)
1. You log into your bank `bank.com`. Your browser saves the `session_id` cookie.
2. While still logged in, you visit an attacker's website `evil.com`.
3. The attacker's website contains a hidden form or an image tag: `<img src="https://bank.com/transfer?amount=10000&to=hacker" />`
4. Your browser automatically sees the URL and tries to load it. Because the domain is `bank.com`, your browser **automatically attaches your bank cookie** to the request.
5. The bank server sees a valid cookie, assumes you initiated the transfer, and sends the money!

## How to Prevent It
1. **SameSite Cookie Attribute**: This is the modern defense. If you set your authentication cookie to `SameSite=Lax` or `SameSite=Strict`, the browser will refuse to send the cookie if the request originates from a different domain (like `evil.com`).
2. **Anti-CSRF Tokens**: The traditional defense. The server generates a unique, random string (the CSRF token) and sends it to the client. Whenever the client submits a sensitive POST/PUT/DELETE request, it must include this token in a hidden form field or header. The attacker on `evil.com` cannot read the token because of the Same-Origin Policy (SOP), so their forged request will fail validation at the server.
