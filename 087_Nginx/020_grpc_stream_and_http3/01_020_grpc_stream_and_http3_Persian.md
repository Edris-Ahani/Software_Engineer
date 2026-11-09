[← فهرست و مسیر یادگیری](../README.md) | [English](01_020_grpc_stream_and_http3_English.md)

# 020 — gRPC، جریان TCP/UDP، HTTP/2 و HTTP/3

<div dir="rtl">

## هدف و پیش‌نیاز
ماژول پروتکل درست و محل پایان TLS را بشناسید. پیش‌نیاز: پراکسی HTTP، TLS و بررسی build. این‌ها **قطعه‌های مفهومی مستقل** هستند و یک تنظیمات اجرایی مشترک نیستند. قبل از بررسی، ماژول، گواهینامه و بک‌اند واقعی لازم است.

| ترافیک | قابلیت | سطح فهم Nginx |
| --- | --- | --- |
| API مبتنی بر HTTP | `http` و `proxy_pass` | مسیر، هدر و status |
| gRPC | `http` و `grpc_pass` | انتقال gRPC بر HTTP/2 |
| TCP/UDP عمومی | `stream` و `proxy_pass` | نشست انتقال، نه routeِ HTTP |
| HTTP/3 مرورگر | ماژول HTTP/3 و QUIC | HTTP روی QUIC/UDP |

هم‌نام بودن دستور در HTTP و stream به معنی context یا رفتار یکسان نیست.

</div>


```nginx
# Inside http; requires HTTP/2, gRPC modules and certificate files.
server {
    listen 9443 ssl;
    http2 on;
    server_name grpc.example.com;
    ssl_certificate /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;
    location / {
        grpc_pass grpc://127.0.0.1:50051;
        grpc_read_timeout 60s;
    }
}
```

<div dir="rtl">

## بررسی gRPC
برای بک‌اند بدون TLS از `grpc://` و برای TLS از `grpcs://` استفاده کنید. برای TLS بک‌اند، trust و بررسی hostname را با دستورهای SSL مربوط به gRPC صریح تنظیم کنید؛ scheme به‌تنهایی کافی نیست. GET با curl آزمایش کامل gRPC نیست. کلاینت مخصوص همراه تعریف سرویس یا reflection فعال‌شده لازم است. خطای برنامه ممکن است با trailerِ `grpc-status` حتی همراه HTTP ۲۰۰ اعلام شود.

</div>


```nginx
# Main-level sibling of http, not nested inside it.
# Your package may require loading a stream module first.
stream {
    upstream database_pool { server 10.40.0.10:5432; }
    server {
        listen 127.0.0.1:15432;
        proxy_pass database_pool;
        proxy_connect_timeout 3s;
        proxy_timeout 60s;
    }
}
```

<div dir="rtl">

## stream و HTTP/3
stream نمی‌تواند location یا هدر HTTP را روی PostgreSQL اعمال کند. در TLS passthrough خود بک‌اند handshake و گواهینامه را مدیریت می‌کند. ماژول را مطابق بسته load کنید؛ مسیر عمومی برای `.so` وجود ندارد.

برای HTTP/3، listenerِ UDP با QUIC و اعلام Alt-Svc لازم است و HTTPS روی TCP برای fallback باقی می‌ماند. **قطعهٔ داخل server** بعدی build سازگار QUIC/TLS و گواهینامهٔ تعریف‌شده یا ارث‌رسیده لازم دارد. قبل از تولید وضعیت پشتیبانی جاری ماژول HTTP/3 را بررسی کنید. دستور `http2 on` از نسخهٔ 1.25.1 موجود است.

</div>


```nginx
# Inside an already configured HTTPS server:
listen 443 quic reuseport;
# Keep the existing TCP listener: listen 443 ssl;
http2 on;
add_header Alt-Svc 'h3=":443"; ma=3600' always;
```

<div dir="rtl">

## تمرین و پاسخ
HTTP/2 درست است ولی HTTP/3 timeout می‌دهد: انتشار و فایروال UDP 443، buildِ QUIC، هدر Alt-Svc و پشتیبانی کلاینت را ببینید. تست TCP چیزی دربارهٔ UDP ثابت نمی‌کند. آزمایشگاه HTTP/1.1 و SSE را آموزش می‌دهد و ادعای بررسی این پروتکل‌های اختیاری ندارد.

</div>

<div dir="rtl">

## منابع رسمی

- [gRPC module](https://nginx.org/en/docs/http/ngx_http_grpc_module.html)
- [Stream module](https://nginx.org/en/docs/stream/ngx_stream_core_module.html)
- [HTTP/3 support status](https://nginx.org/en/docs/http/ngx_http_v3_module.html)

</div>
