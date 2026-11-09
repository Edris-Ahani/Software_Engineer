[← فهرست و مسیر یادگیری](../README.md) | [English](01_004_server_and_location_matching_English.md)

# 004 — انتخاب سرور مجازی و location

<div dir="rtl">

## هدف یادگیری
پیش‌بینی کنید درخواست وارد کدام بلوک می‌شود. پیش‌نیاز: context و HTTP مقدماتی. این **قطعهٔ داخل contextِ http** را روی نمونهٔ آزمایشی در فایل فعال `conf.d/routing.conf` بگذارید؛ دو سرور روی پورت ۸۰۸۱ تعریف می‌کند.

</div>


```nginx
server {
    listen 8081 default_server;
    server_name _;
    return 404;
}

server {
    listen 8081;
    server_name shop.example.test;

    location = /healthz { return 200 "exact\n"; }
    location ^~ /assets/ { return 200 "assets prefix\n"; }
    location ~* \.(jpg|png)$ { return 200 "image regex\n"; }
    location /api/ { return 200 "api prefix\n"; }
    location / { return 200 "fallback prefix\n"; }
}
```

<div dir="rtl">

## انتخاب در این مثال بدون تو‌در‌تویی
ابتدا آدرس و پورت listener گزینه‌های سرور را محدود می‌کند؛ سپس هدر Host سرور مجازی را مشخص می‌کند. پیش‌فرض متعلق به listener است و رشتهٔ `_` خاصیت جادویی ندارد؛ فقط نام میزبان نامعمولی است. در HTTPS، مرحلهٔ SNI قبل از HTTP هم در انتخاب گواهینامه اثر دارد.

در locationهای همین مثال: تطبیق دقیق `=` برنده است. در غیر این صورت طولانی‌ترین prefix نگه داشته می‌شود. اگر آن prefix دارای `^~` باشد، regexها بررسی نمی‌شوند. در غیر این صورت اولین regex مطابق، به ترتیب فایل، انتخاب می‌شود؛ اگر regex مطابقی نبود همان prefix انتخاب می‌شود. `~` به بزرگی حروف حساس است و `~*` نیست. location تو‌در‌تو و internal redirect نیاز به ردگیری بیشتر دارند؛ این دستورالعمل ساده را بی‌قید تعمیم ندهید.

</div>


```bash
curl -i -H 'Host: shop.example.test' http://127.0.0.1:8081/healthz
curl -i -H 'Host: shop.example.test' http://127.0.0.1:8081/assets/a.png
curl -i -H 'Host: shop.example.test' http://127.0.0.1:8081/api/a.png
curl -i -H 'Host: unknown.example.test' http://127.0.0.1:8081/
```

<div dir="rtl">

## توضیح خروجی‌ها
چهار نتیجه به‌ترتیب `exact`، `assets prefix`، `image regex` و خطای ۴۰۴ هستند. مسیر `/api/a.png` با `/api/` تطبیق دارد ولی regex می‌تواند آن prefix را کنار بزند. query string در انتخاب location نقشی ندارد؛ `/healthz?verbose=1` هم با `= /healthz` مطابق است.

متغیر `$request_uri` مسیر اولیه را همراه آرگومان‌ها نگه می‌دارد. `$uri` مسیر نرمال‌شدهٔ فعلی بدون آرگومان‌هاست و ممکن است در internal redirect تغییر کند. prefixِ `/api` با `/apiculture` هم تطبیق دارد؛ از `/api/` استفاده کنید و وضعیت خود `/api` را آگاهانه مشخص کنید.

## تمرین و پاسخ
چرا تغییر `/api/` به `^~ /api/` نتیجهٔ `/api/a.png` را عوض می‌کند؟ چون وقتی این prefix برنده شد بررسی regex انجام نمی‌شود. هر دو حالت را بررسی کنید و اگر سرور دیگری پاسخ داد خروجی `nginx -T` را ببینید.

</div>

<div dir="rtl">

## منابع رسمی

- [Request processing](https://nginx.org/en/docs/http/request_processing.html)
- [Location reference](https://nginx.org/en/docs/http/ngx_http_core_module.html#location)

</div>
