[← Contents and learning path](../README.md) | [فارسی](01_013_access_control_cors_and_security_Persian.md)

# 013 — Access control, Basic Auth, CORS, and security headers

## Goal and prerequisites
Apply distinct controls for network access, authentication, browser cross-origin access, and response policy. Prerequisites: HTTPS and locations. First create a password file **on a Linux test host**. The `-c` option creates/overwrites the file; omit it when adding subsequent users. The worker must be able to read the file but ordinary users should not.


```bash
sudo apt install apache2-utils
sudo htpasswd -c /etc/nginx/admin.htpasswd admin
# Debian example: adapt the group to the actual worker user.
sudo chown root:www-data /etc/nginx/admin.htpasswd
sudo chmod 640 /etc/nginx/admin.htpasswd
```

## Restrict an administrative location
Add this **inside an existing HTTPS server**. Both address and password are required because `satisfy all` is explicit. The example network is a placeholder for your private management network. Do not publish Basic Auth over cleartext HTTP.


```nginx
location /admin/ {
    satisfy all;
    allow 10.30.0.0/24;
    deny all;
    auth_basic "Administration";
    auth_basic_user_file /etc/nginx/admin.htpasswd;
    proxy_pass http://127.0.0.1:3000;
}
```

## CORS is a browser policy
CORS does not authenticate a caller or stop curl. Prefer an application-level policy when routes need different methods or credentials. For a simple fixed-origin API, the following **server-context fragment** demonstrates preflight handling. Its allow list is deliberately one origin. If the application already emits CORS headers, choose one owner to prevent duplicate or conflicting headers.


```nginx
location /browser-api/ {
    add_header Access-Control-Allow-Origin "https://app.example.com" always;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
    add_header Vary "Origin" always;
    add_header X-Content-Type-Options "nosniff" always;

    if ($request_method = OPTIONS) { return 204; }
    proxy_pass http://127.0.0.1:3000/;
}
```

## Tradeoffs and verification
A simple `if` returning a response is a limited, predictable use; do not build a general routing program out of nested rewrite conditions. Credentialed browser requests need an explicit origin, `Access-Control-Allow-Credentials: true`, appropriate client settings, and CSRF protection where relevant. Wildcard origin cannot be used for credentialed access. Allowing a header is not validating its token.

Security headers need application-specific review. `nosniff` helps constrain content interpretation. CSP must match actual scripts, styles, connections and framing needs; do not paste a policy that silently breaks the frontend. Add HSTS only on a verified HTTPS scope. By the traditional inheritance rule, this location's `add_header` set must include any parent security headers it still needs.


```bash
curl -i -X OPTIONS https://api.example.com/browser-api/orders \
  -H 'Origin: https://app.example.com' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: Content-Type,Authorization'
curl -i https://api.example.com/admin/
curl -i -u admin https://api.example.com/admin/
```

## Exercise and answer
Try a different Origin in a real browser. The fixed allowed-origin response does not match it, so the browser must not expose the response to that origin. Curl can still read it: actual authorization must remain in the application. Test the admin endpoint from both allowed and denied networks; Basic Auth alone must not bypass the IP rule.

## Official references

- [Basic authentication](https://nginx.org/en/docs/http/ngx_http_auth_basic_module.html)
- [Response header rules](https://nginx.org/en/docs/http/ngx_http_headers_module.html)
