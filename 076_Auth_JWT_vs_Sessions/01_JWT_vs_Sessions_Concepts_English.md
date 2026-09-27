# Authentication: JWT vs Stateful Sessions

## 1. Stateful Sessions (The Traditional Way)
- **How it works**: When a user logs in, the server generates a random string (a `Session ID`) and saves it in its database or memory (e.g., Redis). It sends this ID back to the user's browser in a Cookie. For every subsequent request, the browser sends the cookie, and the server looks up the ID in the database to see who the user is.
- **Pros**: Very secure. The server has 100% control. You can instantly invalidate a session (log a user out) just by deleting the ID from the database.
- **Cons**: It is "Stateful". The server must remember every logged-in user. If you have 10 million users, looking up the Session ID in the database for every single request adds latency and consumes server memory.

## 2. JWT (JSON Web Tokens - The Stateless Way)
- **How it works**: When a user logs in, the server creates a JSON object with their data (e.g., `{"userId": 5, "role": "admin"}`). The server cryptographically **signs** this JSON using a secret key and sends it to the user as a JWT. The server does NOT save anything in its database. For future requests, the user sends the JWT. The server just verifies the signature using its secret key. If the signature is valid, the server trusts the data inside it.
- **Pros**: It is "Stateless". Zero database lookups are needed to authenticate a user. Perfect for Microservices (Service A, B, and C can all verify the token independently using the same secret key).
- **Cons**: Because the server doesn't keep a record of the tokens, **you cannot easily invalidate or revoke a JWT** before it expires. If a hacker steals a JWT that is valid for 1 hour, they have full access for 1 hour, and the server cannot easily stop them.

## The Verdict
- Use **Sessions** (with Redis) if you are building a Monolith or a highly secure application (like a banking app) where you need immediate control to revoke access.
- Use **JWT** if you are building a distributed Microservices architecture or a public API where database lookups for every request would be a massive bottleneck.
