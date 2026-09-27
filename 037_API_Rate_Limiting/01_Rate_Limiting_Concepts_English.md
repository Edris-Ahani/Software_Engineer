# API Rate Limiting & Throttling

## What is it?
Rate limiting is a strategy for limiting network traffic. It puts a cap on how often someone can repeat an action within a certain timeframe (e.g., trying to log in to an account). Throttling is similar, but instead of blocking requests, it might just slow them down.

## Why is it important?
1. **Preventing DDoS Attacks & Abuse**: Without rate limits, a malicious user could send millions of requests per second to your server, crashing it.
2. **Brute Force Protection**: Prevents hackers from guessing passwords by trying thousands of combinations per minute.
3. **Cost Control**: If your API calls a third-party paid service (like OpenAI or AWS), an infinite loop in a client's code could cost you thousands of dollars.
4. **Fairness**: Ensures that one single user doesn't consume all the server's CPU and database resources, leaving the app slow for everyone else.

## Common Algorithms
1. **Token Bucket**: You are given a bucket with a certain number of tokens. Every request costs one token. The bucket refils at a constant rate. If the bucket is empty, the request is denied (HTTP 429 Too Many Requests).
2. **Leaky Bucket**: Similar to Token Bucket, but requests are processed at a strictly constant rate.
3. **Fixed Window**: Tracks the number of requests in a fixed time window (e.g., 00:00 to 00:01). If the limit is reached, wait until the next window.

## How to Implement?
Rate limiting is typically implemented in:
- **API Gateways / Load Balancers**: (e.g., Nginx, AWS API Gateway, Cloudflare). This is the best place to do it.
- **Application Level**: Using a fast in-memory store like **Redis**. In Node.js/Express, the `express-rate-limit` middleware is very popular.
