[← فهرست و مسیر یادگیری](../README.md) | [English](01_009_logs_monitoring_and_troubleshooting_English.md)

# 009 — لاگ، زمان‌بندی، پایش و عیب‌یابی

<div dir="rtl">

## هدف
با شواهد لایهٔ معیوب را پیدا کنید. پیش‌نیاز: پراکسی و کدهای HTTP. دستور `log_format` را در **http** تعریف کنید و سپس در سرور استفاده کنید. کوتیشن دور مقادیر عددی باعث می‌شود مقدار غایب مثل `-` هم رشتهٔ JSON معتبر باقی بماند.

</div>


```nginx
log_format timing escape=json
    '{"time":"$time_iso8601","id":"$request_id",'
    '"client":"$remote_addr","method":"$request_method",'
    '"uri":"$uri","status":"$status",'
    '"request_time":"$request_time",'
    '"upstream":"$upstream_addr","upstream_status":"$upstream_status",'
    '"upstream_time":"$upstream_response_time"}';

server {
    listen 8083;
    access_log /var/log/nginx/timing.log timing;
    error_log /var/log/nginx/error.log warn;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header X-Request-ID $request_id;
        add_header X-Request-ID $request_id always;
    }
}
```

<div dir="rtl">

## تفسیر فیلدها
`request_time` کل زمان درخواست از دید Nginx، شامل دریافت و ارسال داده را پوشش می‌دهد. `upstream_response_time` زمان تعامل بک‌اند است و در صورت چند تلاش می‌تواند چند مقدار داشته باشد. اختلاف زیاد ممکن است از سرعت کلاینت یا buffering باشد؛ این اختلاف اندازه‌گیری دقیق CPU نیست. خالی بودن آدرس upstream برای پاسخ ایستا طبیعی است.

برای ثبت نکردن query string که گاهی توکن دارد از `$uri` استفاده شده است. خود مسیر هم ممکن است شناسهٔ حساس داشته باشد؛ زمان نگهداری و سطح دسترسی لاگ را تعیین کنید. به‌طور پیش‌فرض Authorization، cookie نشست و بدنهٔ درخواست را ثبت نکنید. request ID ساخته‌شده، در صورت ثبت در برنامه، لاگ دو لایه را به هم وصل می‌کند.

</div>


```bash
# Linux service:
sudo tail -f /var/log/nginx/error.log /var/log/nginx/timing.log
# Docker lab, from 087_Nginx:
docker compose -f _lab/compose.yaml logs --tail=50 nginx
curl -i http://localhost:8080/api/hello
```

<div dir="rtl">

## جدول عیب‌یابی

| نشانه | اولین بررسی مفید |
| --- | --- |
| ۴۰۴ | کدام server/location پاسخ داد؟ فایل یا route وجود دارد؟ |
| ۴۰۳ | مجوز عبور/خواندن فایل، ACL، احراز هویت یا نبود index |
| ۴۱۳ | مقدار مؤثر `client_max_body_size` و محدودیت پراکسی بیرونی |
| ۴۲۹ | کلید محدودیت، الگوی درخواست و IP مشترک پراکسی |
| ۴۹۹ در لاگ | کلاینت اتصال را بسته؛ زمان کلاینت و بک‌اند را مقایسه کنید |
| ۵۰۲ | error log، پردازش و پورت بک‌اند، DNS یا ناسازگاری پروتکل |
| ۵۰۴ | timeout بک‌اند؛ کندی برنامه و وابستگی را پیدا کنید |

هر گام را جدا بررسی کنید: DNS، پورت، TLS، انتخاب میزبان، route و اتصال مستقیم به بک‌اند از شبکهٔ Nginx. هشدار را بر نسبت خطا و صدک تأخیر همراه حجم ترافیک تنظیم کنید، نه یک خطای منفرد. ظرفیت دیسک و گردش لاگ را بررسی کنید؛ لاگ بزرگ می‌تواند فایل‌سیستم را پر کند.

## تمرین و پاسخ
یکی از بک‌اندهای آزمایشگاه را متوقف و `/api/hello` را صدا بزنید. failover موفق ممکن است خرابی آن نمونه را در کد نهایی پنهان کند؛ تلاش‌های upstream را در لاگ ببینید و نمونه را برگردانید. اگر recreate باعث IP جدید شد، راهنمای DNS و reload در بخش ۰۱۹ را اجرا کنید.

</div>

<div dir="rtl">

## منابع رسمی

- [HTTP log format](https://nginx.org/en/docs/http/ngx_http_log_module.html)
- [Core variables](https://nginx.org/en/docs/http/ngx_http_core_module.html#variables)

</div>
