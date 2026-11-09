[← فهرست و مسیر یادگیری](../README.md) | [English](01_010_upstreams_and_load_balancing_English.md)

# 010 — upstream، توزیع بار، keepalive و تلاش مجدد

<div dir="rtl">

## هدف و پیش‌نیاز
درخواست‌ها را توزیع کنید و رفتار شکست را امن تحلیل کنید. پیش‌نیاز: پراکسی و لاگ. مثال **قطعه‌ای در contextِ http** است. دو سرویس واقعی روی پورت‌های loopback لازم است؛ در شبکهٔ آزمایشگاه می‌توانید از `app1:8000` و `app2:8000` استفاده کنید.

</div>


```nginx
upstream application_pool {
    zone application_pool 64k;
    least_conn;
    server 127.0.0.1:3001 max_fails=2 fail_timeout=10s;
    server 127.0.0.1:3002 max_fails=2 fail_timeout=10s;
    keepalive 16;
}

server {
    listen 8084;
    location / {
        proxy_pass http://application_pool;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_connect_timeout 2s;
        proxy_read_timeout 15s;
        proxy_next_upstream error timeout http_502 http_503 http_504;
        proxy_next_upstream_tries 2;
    }
}
```

<div dir="rtl">

## انتخاب الگوریتم

| روش | کاربرد | محدودیت |
| --- | --- | --- |
| round robin وزن‌دار پیش‌فرض | هزینهٔ درخواست‌ها مشابه است | تناوب دقیق قابل‌مشاهده را تضمین نمی‌کند |
| `least_conn` | مدت درخواست‌ها متفاوت است | تعداد اتصال برابر مصرف CPU برنامه نیست |
| `ip_hash` | نیاز موقت به وابستگی IP | کاربران NAT یکجا می‌افتند و با تغییر IP جابه‌جا می‌شوند |
| `hash $key consistent` | نگاشت نسبتاً پایدار کلید | کلید مناسب و طراحی وضعیت خارجی لازم است |

`zone` مشترک به اشتراک وضعیت upstream میان workerها کمک می‌کند. `keepalive 16` کش اتصال بیکار برای هر worker است، نه سقف کل اتصال‌ها. خالی کردن Connection و HTTP/1.1 امکان استفادهٔ مجدد می‌دهد. تا حد امکان نشست و وضعیت ماندگار را بیرون از پردازش منفرد برنامه نگه دارید.

</div>


```bash
# From 087_Nginx, with the lab running:
python _lab/smoke_test.py
# Send requests one by one and inspect backend labels:
curl -s http://localhost:8080/api/hello
curl -s http://localhost:8080/api/hello
# Temporary failure experiment, then restore:
docker compose -f _lab/compose.yaml stop app1
curl -i http://localhost:8080/api/hello
docker compose -f _lab/compose.yaml start app1
```

<div dir="rtl">

## شکست و تلاش مجدد
`max_fails` و `fail_timeout` بر اساس ترافیک واقعی رفتار passive دارند و health check دوره‌ای فعال نیستند. قابلیت active check و الگوریتم‌های پیشرفته به نسخه، ماژول و ویرایش محصول وابسته است؛ دستور آموزش Plus را بدون بررسی وارد OSS نکنید.

read timeout فاصلهٔ بی‌فعالیتی بین خواندن‌ها را اندازه می‌گیرد، نه deadline کل درخواست. تلاش مجدد پرداخت یا POST ممکن است اثر را تکرار کند. `non_idempotent` را بدون طراحی فعال نکنید؛ از idempotency key برنامه و بودجهٔ مشخص تلاش مجدد استفاده کنید. بعد از رسیدن بایت‌های پاسخ به کلاینت، Nginx نمی‌تواند شفاف سرور را عوض کند.

## تمرین و پاسخ
چرا ممکن است درخواست دوم هم به همان بک‌اند برود؟ وضعیت worker، سیاست انتخاب و اتصال‌های فعال مؤثرند؛ صحت سیستم نباید وابسته به تناوب دقیق باشد. در یک نمونهٔ چنددرخواستی حضور چند هویت سالم و سپس failover و بازیابی را بررسی کنید.

</div>

<div dir="rtl">

## منابع رسمی

- [Upstream module](https://nginx.org/en/docs/http/ngx_http_upstream_module.html)
- [Retry conditions](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_next_upstream)

</div>
