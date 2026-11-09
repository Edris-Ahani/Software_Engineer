[← فهرست و مسیر یادگیری](../README.md) | [English](01_013_access_control_cors_and_security_English.md)

# 013 — کنترل دسترسی، Basic Auth، CORS و هدرهای امنیتی

<div dir="rtl">

## هدف و پیش‌نیاز
کنترل شبکه، احراز هویت، دسترسی cross-origin مرورگر و سیاست پاسخ را جدا طراحی کنید. پیش‌نیاز: HTTPS و location. ابتدا **روی هاست آزمایشی لینوکس** فایل رمز بسازید. گزینهٔ `-c` فایل را ایجاد یا بازنویسی می‌کند؛ برای افزودن کاربران بعدی حذفش کنید. worker باید بتواند فایل را بخواند ولی کاربران عادی نباید دسترسی داشته باشند.

</div>


```bash
sudo apt install apache2-utils
sudo htpasswd -c /etc/nginx/admin.htpasswd admin
# Debian example: adapt the group to the actual worker user.
sudo chown root:www-data /etc/nginx/admin.htpasswd
sudo chmod 640 /etc/nginx/admin.htpasswd
```

<div dir="rtl">

## محدود کردن مسیر مدیریتی
این مثال **داخل سرور HTTPS موجود** قرار می‌گیرد. با `satisfy all` هم آدرس مجاز و هم رمز لازم است. شبکهٔ نمونه را با شبکهٔ مدیریت واقعی جایگزین کنید. Basic Auth را روی HTTP بدون رمزنگاری منتشر نکنید.

</div>


```nginx
location /admin/ {
    satisfy all;
    allow 10.30.0.0/24;
    deny all;
    auth_basic "Administration";
    auth_basic_user_file /etc/nginx/admin.htpasswd;
    proxy_pass http://127.0.0.1:3000;
}
```

<div dir="rtl">

## CORS سیاست مرورگر است
CORS احراز هویت نیست و جلوی curl را نمی‌گیرد. وقتی routeها متد یا credential متفاوت دارند، سیاست داخل برنامه معمولاً مناسب‌تر است. **قطعهٔ داخل server** زیر برای API ساده با یک origin ثابت، preflight را نشان می‌دهد. اگر برنامه هم هدر CORS می‌فرستد، یک لایه را مسئول کنید تا هدر تکراری یا متناقض تولید نشود.

</div>


```nginx
location /browser-api/ {
    add_header Access-Control-Allow-Origin "https://app.example.com" always;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
    add_header Vary "Origin" always;
    add_header X-Content-Type-Options "nosniff" always;

    if ($request_method = OPTIONS) { return 204; }
    proxy_pass http://127.0.0.1:3000/;
}
```

<div dir="rtl">

## ملاحظات و بررسی
استفادهٔ محدود از `if` برای return پاسخ قابل‌پیش‌بینی است؛ با شرط‌های تو‌در‌توی rewrite یک برنامهٔ مسیریابی عمومی نسازید. درخواست مرورگر دارای credential به origin صریح، `Access-Control-Allow-Credentials: true`، تنظیمات درست کلاینت و در صورت لزوم محافظت CSRF نیاز دارد. برای دسترسی credentialدار نمی‌توان از origin ستاره استفاده کرد. مجاز کردن یک هدر به معنی اعتبارسنجی توکن آن نیست.

هدر امنیتی باید با برنامه سازگار باشد. `nosniff` به محدود کردن تفسیر محتوا کمک می‌کند. CSP باید script، style، اتصال و framing واقعی را پوشش دهد؛ سیاستی که بی‌صدا فرانت‌اند را می‌شکند کپی نکنید. HSTS فقط روی محدودهٔ HTTPS تأییدشده اضافه شود. با قاعدهٔ سنتی ارث‌بری، location دارای `add_header` باید هدرهای امنیتی لازم والد را هم در مجموعهٔ خودش داشته باشد.

</div>


```bash
curl -i -X OPTIONS https://api.example.com/browser-api/orders \
  -H 'Origin: https://app.example.com' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: Content-Type,Authorization'
curl -i https://api.example.com/admin/
curl -i -u admin https://api.example.com/admin/
```

<div dir="rtl">

## تمرین و پاسخ
در مرورگر واقعی origin دیگری امتحان کنید. هدر origin ثابت با آن تطبیق ندارد؛ مرورگر نباید پاسخ را در اختیار آن origin بگذارد. curl همچنان پاسخ را می‌خواند؛ مجوز واقعی باید در برنامه کنترل شود. مسیر admin را از شبکهٔ مجاز و غیرمجاز بررسی کنید؛ رمز صحیح به‌تنهایی نباید شرط IP را دور بزند.

</div>

<div dir="rtl">

## منابع رسمی

- [Basic authentication](https://nginx.org/en/docs/http/ngx_http_auth_basic_module.html)
- [Response header rules](https://nginx.org/en/docs/http/ngx_http_headers_module.html)

</div>
