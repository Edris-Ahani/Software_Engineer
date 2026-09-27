# Security & Cryptography Basics

## What is it?
Cryptography is the practice of securing communication and data in the presence of adversaries. As a software engineer, you don't need to invent new cryptographic algorithms, but you MUST know how to use existing ones correctly.

## 1. Encoding vs Encryption vs Hashing

### Encoding
- **Purpose**: Transforms data into a new format so it can be safely transmitted across different systems.
- **Security**: Zero security. Anyone can decode it.
- **Reversible?**: Yes.
- **Example**: Base64 encoding. Used for sending binary data (like images) in a text-based format (like JSON).

### Encryption
- **Purpose**: Transforms data to keep it secret from unauthorized parties.
- **Security**: High. Only someone with the correct "Key" can read it.
- **Reversible?**: Yes (if you have the key).
- **Types**: 
  - *Symmetric*: The same key is used to lock and unlock (e.g., AES-256).
  - *Asymmetric*: Uses a pair of keys—a Public Key (to lock) and a Private Key (to unlock) (e.g., RSA).
- **Example**: Encrypting credit card numbers in a database.

### Hashing
- **Purpose**: Ensures data integrity and securely stores passwords.
- **Security**: High. It mathematically scrambles the input into a fixed-length string.
- **Reversible?**: No (One-way function). You cannot turn a hash back into the original password.
- **Example**: Storing user passwords using `bcrypt` or `Argon2`. 
- **Note**: Always use "Salting" (adding random data to the password before hashing) to prevent Rainbow Table attacks.

## 2. HTTPS and SSL/TLS
- **HTTP** sends data in plain text. If you log in on an HTTP site, a hacker on your Wi-Fi can see your password.
- **HTTPS (HTTP Secure)** uses SSL/TLS to encrypt all communication between the client and the server.
- **Certificates**: A digital certificate (issued by authorities like Let's Encrypt) proves that the server you are talking to is the real one, preventing Man-in-the-Middle (MitM) attacks.
