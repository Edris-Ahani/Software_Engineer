[← فهرست و مسیر یادگیری](../README.md) | [English](01_006_reverse_proxy_and_proxy_pass_English.md)

# 006 — پراکسی معکوس و اسلش پایانی proxy_pass

<div dir="rtl">

## هدف و آماده‌سازی
مسیر دقیقی را که برنامه دریافت می‌کند پیش‌بینی کنید. پیش‌نیاز: HTTP و location. دو location زیر **دو حالت جایگزین** هستند و نباید هم‌زمان فعال شوند. در آزمایشگاه Docker بک‌اند `app1:8000` است؛ روی هاست لینوکسی ممکن است `127.0.0.1:3000` باشد. آدرس loopback داخل کانتینر به همان کانتینر اشاره می‌کند.

</div>


```nginx
# Alternative A: preserve the /api/ prefix (inside server)
location /api/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Alternative B: remove the /api/ prefix (inside server)
# location /api/ {
#     proxy_pass http://127.0.0.1:3000/;
#     proxy_http_version 1.1;
#     proxy_set_header Host $host;
#     proxy_set_header X-Forwarded-Proto $scheme;
# }
```

<div dir="rtl">

## ردگیری یک درخواست
برای `/api/orders?status=open`، حالت A مسیر `/api/orders?status=open` و حالت B مسیر `/orders?status=open` را می‌فرستد. بدون بخش URI، دستور `proxy_pass` مسیر درخواست را با درنظرگرفتن قواعد مستند نرمال‌سازی و rewrite ارسال می‌کند. با URI برابر `/`، این بخش جای prefix تطبیق‌یافته را می‌گیرد. این توضیح برای location پیشوندی ساده، بدون rewrite و آدرس literal بک‌اند است. location مبتنی بر regex، متغیر داخل `proxy_pass` و URI بازنویسی‌شده قواعد بیشتری دارند.

با `proxy_http_version 1.1` نسخهٔ پروتکل اتصال بک‌اند را صریح می‌کنید. اتصال مرورگر می‌تواند HTTP/2 و اتصال برنامه HTTP/1.1 باشد. دستور `proxy_set_header Host $host` رفتار پیش‌فرض Host سمت بک‌اند را تغییر می‌دهد؛ مقدار مناسب برنامه را انتخاب کنید. استفادهٔ مجدد از اتصال و اعتماد به هدرها در بخش‌های بعدی بررسی می‌شوند.

</div>


```bash
# With the repository lab running:
curl -s 'http://localhost:8080/api/orders?status=open'
curl -s 'http://localhost:8080/preserve/orders?status=open'
# Inspect path and headers in the JSON, not just the HTTP status.
```

<div dir="rtl">

## نتیجهٔ مورد انتظار
آزمایشگاه `/api/` را حذف می‌کند؛ پس مقدار path در JSON برابر `/orders?status=open` است. locationِ `/preserve/` مقدار `/preserve/orders?status=open` را نگه می‌دارد. تنها مشاهدهٔ ۲۰۰ حذف اشتباهی پیشوند نسخهٔ API را آشکار نمی‌کند.

## خطاهای رایج
۵۰۲ ممکن است از رد شدن اتصال، خطای DNS یا پاسخ نامعتبر بک‌اند باشد؛ error log را بخوانید. ۴۰۴ برنامه ممکن است فقط از مسیر ارسال‌شدهٔ اشتباه باشد. وقتی برنامه را زیر یک prefix می‌برید redirectها و مسیر cookie را بررسی کنید؛ برنامه باید آدرس عمومی خودش را بشناسد. `proxy_redirect` بعضی هدرهای پاسخ را اصلاح می‌کند و بازنویسی عمومی HTML یا JavaScript نیست.

## تمرین و پاسخ
بک‌اند مسیر `/v1/users` دارد ولی URL عمومی `/api/v1/users` است. برای حذف `/api/` از اسلش پایانی استفاده کنید. اگر برنامه خود `/api/v1/users` را می‌شناسد، URI پایانی را حذف کنید. نتیجه را با access log برنامه تطبیق دهید.

</div>

<div dir="rtl">

## منابع رسمی

- [proxy_pass semantics](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass)

</div>
