[← فهرست و مسیر یادگیری](../README.md) | [English](01_021_upstream_tls_and_mtls_English.md)

# 021 — بررسی TLS بک‌اند و TLS دوطرفه

<div dir="rtl">

## هدف و پیش‌نیاز
هویت سرور داخلی را بررسی کنید و در صورت نیاز Nginx را به‌عنوان کلاینت بشناسانید. پیش‌نیاز: TLS و پراکسی. مرورگر به edge و edge به سرویس دو اتصال مستقل‌اند؛ گواهینامهٔ عمومی معتبر، سرویس داخلی را تأیید نمی‌کند.

دستورها **CA موقت آموزشی روی Linux/OpenSSL**، گواهینامهٔ سرور با SAN و serverAuth و کلاینت با clientAuth می‌سازند. در پوشهٔ خصوصی جدید اجرا کنید. PKI تولید به حفاظت کلید CA، صدور کنترل‌شده، گردش، پایش انقضا و سیاست ابطال نیاز دارد. کلید امضاکنندهٔ CA را روی edge نگه ندارید.

</div>


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

<div dir="rtl">

## تنظیم لبه
روی edge فقط `ca.crt`، `edge.crt` و `edge.key` را در `/etc/nginx/internal/` نصب کنید. این **location داخل server لبه** به DNS برای `api.internal` نیاز دارد. نام بررسی، SAN و SNI عمداً یکسان‌اند.

</div>


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

<div dir="rtl">

## تنظیم سرویس داخلی
روی سرویس، `api.crt`، `api.key` و گواهینامهٔ عمومی CA را نصب کنید. این **server داخل http** برای آزمایش متن ثابت می‌دهد و برنامهٔ جدا لازم ندارد.

</div>


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

<div dir="rtl">

## بررسی، محدودیت و تمرین
بدون گواهینامهٔ کلاینت انتظار رد شدن دارید؛ شکل دقیق خطای TLS/HTTP متفاوت است. با کلاینت مورداعتماد انتظار ۲۰۰ دارید. CA اشتباه، hostname نادرست و انقضا را هم بیازمایید. با خاموش کردن verify خطا را پنهان نکنید.

mTLS داشتن کلید و trust را بررسی می‌کند؛ مجوز برنامه و محدودیت شبکه همچنان لازم‌اند. برای کلاینت به edge از `ssl_verify_client` و برای edge به سرویس از ارائهٔ `proxy_ssl_certificate` و بررسی مستقل سرویس استفاده می‌شود.

تمرین: TLS بک‌اند فقط با `proxy_ssl_verify off` کار می‌کند. chain، SAN/نام، اعتبار زمانی و SNI را بررسی کنید. trust/هویت را اصلاح کنید، نه verify را. [فصل قبلی mTLS](../../079_Nginx_mTLS_Private_CA/01_Nginx_mTLS_Private_CA_Persian.md) مطالعهٔ مرتبط است؛ این نمونه extension و اعتبارسنجی صریح نیز دارد.

</div>

<div dir="rtl">

## منابع رسمی

- [Upstream TLS verification](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_ssl_verify)
- [Client authentication](https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_verify_client)

</div>
