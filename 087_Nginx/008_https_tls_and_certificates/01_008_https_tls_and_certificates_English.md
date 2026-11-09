[← Contents and learning path](../README.md) | [فارسی](01_008_https_tls_and_certificates_Persian.md)

# 008 — HTTPS, certificates, SNI, and renewal

## Goal and prerequisites
Separate encryption from identity verification and operate certificates without surprise expiry. Prerequisites: DNS, reverse proxy, and access to a domain for public TLS. This **HTTP-context fragment** requires existing certificate files. It cannot pass `nginx -t` until those files exist. Use a supported Nginx build with HTTP/2; `http2 on` requires Nginx 1.25.1 or newer.


```nginx
server {
    listen 80;
    server_name app.example.com;
    return 308 https://app.example.com$request_uri;
}

server {
    listen 443 ssl;
    http2 on;
    server_name app.example.com;

    ssl_certificate /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_session_cache shared:TLS:10m;
    ssl_session_timeout 1h;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Read the security properties
The full chain contains the leaf certificate followed by needed intermediates. The private key stays private; it is not the certificate. The client validates the trusted chain, validity period, and hostname in Subject Alternative Name (SAN). SNI lets the client announce a hostname during TLS, before the HTTP Host header exists.

The fixed hostname in the redirect avoids using an arbitrary incoming Host to construct the target. HTTP/2 multiplexes streams on a connection; it does not automatically enable HTTP/2 to the application. Some older packages use `listen 443 ssl http2`; prefer the syntax supported by your installed version and keep the deployment on a maintained release.


```bash
# Replace app.example.com and 203.0.113.10 with your domain and server IP.
curl -Iv --resolve app.example.com:443:203.0.113.10 https://app.example.com/
openssl s_client -connect app.example.com:443 -servername app.example.com \
  -verify_hostname app.example.com -verify_return_error </dev/null
openssl x509 -in /etc/nginx/certs/fullchain.pem -noout -dates -ext subjectAltName
```

## Issuance, renewal, and verification
Choose an ACME client and a challenge your infrastructure can satisfy. HTTP-01 needs the challenge URL reachable on port 80; DNS-01 needs controlled DNS updates and supports wildcard issuance. The redirect-only port-80 server above must be adapted if your client uses a webroot challenge; an installer plugin may manage that itself. Do not claim issuance succeeded until validation completes.

Automate renewal, test the client's renewal workflow, reload Nginx after successful replacement, and monitor the certificate actually served on the public socket. A new file on disk is insufficient if workers still serve the old one. Add HSTS only after HTTPS works for the intended scope; `includeSubDomains` and preload affect other hosts too.

## Exercise and answer
Does `curl -k` proving a 200 establish valid TLS? No: it disables important certificate checks. Use normal verification. For a local self-signed experiment explicitly trust its certificate with `--cacert`; keep that separate from public production issuance.

## Official references

- [TLS directives](https://nginx.org/en/docs/http/ngx_http_ssl_module.html)
- [HTTP/2 configuration](https://nginx.org/en/docs/http/ngx_http_v2_module.html)
