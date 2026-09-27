# CORS (Cross-Origin Resource Sharing)

## The Same-Origin Policy (SOP)
For security reasons, web browsers enforce the **Same-Origin Policy**. This means a JavaScript application running on `https://my-website.com` is strictly forbidden from making API requests to `https://api.another-site.com`. If SOP didn't exist, a malicious website you visit could silently make HTTP requests to your bank using your saved cookies.

## What is CORS?
CORS is a mechanism that allows servers to *relax* the Same-Origin Policy. It uses special HTTP headers to tell the browser: "It is safe to let `my-website.com` read my data."

## How it works (The Preflight Request)
When your frontend tries to make a complex request (like a `POST` or `PUT` with JSON) to a different domain, the browser automatically pauses the request and performs a "Preflight":
1. **The Browser asks**: It sends an `OPTIONS` HTTP request to the API, asking "Are you willing to accept a `POST` request from `my-website.com`?"
2. **The Server responds**: The API responds with the `Access-Control-Allow-Origin: https://my-website.com` header (and `Access-Control-Allow-Methods: POST`).
3. **The Actual Request**: The browser sees the permission is granted, and only then does it send the actual `POST` request with the JSON data.

## Common CORS Errors
If you see the dreaded `Blocked by CORS policy` error in your browser console, it almost always means **your backend server** is not sending the correct `Access-Control-Allow-Origin` headers. You cannot fix this from the frontend (unless you use a proxy).
