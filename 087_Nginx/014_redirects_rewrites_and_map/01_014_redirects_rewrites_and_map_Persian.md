[← فهرست و مسیر یادگیری](../README.md) | [English](01_014_redirects_rewrites_and_map_English.md)

# 014 — redirect، بازنویسی داخلی، متغیر و map

<div dir="rtl">

## هدف
برای هر نیاز ساده‌ترین ابزار مسیریابی مناسب را انتخاب کنید. پیش‌نیاز: انتخاب location و متغیرهای URI. redirect به کلاینت می‌گوید درخواست جدید بسازد؛ بازنویسی داخلی پردازش را در Nginx تغییر می‌دهد و `map` فقط مقدار متغیر را محاسبه می‌کند.

</div>


```nginx
# HTTP context
map $http_x_release $release_label {
    default stable;
    "preview" preview;
}

server {
    listen 8087;
    server_name localhost;

    location = /old-docs {
        return 302 /docs/;
    }
    location /legacy/ {
        rewrite ^/legacy/(.*)$ /v2/$1 last;
    }
    location /v2/ {
        add_header X-Release $release_label always;
        return 200 "current uri: $uri; original: $request_uri\n";
    }
    location / { return 404; }
}
```

<div dir="rtl">

## ردگیری رفتار
مسیر `/old-docs` پاسخ ۳۰۲ و هدر Location می‌دهد و پس از دنبال کردن، آدرس مرورگر عوض می‌شود. درخواست `/legacy/item?id=7` به `/v2/item` بازنویسی می‌شود و به خاطر `last` انتخاب location دوباره انجام می‌شود. آرگومان‌های موجود باقی می‌مانند مگر جایگزین عمداً آن‌ها را تغییر دهد یا حذف کند. `$request_uri` ورودی اولیه و `$uri` مسیر فعلی را نگه می‌دارد.

`break` توالی rewrite جاری را متوقف می‌کند و به همان شکل جست‌وجوی مجدد location انجام نمی‌دهد. پرچم اشتباه ممکن است handler غلط یا حلقهٔ بازنویسی بسازد. برای redirect ساده از `return` و برای بررسی وجود فایل از `try_files` استفاده کنید.

`map` در `http` قرار می‌گیرد و برای allow list کوچک مفید است. هدر نمونه فقط برچسب نمایشی را عوض می‌کند؛ نباید دسترسی بدهد یا استقرار خصوصی را افشا کند. hostname دلخواه از هدر نامعتبر را مقصد پراکسی پویا نکنید؛ این کار می‌تواند SSRF یا open proxy بسازد.

</div>


```bash
curl -i http://127.0.0.1:8087/old-docs
curl -i 'http://127.0.0.1:8087/legacy/item?id=7'
curl -i -H 'X-Release: preview' http://127.0.0.1:8087/v2/item
curl -i -H 'X-Release: anything' http://127.0.0.1:8087/v2/item
```

<div dir="rtl">

## کد وضعیت و اعمال تغییر
هنگام بررسی مهاجرت از ۳۰۲ یا ۳۰۷ موقت استفاده کنید. ۳۰۷ و ۳۰۸ متد درخواست را حفظ می‌کنند؛ ۳۰۱ و ۳۰۲ سابقهٔ تغییر متد در کلاینت‌ها دارند. redirect دائمی ممکن است در کلاینت و کش بماند و اصلاح خطا را دشوار کند. دربارهٔ حفظ query تصمیم بگیرید. برای canonical host نام ثابت به‌کار ببرید و Host دلخواه را بازتاب ندهید.

## تمرین و پاسخ
چرا redirect دائمی A به B همراه با قانون B به A شکست می‌خورد؟ مرورگر میان درخواست‌ها حلقه می‌زند. حلقهٔ internal rewrite در خود سرور رخ می‌دهد و می‌تواند به سقف چرخه برسد. قبل از `curl -L`، هدر Location، خروجی `curl -i` و error log را بررسی کنید.

</div>

<div dir="rtl">

## منابع رسمی

- [Rewrite module](https://nginx.org/en/docs/http/ngx_http_rewrite_module.html)
- [Map module](https://nginx.org/en/docs/http/ngx_http_map_module.html)

</div>
