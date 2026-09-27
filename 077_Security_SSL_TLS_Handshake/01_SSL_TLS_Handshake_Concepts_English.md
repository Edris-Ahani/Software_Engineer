# Security: SSL/TLS Handshake & HTTPS

## Why do we need HTTPS?
If you send data over HTTP, it is transmitted in plain text. Anyone intercepting the network traffic (like a hacker on a public Wi-Fi) can easily read your passwords, credit cards, and emails.
**HTTPS** (HTTP Secure) uses the **TLS (Transport Layer Security)** protocol to encrypt the data so that even if it's intercepted, it looks like unreadable gibberish.

## Symmetric vs Asymmetric Encryption
- **Symmetric Encryption**: Both the sender and receiver use the *exact same key* to lock and unlock the data. It is extremely fast, but the problem is: How do you safely share this key over the internet without a hacker stealing it?
- **Asymmetric Encryption**: Uses a pair of keys (Public Key and Private Key). You can share the Public Key with anyone. Data encrypted with the Public Key can *only* be decrypted by the Private Key (which never leaves the server). This is highly secure but incredibly slow and CPU-heavy.

## The TLS Handshake (The Magic)
To get the best of both worlds (security and speed), TLS uses *both* methods in a brilliant process called the TLS Handshake:

1. **Client Hello**: The browser connects to the server and says, "I want to communicate securely. Here are the encryption rules I support."
2. **Server Hello & Certificate**: The server replies, "Let's use this rule. Here is my SSL Certificate, which contains my **Public Key**. An authority has signed this certificate, proving I am the real server."
3. **The Secret Key Exchange**: The browser verifies the certificate. It then generates a brand new, random **Symmetric Key** (Session Key). The browser uses the server's **Public Key** (Asymmetric) to encrypt this Session Key, and sends it to the server.
4. **The Unlocking**: The server receives the encrypted Session Key and uses its hidden **Private Key** to decrypt it. 
5. **Secure Connection**: Now, both the browser and the server have the exact same Symmetric Session Key, securely exchanged without anyone else knowing it. From this moment on, they use this fast Symmetric Key to encrypt all HTTP requests and responses!
