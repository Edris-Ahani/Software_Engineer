[← Contents and learning path](../README.md) | [فارسی](01_021_upstream_tls_and_mtls_Persian.md)

# 021 — Upstream TLS verification and mutual TLS

## Goal and prerequisites
Verify the internal server and optionally authenticate Nginx as a client. Prerequisites: TLS and reverse proxy. Browser→edge and edge→service are independent TLS connections. A valid public certificate does not verify the internal service.

The commands create a **throwaway Linux/OpenSSL CA**, a server certificate with SAN/serverAuth, and a client certificate with clientAuth. Run in a new private directory. Production PKI needs protected CA keys, controlled issuance, rotation, expiry monitoring and revocation policy. Keep the CA signing key off the edge server.


```bash
mkdir mtls-demo && cd mtls-demo
umask 077
openssl req -x509 -newkey rsa:3072 -nodes -days 30 -sha256 \
  -keyout ca.key -out ca.crt -subj '/CN=Nginx Lab CA' \
  -addext 'basicConstraints=critical,CA:TRUE' \
  -addext 'keyUsage=critical,keyCertSign,cRLSign'

openssl req -new -newkey rsa:2048 -nodes -keyout api.key \
  -out api.csr -subj '/CN=api.internal'
printf '%s\n' 'basicConstraints=critical,CA:FALSE' \
  'keyUsage=critical,digitalSignature,keyEncipherment' \
  'extendedKeyUsage=serverAuth' 'subjectAltName=DNS:api.internal' > server.ext
openssl x509 -req -in api.csr -CA ca.crt -CAkey ca.key \
  -CAcreateserial -days 7 -sha256 -extfile server.ext -out api.crt

openssl req -new -newkey rsa:2048 -nodes -keyout edge.key \
  -out edge.csr -subj '/CN=edge-client'
printf '%s\n' 'basicConstraints=critical,CA:FALSE' \
  'keyUsage=critical,digitalSignature' 'extendedKeyUsage=clientAuth' > client.ext
openssl x509 -req -in edge.csr -CA ca.crt -CAkey ca.key \
  -CAserial ca.srl -days 7 -sha256 -extfile client.ext -out edge.crt
openssl verify -CAfile ca.crt -purpose sslserver -verify_hostname api.internal api.crt
openssl verify -CAfile ca.crt -purpose sslclient edge.crt
```

## Edge configuration
Install only `ca.crt`, `edge.crt` and `edge.key` in `/etc/nginx/internal/` on the edge. This **location inside the edge server** needs DNS for `api.internal`. The verification name, SAN and SNI are intentionally aligned.


```nginx
location /internal-api/ {
    proxy_pass https://api.internal:9443/;
    proxy_ssl_server_name on;
    proxy_ssl_name api.internal;
    proxy_ssl_trusted_certificate /etc/nginx/internal/ca.crt;
    proxy_ssl_verify on;
    proxy_ssl_verify_depth 2;
    proxy_ssl_certificate /etc/nginx/internal/edge.crt;
    proxy_ssl_certificate_key /etc/nginx/internal/edge.key;
    proxy_set_header Host api.internal;
}
```

## Internal service configuration
Install its `api.crt`, `api.key` and the CA public certificate. This **server inside http** returns a static response for the handshake experiment; no separate application is required.


```nginx
server {
    listen 9443 ssl;
    server_name api.internal;
    ssl_certificate /etc/nginx/internal/api.crt;
    ssl_certificate_key /etc/nginx/internal/api.key;
    ssl_client_certificate /etc/nginx/internal/ca.crt;
    ssl_verify_client on;
    ssl_verify_depth 2;
    location / { return 200 "mutual TLS accepted\n"; }
}
```


```bash
# From the private lab directory, with the listener reachable:
# Change 127.0.0.1 if the internal service runs on another host.
curl --cacert ca.crt --resolve api.internal:9443:127.0.0.1 \
  https://api.internal:9443/
curl --cacert ca.crt --cert edge.crt --key edge.key \
  --resolve api.internal:9443:127.0.0.1 https://api.internal:9443/
```

## Verification, caveats, and exercise
Without a client certificate expect rejection; exact TLS/HTTP reporting varies. With a trusted client certificate expect 200. Also test wrong CA, wrong hostname and expiry. Do not make failures disappear by disabling verification.

mTLS verifies certificate possession/trust; application authorization and network restrictions remain necessary. For client→edge mTLS the edge uses `ssl_verify_client`; for edge→service mTLS it presents `proxy_ssl_certificate` and verifies the service independently.

Exercise: upstream TLS only works with `proxy_ssl_verify off`. Inspect CA chain, SAN/name, validity and SNI. Repair trust/identity, not verification. The older [mTLS chapter](../../079_Nginx_mTLS_Private_CA/01_Nginx_mTLS_Private_CA_English.md) is related reading; this example explicitly adds certificate extensions and verification.

## Official references

- [Upstream TLS verification](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_ssl_verify)
- [Client authentication](https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_verify_client)
