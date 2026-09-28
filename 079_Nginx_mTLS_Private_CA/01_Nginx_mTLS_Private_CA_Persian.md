<div dir="rtl">

# راه‌اندازی mTLS با Private CA در Nginx

دقیقاً همین معماری، امن‌ترین و استانداردترین روش برای جداسازی ترافیک عمومی از شبکه داخلی است. با توجه به توقف پشتیبانی Let's Encrypt از صدور گواهینامه‌های احراز هویت کلاینت (tlsclient)، راه‌اندازی یک مرجع صدور گواهینامه داخلی (Private CA) برای لایه mTLS تنها راهکار اصولی است.

در این معماری، Nginx لبه شبکه دو نقش کاملاً متفاوت بازی می‌کند: برای کاربران اینترنت یک سرور HTTPS است و برای سرورهای داخلی یک کلاینت mTLS.

برای پیاده‌سازی این ساختار، باید سه مرحله زیر را طی کنید.

## مرحله ۱: ایجاد Private CA و گواهینامه‌های داخلی

برای ارتباطات شبکه داخلی، باید خودتان نقش مرجع صدور (CA) را ایفا کنید. ابتدا یک CA می‌سازیم و سپس گواهینامه‌های Nginx و سرورهای API را با آن امضا می‌کنیم.

### ۱. ساخت گواهینامه ریشه (Private CA):
```bash
# ساخت کلید خصوصی CA
openssl genrsa -out private-ca.key 4096

# ساخت گواهینامه CA با اعتبار ۱۰ سال
openssl req -x509 -new -nodes -key private-ca.key -sha256 -days 3650 -out private-ca.crt -subj "/CN=My Internal CA"
```

### ۲. ساخت گواهینامه برای سرورهای API (مثلاً API-01):
```bash
openssl genrsa -out api-01.key 2048
openssl req -new -key api-01.key -out api-01.csr -subj "/CN=api-01.internal"

# امضای گواهینامه سرور توسط CA داخلی
openssl x509 -req -in api-01.csr -CA private-ca.crt -CAkey private-ca.key -CAcreateserial -out api-01.crt -days 825 -sha256
```

### ۳. ساخت گواهینامه کلاینت برای Nginx (تا APIها او را بشناسند):
```bash
openssl genrsa -out nginx-client.key 2048
openssl req -new -key nginx-client.key -out nginx-client.csr -subj "/CN=Nginx Reverse Proxy"

# امضای گواهینامه کلاینت توسط CA داخلی
openssl x509 -req -in nginx-client.csr -CA private-ca.crt -CAkey private-ca.key -CAcreateserial -out nginx-client.crt -days 825 -sha256
```

## مرحله ۲: پیکربندی Nginx لبه شبکه (Reverse Proxy)

در اینجا Nginx ترافیک را از اینترنت با گواهینامه Let's Encrypt دریافت کرده و در یک تونل جدیدِ mTLS با استفاده از گواهینامه‌های داخلی به سمت APIها می‌فرستد.
```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # ---------------------------------------------------------
    # ۱. ارتباط با اینترنت (Public HTTPS) - با Let's Encrypt
    # ---------------------------------------------------------
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # ---------------------------------------------------------
    # ۲. ارتباط با سرورهای داخلی (Internal mTLS) - با Private CA
    # ---------------------------------------------------------
    location /api-01/ {
        # ارسال ترافیک به سرور داخلی با پروتکل HTTPS
        proxy_pass https://api-01.internal/;

        # ارائه گواهینامه کلاینتِ Nginx به سرور API برای احراز هویت
        proxy_ssl_certificate /etc/nginx/certs/nginx-client.crt;
        proxy_ssl_certificate_key /etc/nginx/certs/nginx-client.key;

        # بررسی و تایید گواهینامه سرور API توسط Nginx (تکمیل mTLS)
        proxy_ssl_trusted_certificate /etc/nginx/certs/private-ca.crt;
        proxy_ssl_verify on;
        proxy_ssl_verify_depth 2;
        
        # ارسال نام سرور برای جلوگیری از خطای SNI در سمت API
        proxy_ssl_server_name on;
        proxy_ssl_name api-01.internal;

        # ارسال هدرهای ضروری به بک‌اند
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## مرحله ۳: پیکربندی سرورهای API

سرورهای API (که می‌توانند خودشان با Nginx، Node.js، Go یا هر فریم‌ورک دیگری اجرا شوند) باید طوری تنظیم شوند که فقط درخواست‌هایی را بپذیرند که کلاینت آن‌ها گواهینامه امضا شده توسط `private-ca.crt` را ارائه دهد.

نمونه تنظیمات Nginx در سمت API-01:
```nginx
server {
    listen 443 ssl;
    server_name api-01.internal;

    # گواهینامه خود سرور API (که Nginx لبه آن را بررسی می‌کند)
    ssl_certificate /etc/api-certs/api-01.crt;
    ssl_certificate_key /etc/api-certs/api-01.key;

    # معرفی CA داخلی و اجبار به احراز هویت کلاینت (Nginx لبه)
    ssl_client_certificate /etc/api-certs/private-ca.crt;
    ssl_verify_client on;

    location / {
        # اگر Nginx لبه گواهینامه معتبر ندهد، درخواست در لایه TLS رد می‌شود 
        # و هرگز به اپلیکیشن اصلی نمی‌رسد
        proxy_pass http://localhost:8080;
    }
}
```

## چرا این معماری فوق‌العاده امن است؟
اگر یک مهاجم به نحوی به شبکه داخلی (VPC یا LAN) شما نفوذ کند و بخواهد مستقیماً به آدرس `api-01.internal` درخواست بفرستد، چون کلید خصوصی (`nginx-client.key`) را در اختیار ندارد، اتصال او در همان مرحله Handshake رد می‌شود (کد خطای ۴۰۰ Bad Request). سرورهای API شما عملاً در برابر هر درخواستی که از مسیر Nginx لبه نیامده باشد، نامرئی و نفوذناپذیر هستند.

پس از تنظیم این معماری، مدیریت گواهینامه‌های داخلی در بلندمدت مهم می‌شود، زیرا برخلاف Let's Encrypt که ابزاری مثل Certbot دارد، باید تمدید گواهینامه‌های Private CA را خودتان مدیریت کنید.

</div>
