[← فهرست و مسیر یادگیری](../README.md) | [English](01_005_static_files_and_spa_English.md)

# 005 — فایل ایستا، root، alias و مسیریابی SPA

<div dir="rtl">

## هدف و پیش‌نیاز
فایل را از مسیر قابل‌پیش‌بینی دیسک ارائه کنید و خطای API را از مسیریابی SPA جدا نگه دارید. پیش‌نیاز: انتخاب location. این **بلوک server** داخل `http` قرار می‌گیرد. قبل از آزمایش، پوشه‌ها و فایل‌های اشاره‌شده را بسازید.

</div>


```nginx
server {
    listen 8082;
    server_name localhost;
    root /srv/www/site;
    index index.html;
    autoindex off;

    location ^~ /api/ { return 404; }
    location ^~ /assets/ {
        try_files $uri =404;
    }
    location /downloads/ {
        alias /srv/downloads/;
    }
    location = /index.html {
        add_header Cache-Control "no-cache";
    }
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

<div dir="rtl">

## ساخت مسیر فایل

| درخواست | دستور | مسیر روی دیسک |
| --- | --- | --- |
| `/assets/app.js` | `root /srv/www/site` | `/srv/www/site/assets/app.js` |
| `/downloads/manual.pdf` | `alias /srv/downloads/` | `/srv/downloads/manual.pdf` |

`root` مسیر URI را به انتهای ریشه اضافه می‌کند. `alias` پیشوند location را جایگزین می‌کند؛ در این مثال prefix، اسلش پایانی دو مسیر را هماهنگ نگه دارید. fallbackِ SPA برای مسیرهای ناشناختهٔ ناوبری، internal redirect به `index.html` انجام می‌دهد تا روتر فرانت‌اند صفحه را تعیین کند. این رفتار را روی JS گم‌شده یا خطای API اعمال نکنید؛ HTML با کد ۲۰۰ خرابی استقرار را پنهان می‌کند.

location دقیق `/index.html` در fallback هم انتخاب می‌شود. مقدار `no-cache` اجازهٔ ذخیره همراه با اعتبارسنجی مجدد می‌دهد و معنی `no-store` ندارد. include عمومی `mime.types` برای Content-Type مناسب JavaScript و CSS لازم است.

</div>


```bash
sudo mkdir -p /srv/www/site/assets /srv/downloads
printf '<h1>SPA shell</h1>\n' | sudo tee /srv/www/site/index.html
printf 'console.log("asset loaded");\n' | sudo tee /srv/www/site/assets/app.js
printf 'sample download\n' | sudo tee /srv/downloads/manual.txt
sudo nginx -t && sudo systemctl reload nginx
curl -i http://127.0.0.1:8082/orders/42
curl -i http://127.0.0.1:8082/assets/missing.js
curl -i http://127.0.0.1:8082/api/missing
curl -i http://127.0.0.1:8082/downloads/manual.txt
```

<div dir="rtl">

## بررسی نتیجه و نکات عملیاتی
برای `/orders/42` صفحهٔ SPA، برای فایل و API گم‌شده خطای ۴۰۴ و برای آخرین درخواست متن دانلود می‌گیرید. worker باید مجوز خواندن فایل و مجوز عبور/execute روی پوشه‌های والد داشته باشد. مالکیت و مجوز والدها را بررسی کنید؛ `chmod 777` راه‌حل مناسبی نیست.

فایل آپلودی را خارج از پوشهٔ کد اجرایی نگه دارید. نمایش فهرست پوشه را فقط در صورت نیاز فعال کنید. وقتی درخت فایل برای کاربران قابل‌نوشتن است، symlink و مسیر alias را دقیق بررسی کنید.

## تمرین و پاسخ
بلوک `/api/` را حذف کنید و یک API ناموجود بخواهید. حالا HTML برمی‌گردد. بلوک را برگردانید و توضیح دهید چرا خطای فرانت‌اند مثل «unexpected token <» ممکن است ریشه در مسیریابی سرور داشته باشد.

</div>

<div dir="rtl">

## منابع رسمی

- [root, alias and try_files](https://nginx.org/en/docs/http/ngx_http_core_module.html)

</div>
