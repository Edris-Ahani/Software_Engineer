[← فهرست و مسیر یادگیری](../README.md) | [English](01_012_rate_and_connection_limiting_English.md)

# 012 — محدودیت نرخ، burst و محدودیت اتصال

<div dir="rtl">

## هدف
از endpoint پرهزینه محافظت کنید و تفاوت نرخ درخواست و هم‌زمانی را بفهمید. پیش‌نیاز: IP قابل‌اعتماد کلاینت و لاگ. تعریف zoneها در **http** و اعمال سیاست در server/location است. فرض مثال این است که `$remote_addr` از قبل آدرس درست کلاینت است.

</div>


```nginx
limit_req_zone $binary_remote_addr zone=login_rate:10m rate=5r/s;
limit_conn_zone $binary_remote_addr zone=active_clients:10m;

server {
    listen 8086;
    limit_req_status 429;
    limit_conn_status 429;

    location /login {
        limit_req zone=login_rate burst=10 nodelay;
        limit_conn active_clients 10;
        proxy_pass http://127.0.0.1:3000;
    }
}
```

<div dir="rtl">

## معنای مقادیر
`rate=5r/s` نرخ پایدار هر کلید است. Nginx از روش leaky bucket استفاده می‌کند. مقدار `burst=10` درخواست اضافه را در ظرفیت burst تحمل می‌کند و `nodelay` اجازه می‌دهد اضافه‌های پذیرفته‌شده فوراً عبور کنند ولی سهمیه‌شان به مرور تخلیه شود. این تنظیم به معنی fixed window با «۱۵ درخواست آزاد در هر ثانیه» نیست. بدون `nodelay` اضافه‌های قابل‌پذیرش ممکن است منتظر بمانند و بیشتر از ظرفیت رد می‌شوند.

`limit_conn` تعداد اتصال/درخواست هم‌زمان را طبق قواعد مستند خودش محدود می‌کند. صرفاً همهٔ socketهای keepalive بیکار را نمی‌شمارد و درخواست‌های هم‌زمان HTTP/2 یا HTTP/3 روی حسابداری آن اثر دارند. این سیاست با نرخ درخواست فرق دارد. zone میان workerهای یک نمونه مشترک است ولی به‌صورت خودکار سهمیهٔ توزیع‌شده میان replicaها نمی‌سازد.

</div>


```bash
# Lab implements a separate 2r/s demo at /limited/.
# This Python command is portable across Linux and Windows:
python _lab/smoke_test.py
# Linux burst probe (status distribution depends on timing):
seq 1 20 | xargs -P 10 -I '{}' \
  curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080/limited/
```

<div dir="rtl">

## اعمال تدریجی و عدالت
NAT بزرگ یا gateway شرکت ممکن است افراد زیادی را پشت یک IP بگذارد. پشت پراکسی مورداعتماد، استخراج امن IP واقعی پیش‌نیاز محدودیت IP است. سهمیهٔ هر کاربر به هویت تأییدشده نیاز دارد، نه یک هدر دلخواه فرستاده‌شده توسط کلاینت. کنترل سوءاستفادهٔ حساب و شکست احراز هویت در برنامه هم لازم است.

می‌توانید ابتدا با `limit_req_dry_run on` ترافیک واقعی را مشاهده و سپس سیاست را اعمال کنید. متریک رد شدن و سیاست تلاش مجدد مناسب ارائه دهید. اگر محاسبهٔ دقیق ندارید مدت مشخص Retry-After را به‌عنوان زمان قطعی اعلام نکنید.

## تمرین و پاسخ
چرا بعد از افزودن پراکسی ممکن است همه ۴۲۹ بگیرند؟ شاید کلید همهٔ کاربران IP خود پراکسی شده یا burst عادی از سیاست جدید بیشتر است. قبل از بالا بردن عدد، هویت مؤثر و اندازه‌گیری‌ها را بررسی کنید.

</div>

<div dir="rtl">

## منابع رسمی

- [Request rate limiting](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html)
- [Connection limiting](https://nginx.org/en/docs/http/ngx_http_limit_conn_module.html)

</div>
