[← فهرست و مسیر یادگیری](../README.md) | [English](01_003_configuration_contexts_English.md)

# 003 — ساختار تنظیمات، context و include

<div dir="rtl">

## هدف یادگیری
بدانید هر دستور دقیقاً در کدام context معتبر است. پیش‌نیاز: بخش ۰۰۲. مثال زیر **فایل کامل و مستقل nginx.conf** برای بستهٔ لینوکس یا کانتینر رسمی با فایل `/etc/nginx/mime.types` است. جایگزین فایل اصلی می‌شود؛ آن را داخل `conf.d/` قرار ندهید.

</div>


```nginx
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    sendfile on;

    server {
        listen 8080;
        server_name localhost;
        location = /healthz {
            default_type text/plain;
            return 200 "ok\n";
        }
        location / {
            return 404;
        }
    }
}
```

<div dir="rtl">

## خواندن از بیرون به داخل

| context | محتوای آن | مثال |
| --- | --- | --- |
| سطح اصلی | تنظیمات پردازش و بلوک‌های اصلی | `worker_processes`، `events`، `http` |
| `events` | تنظیمات پردازش اتصال | `worker_connections` |
| `http` | تعریف‌های عمومی HTTP و سرورها | `map`، `upstream`، `log_format`، `server` |
| `server` | یک سرور مجازی HTTP | `listen`، `server_name`، `location` |
| `location` | رفتار یک مسیر درخواست | `proxy_pass`، `try_files` |

دستور ساده با `;` تمام می‌شود و بلوک با آکولاد ساخته می‌شود. `#` آغاز توضیح است. `include` در همان نقطهٔ درج عمل می‌کند؛ پس فایل includeشده داخل `http` از قبل در همین context است. فایل معمول `conf.d/demo.conf` یک بلوک `server` دارد و نباید دوباره `http` داشته باشد.

</div>

<div dir="rtl">

## ارث‌بری برای هر دستور متفاوت است
فرض نکنید هر بلوک فرزند تنظیمات را به والد اضافه می‌کند. مثلاً در رفتار سنتی ارث‌بری هدر، تعریف حتی یک `add_header` در location مجموعهٔ `add_header`های ارث‌رسیده را در همان بخش جایگزین می‌کند. مجموعهٔ `proxy_set_header` هم قاعدهٔ مشابهی برای ارث‌بری خودش دارد. مستند همان دستور و نسخهٔ نصب‌شده را بررسی کنید. snippet مشترک و صریح معمولاً از ارث‌بری تصادفی قابل‌بررسی‌تر است.

</div>


```bash
sudo nginx -t
sudo nginx -T
# Reload only after the syntax check succeeds.
curl -i http://127.0.0.1:8080/healthz
curl -i http://127.0.0.1:8080/missing
```

<div dir="rtl">

## نتیجهٔ مورد انتظار و خطاهای رایج
برای `/healthz` پاسخ ۲۰۰ با متن `ok` و برای `/missing` پاسخ ۴۰۴ می‌گیرید. برخورد پورت یعنی باید listener موجود را پیدا کنید؛ restart تصادفی راه‌حل نیست. فایل `demo.conf.disabled` توسط include با الگوی `*.conf` خوانده نمی‌شود.

## تمرین و پاسخ
در یک نسخهٔ آزمایشی، `worker_connections` را به `http` منتقل کنید. `nginx -t` باید اعلام کند دستور در این context مجاز نیست. آن را به `events` برگردانید. چرا ممکن است `-t` موفق شود ولی فایل جدید هیچ اثری نداشته باشد؟ چون فقط تنظیماتی که واقعاً بارگذاری شده‌اند بررسی می‌شوند.

</div>

<div dir="rtl">

## منابع رسمی

- [Configuration structure](https://nginx.org/en/docs/beginners_guide.html)
- [Header inheritance](https://nginx.org/en/docs/http/ngx_http_headers_module.html)
- [Proxy directives](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)

</div>
