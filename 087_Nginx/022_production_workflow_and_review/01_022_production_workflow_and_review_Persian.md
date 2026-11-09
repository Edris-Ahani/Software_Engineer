[← فهرست و مسیر یادگیری](../README.md) | [English](01_022_production_workflow_and_review_English.md)

# 022 — روند استقرار، بازبینی و تمرین نهایی

<div dir="rtl">

## هدف و پیش‌نیاز
تغییر تنظیمات را قابل‌بازبینی و قابل‌برگشت کنید. پیش‌نیاز: بخش‌های ۰۰۱ تا ۰۱۹ و در صورت نیاز پروتکل‌های اختیاری یا mTLS. [آزمایشگاه مشترک](../_lab/nginx.conf) فایل ایستا، پراکسی، توزیع بار، کش، محدودیت، SSE و لاگ JSON را ترکیب می‌کند. محیط یادگیری HTTP محلی است؛ تولید عمومی TLS واقعی، سیاست دسترسی، وصله و تصمیم ظرفیت می‌خواهد.

## توالی قابل‌تکرار

۱. رفتار مطلوب را با درخواست نمونه، status، مسیر و هدر ثبت کنید.
۲. نسخه، ماژول و include را ببینید و artifact سالم قبلی را در کنترل نسخه نگه دارید.
۳. کوچک‌ترین محدوده را تغییر دهید و trust، جداسازی کش و مسیر secret را بازبینی کنید.
۴. با همان image، ماژول و فایل‌های محیط مقصد بررسی کنید.
۵. موفقیت، رد شدن مورد انتظار، بدنهٔ بزرگ، خرابی و بازیابی بک‌اند را بیازمایید.
۶. artifact بررسی‌شده را مستقر کنید، نحو را بسنجید، reload کنید و route عمومی را با بررسی گواهینامه بزنید.
۷. تأخیر، خطا، تلاش upstream و ظرفیت را ببینید؛ با تحقق معیار rollback نسخهٔ قبلی را برگردانید.

بررسی نحو جای آزمون رفتار را نمی‌گیرد. تفاوت image آزمایش با تولید می‌تواند دستور پشتیبانی‌نشده را پنهان کند.

</div>


```bash
# From 087_Nginx:
python _shared/validate_docs.py
docker compose -f _lab/compose.yaml config --quiet
docker compose -f _lab/compose.yaml up -d --wait
docker compose -f _lab/compose.yaml exec nginx nginx -t
python _lab/smoke_test.py
# Linux service rollout after staging validation:
sudo nginx -t && sudo systemctl reload nginx
curl -i https://app.example.com/healthz
```

<div dir="rtl">

## پرسش‌های بازبینی

| بخش | پرسش |
| --- | --- |
| مسیریابی | حذف/حفظ prefix عمدی است؟ regex آن را کنار می‌زند؟ |
| هویت | کدام peer هویت را تعیین می‌کند؟ مسیر مستقیم بک‌اند کنترل شده؟ |
| TLS | SAN/chain، مجوز کلید، تمدید و verify بک‌اند درست‌اند؟ |
| کش | فقط عمومی، auth/cookie مستثنا و tenant/query جدا هستند؟ |
| محدودیت | کلید IP، اندازه، burst و بودجهٔ timeout درست‌اند؟ |
| شکست | retry امن، artifact برگشت و drain/reconnect دارید؟ |
| لاگ | ID مشترک، زمان مفید و نگهداری محدود بدون secret دارید؟ |
| وابستگی | فایل، ماژول، DNS، گواهینامه و آمادگی بک‌اند حاضرند؟ |

validator ساختار، لینک و fence را می‌سنجد، نه معنای تنظیمات Nginx. smoke test آزمایشگاه را بررسی می‌کند. PHP، ACME عمومی، gRPC، QUIC و mTLS محیط گفته‌شدهٔ خود را نیاز دارند.

</div>

<div dir="rtl">

## سناریوهای نهایی و پاسخ
پس از انتشار، کاربر پروفایل کش‌شدهٔ کاربر دیگر را می‌بیند. ارائهٔ کش مشترک ناامن آن route را متوقف و سیاست سالم را برگردانید؛ کوتاه کردن TTL کافی نیست. طراحی کلید، تشخیص auth/cookie، هدر کش و هدرهای نادیده‌گرفته‌شده را ببینید. دادهٔ آسیب‌دیدهٔ کش را باطل و آزمون جلوگیری از اشتراک دادهٔ کاربران اضافه کنید.

آپلود محلی درست است ولی از دامنهٔ عمومی شکست می‌خورد: پاسخ دقیق و محدودیت بدنه/زمان هر لایه را مقایسه کنید؛ شاید CDN یا برنامه رد کرده باشد.

اکنون باید root/alias، اسلش proxy_pass، ترتیب location، termination/passthrough، bypass/no-cache، passive check و خطر retry را توضیح دهید. بگویید چرا هم‌زمانی یا timeout بیشتر می‌تواند اضافه‌بار را بدتر کند و پاسخ‌ها را با آزمایش نشان دهید.

</div>

<div dir="rtl">

## منابع رسمی

- [Official documentation index](https://nginx.org/en/docs/)
- [Reload behavior](https://nginx.org/en/docs/beginners_guide.html#control)

</div>
