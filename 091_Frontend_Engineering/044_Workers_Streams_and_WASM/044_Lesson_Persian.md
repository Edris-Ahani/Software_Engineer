<div dir="rtl">

# 044 — ورکر، استریم و WebAssembly

[English](./044_Lesson_English.md) · [مسیر دوره](../README_Persian.md) · [راهنمای اجرا](../RUNNING_Persian.md)

## مفهوم و سازوکار

Web Worker جاوااسکریپت را خارج نخ اصلی اجرا و با پیام ارتباط برقرار می‌کند؛ دسترسی مستقیم به DOM ندارد. structured clone دادهٔ پشتیبانی‌شده را کپی می‌کند؛ buffer قابل انتقال مالکیت را منتقل و buffer فرستنده را جدا می‌کند. جابه‌جایی عملیات کوچک ممکن است بیش از صرفه‌جویی هزینه داشته باشد؛ سریال‌سازی و شروع را حساب کنید.

ReadableStream پردازش تدریجی و backpressure را به‌جای بارگیری کل پاسخ در حافظه فراهم می‌کند. لغو و مرز decode میان chunkها را رعایت کنید. WebAssembly ماژول کامپایل‌شده را اجرا می‌کند و برای بعضی محاسبات سنگین یا کد native موجود مناسب است؛ جایگزین عمومی JavaScript مربوط به DOM نیست. حافظهٔ مشترک به isolation بیشتر و مراقبت از race نیاز دارد.

## خطاهای رایج

worker هزینهٔ کل CPU را حذف نمی‌کند. ارسال مکرر شیء عظیم می‌تواند سود پاسخ‌گویی را از بین ببرد.

## تمرین و معیار پذیرش

نمونهٔ جمع worker را هم‌زمان با کلیک کنترل دیگر اجرا کنید؛ با حلقه روی نخ اصلی مقایسه و سپس worker را terminate کنید.

## راهنمای حل

ورودی محدود بفرستید، داخل worker اعتبارسنجی کنید، همراه پاسخ id درخواست بدهید و با حذف مالک پاک‌سازی کنید.

## کد مرتبط

- [012_worker.html](../examples/012_worker.html)
- [013_sum_worker.mjs](../examples/013_sum_worker.mjs)

[ورودی، خروجی و محدودیت نمونه‌ها](../examples/README_Persian.md)

## منبع رسمی

[مستندات اصلی](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

[قبلی](../043_Caching_CDN_and_Delivery/043_Lesson_Persian.md) · [بعدی](../045_PWA_and_Offline/045_Lesson_Persian.md)

</div>
