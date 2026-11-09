[← فهرست و مسیر یادگیری](../README.md) | [English](01_017_performance_compression_and_capacity_English.md)

# 017 — کارایی، فشرده‌سازی و برنامه‌ریزی ظرفیت

<div dir="rtl">

## هدف و پیش‌نیاز
گلوگاه اندازه‌گیری‌شده را اصلاح کنید، نه اینکه فایل بزرگ آماده کپی کنید. پیش‌نیاز: لاگ، اتصال، کش و بافر. مثال زیر **اسکلت کامل فایل اصلی تنظیمات** برای بستهٔ لینوکس است و به پوشهٔ ایستا و `mime.types` موجود نیاز دارد. عددها آموزشی‌اند و مقدار عمومی مناسب همهٔ محیط‌های تولید نیستند.

</div>


```nginx
worker_processes auto;
events { worker_connections 2048; }
http {
    include /etc/nginx/mime.types;
    sendfile on;
    tcp_nopush on;
    keepalive_timeout 30s;

    gzip on;
    gzip_vary on;
    gzip_comp_level 4;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/javascript application/json;

    server {
        listen 8089;
        root /srv/www/site;
        location / { try_files $uri =404; }
    }
}
```

<div dir="rtl">

## اتصال با کاربر یکی نیست
بودجهٔ تقریبی اتصال worker برابر تعداد worker ضربدر `worker_connections` است، ولی اتصال upstream و دیگر اتصال‌ها هم در آن حساب می‌شوند و سقف file descriptor و محدودیت سرویس/سیستم‌عامل هم اثر دارد. اگر درخواست پراکسی فعال دو socket بگیرد، تعداد کلاینت بسیار کمتر از حاصل‌ضرب ساده خواهد بود. keepalive بیکار هم منابع می‌گیرد. قبل از افزایش عدد، محدودیت سرویس در حال اجرا را بررسی کنید.

فشرده‌سازی در ازای CPU، پهنای باند را کم می‌کند. تصویر، ویدئو و آرشیو فشرده معمولاً سود کمی دارند. Brotli الزاماً در build استاندارد موجود نیست؛ ماژول را بررسی کنید. فشرده‌سازی پاسخ TLS دارای secret و ورودی بازتابی می‌تواند اطلاعات نشت دهد؛ نوع پاسخ قابل‌فشرده‌سازی را آگاهانه انتخاب کنید.

`sendfile` برای فایل ایستا مفید است ولی query کند دیتابیس را اصلاح نمی‌کند. کش، کار برنامه و ایندکس دیتابیس اغلب مهم‌تر از یک پارامتر TCP هستند.

</div>


```bash
# Inspect headers without losing Content-Encoding information:
curl -s -D - -o /dev/null -H 'Accept-Encoding: gzip' \
  http://127.0.0.1:8089/assets/large.js
# Inspect the service's actual open-file limit:
systemctl show nginx -p LimitNOFILE
# Use your load generator against a disposable environment, not a live service.
```

<div dir="rtl">

## آزمایش مفید
با ترکیب route و اندازهٔ payload شبیه واقعیت شروع کنید. نرخ، تأخیر p50/p95/p99، خطا، CPU، RSS، فایل باز، شبکه، I/O دیسک و اشباع بک‌اند را ثبت کنید. بار را تدریجی بالا ببرید، سپس یک پارامتر را عوض و همان بار را مقایسه کنید. benchmark کوچک محلی ممکن است ظرفیت مولد بار را اندازه بگیرد نه سرور را.

برای بررسی فشرده‌سازی فقط در پاسخ مجاز و به‌اندازهٔ کافی بزرگ انتظار `Content-Encoding: gzip` داشته باشید؛ فایل کوچک شاید فشرده نشود. هدر `Vary: Accept-Encoding` تفاوت نسخه‌های encoding را به کش پایین‌دست اعلام می‌کند.

## تمرین و پاسخ
تعداد اتصال worker را دوبرابر کرده‌اید ولی ۵۰۴ باقی است و تأخیر دیتابیس بالا می‌رود؛ قدم بعد چیست؟ تنظیمات محدود و کنترل‌شده را برگردانید، اشباع بک‌اند را پیدا کنید و کار پرهزینه را کم یا ظرفیت مناسب اضافه کنید. هم‌زمانی بیشتر پراکسی ممکن است اضافه‌بار را تشدید کند.

</div>

<div dir="rtl">

## منابع رسمی

- [Gzip module](https://nginx.org/en/docs/http/ngx_http_gzip_module.html)
- [Core process directives](https://nginx.org/en/docs/ngx_core_module.html)

</div>
