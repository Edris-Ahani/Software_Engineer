# Idempotency, Retries, and Circuit Breakers

## 1. Idempotency
An API is **Idempotent** if making the same exact request multiple times produces the same result as making it just once.
- **Why is it critical?** Imagine a user clicks the "Pay $50" button. The request reaches the server, the server deducts $50, but the internet connection drops before the server can reply "Success". The user clicks the button again. If the API is not idempotent, they will be charged $100!
- **How to implement**: The client generates a unique `Idempotency-Key` (a UUID) and sends it in the HTTP header. The server checks the database: "Have I seen this key before?". If yes, it just returns the previous cached response without charging the user again.
- **HTTP Methods**: `GET`, `PUT`, and `DELETE` are meant to be idempotent by design. `POST` is not.

## 2. Exponential Backoff and Jitter (Retry Pattern)
When a network request fails (e.g., trying to reach a third-party API), a microservice should retry. However, if a service goes down and 10,000 clients immediately retry every 1 second, they will DDoS the struggling server and kill it permanently.
- **Exponential Backoff**: You increase the wait time between each retry (Wait 1s, then 2s, then 4s, then 8s).
- **Jitter**: Adding a random number of milliseconds to the wait time so that all 10,000 clients don't retry at the *exact same microsecond*.

## 3. Circuit Breaker Pattern
If a downstream microservice is completely broken and timing out, retrying is a waste of resources and slows down the entire system. 
- A **Circuit Breaker** wraps the API calls. If it detects too many failures in a row (e.g., 5 errors), it "trips" (opens the circuit) and immediately returns an error for all future requests without even trying to hit the broken service. 
- After a timeout period, it allows one test request to pass (Half-Open state). If it succeeds, the circuit closes and normal operations resume.
