[← فهرست و مسیر یادگیری](../README.md) | [English](01_016_uploads_buffers_and_timeouts_English.md)

# 016 — آپلود، بافر، timeout و بودجهٔ درخواست

<div dir="rtl">

## هدف
محدودیت را با نوع بار هماهنگ کنید و ۴۱۳، ۵۰۲ و ۵۰۴ را بدون پنهان کردن کندی برنامه تحلیل کنید. پیش‌نیاز: پراکسی و لاگ. این **location داخل server** قرار می‌گیرد. برنامهٔ واقعی پذیرندهٔ آپلود روی پورت ۳۰۰۰ لازم دارد؛ برای نمونهٔ اجرایی کوچک از `/api/upload` آزمایشگاه استفاده کنید.

</div>


```nginx
location /upload/ {
    client_max_body_size 20m;
    client_body_timeout 15s;
    proxy_connect_timeout 3s;
    proxy_send_timeout 30s;
    proxy_read_timeout 30s;
    send_timeout 30s;

    proxy_request_buffering on;
    proxy_buffering on;
    proxy_pass http://127.0.0.1:3000;
}
```

<div dir="rtl">

## کنترل‌های متفاوت برای جهت‌های متفاوت

| تنظیم | معنی |
| --- | --- |
| `client_max_body_size` | سقف اندازهٔ بدنهٔ درخواست |
| `client_body_timeout` | فاصلهٔ بی‌فعالیتی در خواندن بدنه از کلاینت |
| `proxy_connect_timeout` | زمان مجاز برقراری اتصال بک‌اند |
| `proxy_send_timeout` | فاصلهٔ بی‌فعالیتی بین نوشتن درخواست به بک‌اند |
| `proxy_read_timeout` | فاصلهٔ بی‌فعالیتی بین خواندن پاسخ از بک‌اند |
| `send_timeout` | فاصلهٔ بی‌فعالیتی هنگام ارسال پاسخ به کلاینت |

این timeoutها یک deadline سرتاسری مشترک نیستند. برنامه‌ای که قطره‌قطره داده می‌دهد می‌تواند بسیار طولانی‌تر از read timeout فعال بماند. برای کارهایی مثل دیتابیس، deadline برنامه تعریف کنید و با بودجهٔ retry کلاینت و پراکسی هماهنگ کنید.

</div>

<div dir="rtl">

## بافر درخواست و پاسخ مستقل‌اند
با request buffering روشن، Nginx ابتدا بدنه را می‌گیرد و ممکن است روی فایل موقت دیسک بنویسد. برنامه از آپلود کند جدا می‌شود ولی فضا و I/O محلی مصرف می‌شود. با خاموش بودن، streaming انتظار اولیه را کم می‌کند اما منابع بک‌اند را به کلاینت وابسته می‌کند و بعد از ارسال بایت‌ها امکان retry امن محدود می‌شود.

response buffering بک‌اند سریع را از کلاینت کند جدا می‌کند و ممکن است از حافظه و فایل موقت استفاده کند. آن را در مسیر streaming لازم خاموش کنید، نه سراسری. بزرگ بودن هدر پاسخ upstream مستقل از اندازهٔ بدنه می‌تواند خطا بدهد؛ قبل از تغییر `proxy_buffer_size` و بافرهای مرتبط، error log را بخوانید.

</div>


```bash
# Small upload against the lab (1 MiB limit):
python -c "import urllib.request; r=urllib.request.urlopen(urllib.request.Request('http://localhost:8080/api/upload',data=b'hello',method='POST')); print(r.status,r.read().decode())"
# Oversize request: the smoke test checks that this produces 413.
python _lab/smoke_test.py
```

<div dir="rtl">

## بررسی و تمرین
بدنهٔ کوچک معتبر، بدنهٔ کمی بیش از حد، کلاینت کند و بک‌اند کند را جداگانه امتحان کنید. محدودیت CDN یا load balancer بیرونی و parser برنامه را هم بررسی کنید. سخت‌گیرانه‌ترین لایه ممکن است زودتر رد کند.

تمرین: آپلود ۱۰۰ مگابایت با وجود سقف ۲۰۰ مگابایت برنامه هنوز ۴۱۳ می‌دهد. پاسخ: محدودیت مؤثر location در Nginx و همهٔ لایه‌های قبل را بررسی کنید. افزایش `proxy_read_timeout` رد شدن اندازهٔ بدنه را تغییر نمی‌دهد. برای فایل بسیار بزرگ، آپلود مستقیم به object storage با مجوز محدود و کوتاه‌عمر را بررسی کنید.

</div>

<div dir="rtl">

## منابع رسمی

- [Body size and client timeouts](https://nginx.org/en/docs/http/ngx_http_core_module.html)
- [Proxy buffering and timeouts](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)

</div>
