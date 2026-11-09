[← فهرست و مسیر یادگیری](../README.md) | [English](01_018_fastcgi_and_php_fpm_English.md)

# 018 — FastCGI، PHP-FPM و مسیریابی امن اسکریپت

<div dir="rtl">

## هدف و محیط
بفهمید چرا PHP-FPM بک‌اند HTTP نیست. پیش‌نیاز: فایل، location و پراکسی. مثال برای **برنامهٔ front-controller با PHP-FPM روی لینوکس** است که pool آن روی socket نوشته‌شده گوش می‌دهد. نام socket با بستهٔ PHP فرق می‌کند؛ تنظیم pool واقعی را ببینید. این مجموعه PHP-FPM را برای شما نصب یا اجرا نمی‌کند.

</div>


```nginx
server {
    listen 8090;
    server_name localhost;
    root /srv/php-app/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Only this entry point may execute as PHP.
    location = /index.php {
        try_files $uri =404;
        include /etc/nginx/fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_pass unix:/run/php/php-fpm.sock;
    }

    # Do not execute or serve other PHP scripts as source.
    location ~* \.php(?:/|$) { return 404; }
    location ~ /\. { deny all; }
}
```

<div dir="rtl">

## چه چیزی روی این اتصال منتقل می‌شود؟
FastCGI متادیتا و بدنه را با پروتکل خودش می‌فرستد و تبادل HTTP معمولی نیست. `fastcgi_pass` به PHP-FPM متصل می‌شود؛ `proxy_pass http://...` انتظار HTTP server دارد. اشتباه گرفتن این دو خطای پروتکل می‌دهد.

`SCRIPT_FILENAME` فایل قابل‌اجرا را به PHP-FPM معرفی می‌کند. document root عمومی باید entry point و asset عمومی داشته باشد، نه secret برنامه. location دقیق فقط `index.php` را اجرا می‌کند و regex منع PHP بقیهٔ مسیرهای شبیه اسکریپت را می‌گیرد. قبل از dispatch وجود فایل بررسی می‌شود.

فایل‌های بسته‌بندی‌شدهٔ `fastcgi_params` و `fastcgi.conf` ممکن است متفاوت باشند؛ آن‌ها را بخوانید و از تعریف تکراری و متناقض `SCRIPT_FILENAME` پرهیز کنید. مجوز Unix socket باید اجازهٔ اتصال worker را بدهد. اگر FPM از TCP استفاده می‌کند، آن را خصوصی bind و دسترسی شبکه را محدود کنید.

</div>


```bash
# On the PHP test host:
sudo nginx -t
ls -l /run/php/
curl -i http://127.0.0.1:8090/
curl -i http://127.0.0.1:8090/orders/42
curl -i http://127.0.0.1:8090/uploads/evil.php
curl -i http://127.0.0.1:8090/.env
```

<div dir="rtl">

## نتیجه و محدودیت
route معتبر به front controller می‌رسد. مسیرهای PHP دیگر ۴۰۴ می‌گیرند و dotfileها رد می‌شوند. بررسی کنید پاسخ PHP اجرا شود و سورس نمایش داده نشود. تا حد امکان آپلود را خارج از درخت اسکریپت اجرایی/عمومی نگه دارید. مثال منع dotfile مسیر `/.well-known/` را هم می‌گیرد؛ در صورت نیاز route چالش مشخص اضافه کنید.

فریم‌ورک‌ها متفاوت‌اند؛ برنامهٔ path-info یا چند entry point نیازمند تطبیق بررسی‌شده است. regex آزاد برای اجرای هر PHP آپلودشده کپی نکنید. مجوز برنامه، ظرفیت pool و timeoutهای FPM مسئولیت‌های جدا هستند.

## تمرین و پاسخ
چرا `/uploads/evil.php` در تنظیم اجرای عمومی PHP خطرناک است؟ محتوای کاربر ممکن است به کد اجرایی تبدیل شود. allow listِ entry point، جداسازی فضای ذخیره و اعتبارسنجی آپلود در برنامه هرکدام بخشی از خطر را پوشش می‌دهند.

</div>

<div dir="rtl">

## منابع رسمی

- [FastCGI module](https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html)

</div>
