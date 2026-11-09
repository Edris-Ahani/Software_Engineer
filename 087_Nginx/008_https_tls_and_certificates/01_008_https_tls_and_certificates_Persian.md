[← فهرست و مسیر یادگیری](../README.md) | [English](01_008_https_tls_and_certificates_English.md)

# 008 — HTTPS، گواهینامه، SNI و تمدید

<div dir="rtl">

## هدف و پیش‌نیاز
تفاوت رمزنگاری و بررسی هویت را بفهمید و تمدید گواهینامه را مدیریت کنید. پیش‌نیاز: DNS، پراکسی و برای TLS عمومی مالکیت دامنه. این **قطعهٔ contextِ http** نیازمند فایل‌های گواهینامهٔ موجود است؛ قبل از ساخت آن‌ها `nginx -t` موفق نمی‌شود. از نسخهٔ پشتیبانی‌شده با HTTP/2 استفاده کنید؛ دستور `http2 on` از نسخهٔ 1.25.1 اضافه شده است.

</div>


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

<div dir="rtl">

## معنای امنیتی تنظیمات
full chain شامل گواهینامهٔ نهایی و سپس intermediateهای لازم است. کلید خصوصی محرمانه می‌ماند و با خود گواهینامه یکی نیست. کلاینت زنجیرهٔ اعتماد، بازهٔ اعتبار و نام دامنه در Subject Alternative Name یا SAN را بررسی می‌کند. SNI نام میزبان را در زمان TLS و پیش از وجود هدر HTTP Host اعلام می‌کند.

نام ثابت در redirect مانع ساخت مقصد از Host دلخواه ورودی می‌شود. HTTP/2 چند stream را روی اتصال حمل می‌کند و به‌صورت خودکار اتصال برنامه را HTTP/2 نمی‌کند. بعضی بسته‌های قدیمی از `listen 443 ssl http2` استفاده می‌کنند؛ نحو سازگار با نسخه را انتخاب کنید و نسخهٔ تحت پشتیبانی نگه دارید.

</div>


```bash
# Replace app.example.com and 203.0.113.10 with your domain and server IP.
curl -Iv --resolve app.example.com:443:203.0.113.10 https://app.example.com/
openssl s_client -connect app.example.com:443 -servername app.example.com \
  -verify_hostname app.example.com -verify_return_error </dev/null
openssl x509 -in /etc/nginx/certs/fullchain.pem -noout -dates -ext subjectAltName
```

<div dir="rtl">

## صدور، تمدید و بررسی
یک کلاینت ACME و challenge سازگار با زیرساخت انتخاب کنید. روش HTTP-01 نیازمند دسترسی به URL چالش روی پورت ۸۰ است؛ DNS-01 نیازمند کنترل به‌روزرسانی DNS است و صدور wildcard را هم پشتیبانی می‌کند. اگر کلاینت از webroot استفاده می‌کند باید سرور پورت ۸۰ بالا برای challenge اصلاح شود؛ افزونهٔ نصب‌کننده ممکن است این کار را خودش انجام دهد. قبل از اتمام اعتبارسنجی، صدور را موفق فرض نکنید.

تمدید را خودکار کنید، جریان آزمایشی تمدید را بررسی کنید، پس از جایگزینی موفق فایل‌ها Nginx را reload کنید و گواهینامهٔ واقعاً ارائه‌شده در پورت عمومی را پایش کنید. وجود فایل جدید روی دیسک کافی نیست؛ شاید worker هنوز فایل قبلی را ارائه دهد. HSTS را پس از اطمینان از HTTPS در محدودهٔ مدنظر اضافه کنید؛ `includeSubDomains` و preload روی میزبان‌های دیگر هم اثر می‌گذارند.

## تمرین و پاسخ
آیا پاسخ ۲۰۰ با `curl -k` اعتبار TLS را ثابت می‌کند؟ خیر؛ بخشی از بررسی گواهینامه غیرفعال شده است. از اعتبارسنجی عادی استفاده کنید. در آزمایش محلی self-signed، گواهینامه را صریحاً با `--cacert` مورداعتماد قرار دهید و آن را با صدور عمومی تولید اشتباه نگیرید.

</div>

<div dir="rtl">

## منابع رسمی

- [TLS directives](https://nginx.org/en/docs/http/ngx_http_ssl_module.html)
- [HTTP/2 configuration](https://nginx.org/en/docs/http/ngx_http_v2_module.html)

</div>
