<div dir="rtl">

# 025 — نشانی و مسیریابی کلاینت

[English](./025_Lesson_English.md) · [مسیر دوره](../README_Persian.md) · [راهنمای اجرا](../RUNNING_Persian.md)

## مفهوم و سازوکار

URL وضعیت ماندگار برنامه است؛ فیلتر، ترتیب و صفحه اغلب در search parameter قرار می‌گیرند تا نمای صفحه قابل اشتراک و بازیابی باشد. به‌جای چسباندن رشتهٔ escape‌نشده از URL و URLSearchParams استفاده کنید. fragment مقصد داخل صفحه را مشخص می‌کند و برای hash router سادهٔ ایستا نیز مناسب است.

History.pushState بدون navigation نشانی را تغییر می‌دهد؛ عقب و جلو رخداد popstate می‌سازند. SPA مسیرمحور به fallback سرور برای مسیر معتبر برنامه نیاز دارد، اما فایل گمشده باید واقعاً 404 بماند. مسیریابی باید focus، عنوان، انتظار و مسیر ناشناخته را مدیریت کند. کلیک با کلید کمکی، دانلود و ناوبری بیرونی را رهگیری نکنید.

## خطاهای رایج

راز یا دادهٔ شخصی را در URL قرار ندهید؛ در تاریخچه، گزارش، تحلیل و referrer دیده می‌شود.

## تمرین و معیار پذیرش

فیلد جست‌وجو را با q هماهنگ کنید؛ reload، کپی لینک و عقب رفتن میان دو جست‌وجوی ارسال‌شده را بررسی کنید.

## راهنمای حل

وضعیت اولیه را از URL بخوانید، با ارسال معنادار ورودی تاریخچه بسازید و در popstate فرم و نتیجه را بازیابی کنید.

## کد مرتبط

- [index.html](../examples/../projects/001_accessible_catalog/index.html)

[ورودی، خروجی و محدودیت نمونه‌ها](../examples/README_Persian.md)

## منبع رسمی

[مستندات اصلی](https://developer.mozilla.org/en-US/docs/Web/API/History_API)

[قبلی](../024_Storage_and_IndexedDB/024_Lesson_Persian.md) · [بعدی](../026_TypeScript_Fundamentals/026_Lesson_Persian.md)

</div>
