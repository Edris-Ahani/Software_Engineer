[← فهرست و مسیر یادگیری](../README.md) | [English](01_007_headers_real_ip_and_trust_English.md)

# 007 — هدرهای پراکسی، IP واقعی و مرز اعتماد

<div dir="rtl">

## هدف
برنامه باید scheme عمومی و آدرس کلاینت را درست ببیند، بدون اینکه ادعای دلخواه کاربر را بپذیرد. پیش‌نیاز: پراکسی معکوس. ابتدا فرض کنید Nginx مستقیماً لبهٔ عمومی است و **پراکسی مورداعتماد دیگری جلوی آن نیست**. این دستورها را داخل location پراکسی بگذارید؛ اگر location دیگری `proxy_set_header` خودش را دارد، مجموعهٔ لازم را کامل تکرار کنید.

</div>


```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $remote_addr;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Request-ID $request_id;
proxy_set_header Forwarded "";
```

<div dir="rtl">

## چرا در لبهٔ عمومی هدر را بازنویسی می‌کنیم؟
کلاینت اینترنت می‌تواند هر `X-Forwarded-For` دلخواهی بفرستد. در لبهٔ مستقیم، قرار دادن `$remote_addr` سابقهٔ جعلی را حذف می‌کند. متغیر `$proxy_add_x_forwarded_for` به زنجیرهٔ موجود اضافه می‌کند؛ فقط وقتی زنجیره و قواعد اعتماد برنامه را می‌شناسید از آن استفاده کنید. برنامه باید فقط از پراکسی‌های مشخص اطلاعات forwarded را بپذیرد و اگر معماری لازم می‌داند، مستقیماً قابل‌دسترسی نباشد.

متغیر `$host` کنترل دسترسی نیست؛ hostname نامنتظر را با default server صریح رد کنید و allowed hosts برنامه را تنظیم کنید. اگر TLS روی load balancer تمام شود، `$scheme` در اتصال HTTP داخلی `http` است، هرچند کاربر HTTPS استفاده کرده است.

</div>

<div dir="rtl">

## پشت load balancer مورداعتماد
قطعهٔ بعدی داخل `http` یا `server` قرار می‌گیرد. شبکهٔ `10.20.0.0/24` فقط نمونه است؛ آن را با محدودهٔ دقیق balancerهای واقعی جایگزین کنید. ACL شبکه باید مانع جعل هویت آن‌ها توسط اتصال‌های نامعتبر شود. ماژول realip نیز باید موجود باشد؛ با `nginx -V` بررسی کنید.

</div>


```nginx
set_real_ip_from 10.20.0.0/24;
real_ip_header X-Forwarded-For;
real_ip_recursive on;
# $remote_addr becomes the selected client address.
# $realip_remote_addr retains the original connection peer.
```

<div dir="rtl">

## روش بررسی
در آزمایشگاه با لبهٔ مستقیم، ورودی جعلی زیر نباید به IP معتبر کلاینت در بک‌اند تبدیل شود:

</div>


```bash
curl -s -H 'X-Forwarded-For: 1.2.3.4' \
  -H 'Forwarded: for=1.2.3.4;proto=https' \
  http://localhost:8080/api/headers
```

<div dir="rtl">

## خطا، تمرین و پاسخ
روی listener عمومی از `set_real_ip_from 0.0.0.0/0` استفاده نکنید؛ طرف نامعتبر می‌تواند روی محدودیت IP، لاگ و ACL اثر بگذارد. اگر TLS در لایهٔ بیرونی تمام می‌شود، scheme اعلام‌شدهٔ آن لایه را فقط در مسیر محدود به همان peer و طبق سیاست اعتبارسنجی مشخص بپذیرید؛ بازتاب کورکورانهٔ `X-Forwarded-Proto` کلاینت امن نیست.

تمرین: چرا محدود کردن همهٔ درخواست‌ها با IP خود balancer عدالت را خراب می‌کند؟ پاسخ: تا وقتی IP واقعی را امن استخراج نکنید همهٔ کاربران یک کلید مشترک دارند. هنگام بررسی زنجیره، هم آدرس کلاینت و هم آدرس peer اولیه را ثبت کنید.

</div>

<div dir="rtl">

## منابع رسمی

- [Real IP module](https://nginx.org/en/docs/http/ngx_http_realip_module.html)
- [Proxy request headers](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_set_header)

</div>
