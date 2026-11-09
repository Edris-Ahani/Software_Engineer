[فهرست و مسیر یادگیری](README.md) | [English](00_HOW_TO_RUN_English.md)

<div dir="rtl">

# نحوهٔ اجرای مثال‌های Nginx

## پیش‌نیازها

- Docker Desktop/Engine در حال اجرا با **Linux containers** و Compose نسخهٔ ۲ دارای پشتیبانی `up --wait`.
- Python نسخهٔ 3.10 یا بالاتر روی هاست برای بررسی‌ها؛ هیچ بستهٔ pip لازم نیست.
- اینترنت برای دریافت اولیهٔ imageها و آزاد بودن پورت محلی ۸۰۸۰.

آزمایشگاه محیط HTTP محلی است و Nginx را به‌عنوان سرویس هاست نصب نمی‌کند. اگر `docker version` بخش server ندارد، ابتدا موتور Docker/Desktop را اجرا کنید. دستورهای `apt` و `systemctl` درس‌ها به Linux، ماشین مجازی یا WSL مناسب نیاز دارند و دستور بومی PowerShell نیستند.

## شروع از ریشهٔ مخزن

</div>

```bash
cd 087_Nginx
docker version
docker compose version
docker compose -f _lab/compose.yaml config --quiet
docker compose -f _lab/compose.yaml up -d --wait
docker compose -f _lab/compose.yaml exec nginx nginx -t
python _lab/smoke_test.py
```

<div dir="rtl">

[آزمایشگاه محلی](http://localhost:8080) را باز کنید. اجرای اول دو image می‌گیرد. بک‌اندهای Python باید پیش از شروع Nginx سالم شوند. در صورت شکست شروع، به‌جای restart پی‌درپی لاگ را ببینید:

</div>

```bash
docker compose -f _lab/compose.yaml ps
docker compose -f _lab/compose.yaml logs --tail=50
```

<div dir="rtl">

## آزمایش هر رفتار

برای دستورهای curl زیر در PowerShell از `curl.exe` استفاده کنید؛ ممکن است `curl` نام مستعار PowerShell باشد. smoke test با Python روی ویندوز و لینوکس کار می‌کند.

</div>

```bash
curl -i http://localhost:8080/
curl -i http://localhost:8080/healthz
curl -s 'http://localhost:8080/api/orders?status=open'
curl -s 'http://localhost:8080/preserve/orders?status=open'
curl -i 'http://localhost:8080/cache/products?run=manual1'
curl -i 'http://localhost:8080/cache/products?run=manual1'
curl -i -H 'Authorization: Bearer demo' 'http://localhost:8080/cache/products?run=manual1'
curl -i -H 'Cookie: session=demo' 'http://localhost:8080/cache/products?run=manual1'
curl -N http://localhost:8080/events/
curl -i http://localhost:8080/old-docs
```

<div dir="rtl">

| مسیر | رفتار مورد انتظار |
| --- | --- |
| `/` | صفحهٔ HTML دوزبانهٔ ایستا از Nginx |
| `/healthz` | پاسخ `200 ok`؛ فقط سلامت خود Nginx |
| `/api/orders?status=open` | برنامه مسیر `/orders?status=open` را می‌گیرد |
| `/preserve/orders?status=open` | مسیر بدون تغییر به برنامه می‌رسد |
| `/cache/products` | کلید تازه: MISS و سپس HIT تا ۳۰ ثانیه |
| `/cache/products` دارای auth/cookie | BYPASS؛ درخواست هویت‌دار کش مشترک نمی‌گیرد |
| `/limited/` | نرخ پایدار ۲ در ثانیه برای IP مشاهده‌شده با burst برابر ۲؛ اضافه‌ها ۴۲۹ |
| `/events/` | سه رویداد SSE با فاصلهٔ ۰٫۳ ثانیه |
| `/api/upload` با POST | شمارش بایت دریافتی به‌صورت JSON؛ سقف ۱ MiB |
| `/assets/missing.js` | خطای ۴۰۴ بدون fallback به HTML |
| `/old-docs` | redirect با ۳۰۲ به `/docs/` |

بک‌اند نمایشی برای GET با مسیر دلخواه JSON می‌دهد تا رفتار forwarding دیده شود؛ router برنامهٔ واقعی یا HTTP server تولید نیست. فقط `/products` بک‌اند قابل‌کش است. برای تکرار MISS/HIT از query تازه استفاده کنید. در چند درخواست بدون کش باید هویت هر دو بک‌اند ظاهر شود؛ تناوب دقیق تضمین نشده است.

## تغییر، اعتبارسنجی و reload

فایل `_lab/nginx.conf` یا `_lab/proxy_headers.conf` را تغییر دهید و سپس:

</div>

```bash
docker compose -f _lab/compose.yaml exec nginx nginx -t
# Only after a successful check:
docker compose -f _lab/compose.yaml exec nginx nginx -s reload
python _lab/smoke_test.py
docker compose -f _lab/compose.yaml logs --tail=30 nginx
```

<div dir="rtl">

آزمون‌ها عمداً سلامت هر دو بک‌اند را لازم دارند. اگر مسیر یا محدودیت را تغییر دادید، انتظار آزمون را آگاهانه اصلاح کنید. برای پورت دیگر، host mapping را تغییر دهید و URL متناظر را بدهید:

</div>

```bash
python _lab/smoke_test.py --base-url http://127.0.0.1:8081
```

<div dir="rtl">

recreate بک‌اند ممکن است IP را عوض کند. پس از سالم شدن، Nginx را reload کنید تا نام‌های literal دوباره resolve شوند. برای reset تمیز کل stack را down و up کنید. tag تصویر متغیر است؛ برای استقرار قابل‌بازتولید digest بررسی‌شده را ثبت و pin کنید.

## آزمایش اختیاری خرابی

</div>

```bash
docker compose -f _lab/compose.yaml stop app1
curl -i http://localhost:8080/api/hello
docker compose -f _lab/compose.yaml logs --tail=20 nginx
docker compose -f _lab/compose.yaml start app1
```

<div dir="rtl">

انتظار دارید از بک‌اند دیگر سرویس بگیرید و شاید تلاش ناموفق در لاگ ببینید. این آزمایش دستی خرابی است و وضعیت عادی smoke test با دو بک‌اند نیست. قبل از آزمون مجدد، بک‌اند را برگردانید و فرصت بازیابی بدهید.

## بررسی مستندات و جمع کردن محیط

</div>

```bash
python _shared/validate_docs.py
docker compose -f _lab/compose.yaml down
```

<div dir="rtl">

بررسی مستندات ۲۲ جفت درس، لینک محلی، خوانایی UTF-8 و توازن بلوک کد را می‌سنجد و معنای دستورهای Nginx را ثابت نمی‌کند. smoke test فایل ایستا، مسیر، حذف هدر جعلی، request ID، هر دو بک‌اند، کش، سقف آپلود، redirect، رسیدن تدریجی SSE و رد شدن نرخ اضافه را بررسی می‌کند.

آزمایشگاه دیتابیس یا named volume ندارد. `down` کانتینر و شبکهٔ همین stack را حذف می‌کند؛ کش محلی با recreate از بین می‌رود. TLS/mTLS، PHP-FPM، gRPC، stream و QUIC پیش‌نیازهای جدا در درس خود دارند. قطعه‌های مستقل را یکجا در یک تنظیمات ترکیب نکنید.

</div>
