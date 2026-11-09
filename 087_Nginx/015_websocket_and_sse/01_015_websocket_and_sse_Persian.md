[← فهرست و مسیر یادگیری](../README.md) | [English](01_015_websocket_and_sse_English.md)

# 015 — WebSocket، SSE و پاسخ جریانی

<div dir="rtl">

## هدف و پیش‌نیاز
اتصال تعاملی را زنده نگه دارید و buffering ناخواستهٔ پاسخ را حذف کنید. پیش‌نیاز: پراکسی، timeout و هدر HTTP. این **قطعهٔ contextِ http** به WebSocket server واقعی روی پورت ۳۰۰۰ نیاز دارد؛ بک‌اند Python آزمایشگاه SSE دارد ولی WebSocket پیاده نمی‌کند.

</div>


```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    "" close;
}

server {
    listen 8088;
    location /ws/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_read_timeout 75s;
    }
    location /events/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 75s;
        gzip off;
    }
}
```

<div dir="rtl">

## تفاوت WebSocket و SSE
WebSocket معمولاً HTTP/1.1 را با پاسخ ۱۰۱ upgrade می‌کند و سپس فریم دوطرفه می‌فرستد. هدرهای Upgrade و Connection از نوع hop-by-hop هستند و باید صریح مدیریت شوند. افزودن این هدرها endpoint معمولی HTTP را به WebSocket server تبدیل نمی‌کند.

SSE همچنان پاسخ HTTP با `Content-Type: text/event-stream` است. رویدادها خط UTF-8 مانند `data: {...}` و یک خط خالی بعد از آن هستند. سرور باید flush کند و پراکسی یا CDN بیرونی هم ممکن است buffer کند. خاموش کردن `proxy_buffering` در یک لایه تمام لایه‌ها را مجبور به streaming نمی‌کند.

`proxy_read_timeout` زمان بی‌فعالیتی بین خواندن از بک‌اند است. heartbeat با فاصلهٔ کوتاه‌تر جلوی قطع بیکار را می‌گیرد؛ این مقدار سقف عمر نشست نیست. کلاینت نیاز به reconnect دارد. اگر برنامه replay داشته باشد SSE می‌تواند از event ID و Last-Event-ID استفاده کند.

</div>


```bash
# Runnable SSE demonstration in the lab; events arrive over time:
curl -N -i http://localhost:8080/events/
# WebSocket requires a real backend and a protocol-aware client:
# Connect a browser WebSocket client to ws://127.0.0.1:8088/ws/
# Inspect 101 Switching Protocols in browser developer tools.
```

<div dir="rtl">

## بررسی و خطاها
در آزمایشگاه سه رویداد با فاصلهٔ زمانی و سپس پایان تمیز می‌بینید. رسیدن کل پاسخ یکجا نشانهٔ buffering یا نبود flush است. برای WebSocket علاوه بر handshake یک پیام واقعی هم بفرستید؛ ۱۰۱ به‌تنهایی رفتار برنامه را نمی‌آزماید.

اتصال طولانی منابع مصرف می‌کند و reload تدریجی را پیچیده می‌کند. تخلیهٔ اتصال و reconnect کلاینت را طراحی کنید. احراز هویت، مجوز و بررسی Origin را در صورت نیاز در برنامه انجام دهید؛ قواعد CORS مربوط به fetch کنترل دسترسی عمومی WebSocket نیستند.

## تمرین و پاسخ
چرا افزایش timeout مشکل رسیدن دسته‌ای رویدادها را حل نمی‌کند؟ چون buffering و flush از انقضای بی‌فعالیتی جدا هستند. قبل از تغییر timeout، flush برنامه و هر پراکسی/CDN را بررسی کنید.

</div>

<div dir="rtl">

## منابع رسمی

- [WebSocket proxying](https://nginx.org/en/docs/http/websocket.html)
- [Response buffering](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffering)

</div>
