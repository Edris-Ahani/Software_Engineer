[← فهرست و مسیر یادگیری](../README.md) | [English](01_011_proxy_cache_and_browser_cache_English.md)

# 011 — کش پراکسی، کلید کش و کش مرورگر

<div dir="rtl">

## هدف و پیش‌نیاز
پاسخ عمومی را بدون نشت دادهٔ شخصی کش کنید. پیش‌نیاز: پراکسی، هدرها و مفاهیم کش HTTP. این **قطعهٔ داخل http** مخصوص یک کاتالوگ عمومی است و سیاست کش عمومی تمام APIها نیست. worker باید در پوشهٔ کش مجوز نوشتن داشته باشد.

</div>


```nginx
proxy_cache_path /var/cache/nginx/catalog levels=1:2
    keys_zone=catalog:10m max_size=100m inactive=10m;

map $http_authorization $has_auth { default 1; "" 0; }
map $http_cookie $has_cookie { default 1; "" 0; }

server {
    listen 8085;
    location /catalog/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache catalog;
        proxy_cache_key "$scheme|$host|$proxy_host|$request_uri";
        proxy_cache_valid 200 30s;
        proxy_cache_lock on;
        proxy_cache_bypass $has_auth $has_cookie;
        proxy_no_cache $has_auth $has_cookie;
        add_header X-Cache-Status $upstream_cache_status always;
    }
}
```

<div dir="rtl">

## خواندن دقیق سیاست
zone متادیتا را نگه می‌دارد و بدنهٔ کش روی دیسک است. `inactive` داده‌ای را که در آن مدت استفاده نشده حذف می‌کند، حتی اگر هنوز fresh باشد. کلید شامل host و query string است تا tenant یا پارامترهای متفاوت تصادفاً یک پاسخ مشترک نگیرند. کلید بخشی از طراحی جداسازی دادهٔ برنامه است.

`proxy_cache_bypass` خواندن پاسخ ذخیره‌شده را کنار می‌گذارد و `proxy_no_cache` مانع ذخیرهٔ پاسخ جدید می‌شود. برای درخواست دارای هویت یا cookie هر دو مهم‌اند. مثال محافظه‌کارانهٔ ما هر cookie را مستثنا می‌کند و ممکن است نرخ hit را کم کند. رفتار معمول هدرهای `Cache-Control`، `Expires`، `Set-Cookie` و `Vary` هم مؤثر است. بدون بررسی این هدرها را نادیده نگیرید و endpointی که هویت را از راه دیگری می‌گیرد کش نکنید.

`proxy_cache_lock` کار هم‌زمان تکراری برای پر کردن یک کلید را کم می‌کند. ارائهٔ دادهٔ stale می‌تواند دسترس‌پذیری را بهتر کند ولی کهنگی مجاز باید تصمیم کسب‌وکار باشد. قابلیت purge متفاوت است؛ کلید نسخه‌دار یا TTL محدود گاهی ساده‌تر است.

</div>


```bash
# Lab has the same behavior at /cache/:
curl -i 'http://localhost:8080/cache/products?case=lesson11'
curl -i 'http://localhost:8080/cache/products?case=lesson11'
curl -i -H 'Authorization: Bearer demo' \
  'http://localhost:8080/cache/products?case=lesson11'
curl -i -H 'Cookie: session=demo' \
  'http://localhost:8080/cache/products?case=lesson11'
```

<div dir="rtl">

## نتیجهٔ مورد انتظار
برای کلید تازه، `MISS` و سپس `HIT` با همان timestamp بک‌اند می‌گیرید؛ درخواست Authorization یا Cookie مقدار `BYPASS` دارد. اگر ورودی قبلاً موجود است مقدار query جدید بگذارید. پس از اتمام TTL، در refresh زمان عوض می‌شود.

کش مرورگر مستقل است: فایل ایستا با نام hashدار می‌تواند `Cache-Control: public, max-age=31536000, immutable` بگیرد؛ فقط وقتی تغییر محتوا باعث نام فایل جدید می‌شود. HTML را کوتاه‌عمر یا قابل revalidate نگه دارید. `no-cache` یعنی اعتبارسنجی مجدد و `no-store` یعنی ممنوعیت ذخیره. HIT در کش Nginx ثابت نمی‌کند مرورگر از کش خوانده است.

## تمرین و پاسخ
چرا فقط `$uri` برای کلید کش جست‌وجوی کالا خطرناک است؟ آرگومان‌های query حذف می‌شوند و جست‌وجوهای مختلف برخورد می‌کنند. آرگومان‌ها و ابعاد هویتی لازم را وارد کلید کنید یا اصلاً کش نکنید.

</div>

<div dir="rtl">

## منابع رسمی

- [Proxy cache directives](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache)
- [Response headers](https://nginx.org/en/docs/http/ngx_http_headers_module.html)

</div>
