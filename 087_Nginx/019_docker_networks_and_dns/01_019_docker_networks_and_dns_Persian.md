[← فهرست و مسیر یادگیری](../README.md) | [English](01_019_docker_networks_and_dns_English.md)

# 019 — Docker، DNS سرویس و تنظیمات قابل‌بازتولید

<div dir="rtl">

## هدف و پیش‌نیاز
محیط آموزشی کامل را اجرا کنید و شبکهٔ کانتینر را بفهمید. پیش‌نیاز: Docker Engine/Desktop با Linux containers و Compose نسخهٔ ۲. آزمایشگاه فقط `127.0.0.1:8080` هاست را bind می‌کند و پورت بک‌اند به هاست منتشر نمی‌شود. دستورها را از `087_Nginx` اجرا کنید.

</div>


```bash
docker compose -f _lab/compose.yaml config --quiet
docker compose -f _lab/compose.yaml up -d --wait
docker compose -f _lab/compose.yaml exec nginx nginx -t
python _lab/smoke_test.py
docker compose -f _lab/compose.yaml logs --tail=30 nginx
# After editing the mounted Nginx configuration:
docker compose -f _lab/compose.yaml exec nginx nginx -t
docker compose -f _lab/compose.yaml exec nginx nginx -s reload
# Finish the lab:
docker compose -f _lab/compose.yaml down
```

<div dir="rtl">

## توضیح آدرس‌دهی
در شبکهٔ Compose، آدرس `app1:8000` به کانتینر بک‌اند می‌رسد. `localhost:8000` داخل Nginx به خود کانتینر Nginx اشاره می‌کند. `ports` پورت را به هاست منتشر می‌کند؛ ارتباط داخلی سرویس‌ها نیازمند انتشار پورت بک‌اند نیست. قبل از استقرار اینترنتی مرز شبکه باید بررسی شود؛ این مجموعه محیط یادگیری محلی است.

فایل اصلی `nginx.conf`، HTML و سورس بک‌اند به‌صورت read-only mount می‌شوند. کش در لایهٔ قابل‌نوشتن کانتینر است، شاید در stop/start باقی بماند ولی با recreate از بین می‌رود. دیتابیس و دادهٔ ماندگار کاربر وجود ندارد. بک‌اند فقط از کتابخانهٔ استاندارد Python استفاده می‌کند.

</div>

<div dir="rtl">

## آمادگی شروع و تغییر DNS
`depends_on` به‌تنهایی فقط ترتیب اجراست و آمادگی برنامه را ثابت نمی‌کند. آزمایشگاه health check بک‌اند و `condition: service_healthy` دارد. health check خود Nginx فقط `/healthz` را بررسی می‌کند؛ smoke test مسیر برنامه را هم می‌آزماید.

نام literal upstream هنگام بارگذاری تنظیمات resolve می‌شود. اگر بک‌اند با IP جدید recreate شد، پس از سالم شدن آن Nginx را reload کنید. نسخه‌های جدید OSS قابلیت‌های بیشتری برای DNS پویای upstream دارند ولی نحو و پیش‌نیاز نسخه باید بررسی شود. فرض نکنید همهٔ نسخه‌های قدیمی در هر درخواست hostname را تازه resolve می‌کنند. برای reset آزمایشگاه کل stack را down/up کنید تا نام‌ها تازه resolve شوند.

</div>


```yaml
# Structural excerpt; the full runnable file is _lab/compose.yaml.
services:
  nginx:
    image: nginx:stable-alpine
    ports:
      - "127.0.0.1:8080:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
  app1:
    image: python:3.13-alpine
    command: ["python", "/app/backend.py"]
```

<div dir="rtl">

## بازتولید و تمرین
قطعهٔ بالا توضیحی است و dependency، environment، health check و mount بک‌اند را ندارد؛ فایل کامل را اجرا کنید. tagهایی مثل `stable-alpine` با گذشت زمان جابه‌جا می‌شوند. قبل از استقرار تولید، نسخهٔ پشتیبانی‌شده و وصله‌شده انتخاب کنید، digest تصویر بررسی‌شده را pin و build ماژول‌ها را ثبت کنید. آزمایشگاه ادعای نسخهٔ ثابت به‌عنوان «آخرین نسخه» ندارد.

تمرین: Docker می‌گوید pipe/socket موتور لینوکس وجود ندارد. آیا تغییر nginx.conf کمک می‌کند؟ خیر؛ موتور Docker/Desktop را اجرا و `docker version` را بررسی کنید، سپس Compose بزنید. اگر پورت ۸۰۸۰ اشغال است، پورت هاست را تغییر دهید و `--base-url` متناظر را به smoke test بدهید.

</div>

<div dir="rtl">

## منابع رسمی

- [Upstream name resolution](https://nginx.org/en/docs/http/ngx_http_upstream_module.html)
- [Nginx build options](https://nginx.org/en/docs/configure.html)

</div>
