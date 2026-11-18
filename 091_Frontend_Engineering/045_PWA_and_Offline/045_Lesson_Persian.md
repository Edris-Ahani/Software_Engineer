<div dir="rtl">

# 045 — وب‌اپ پیش‌رونده و آفلاین

[English](./045_Lesson_English.md) · [مسیر دوره](../README_Persian.md) · [راهنمای اجرا](../RUNNING_Persian.md)

## مفهوم و سازوکار

service worker واسطهٔ شبکهٔ رخدادمحور با چرخهٔ نصب، انتظار، فعال‌سازی و به‌روزرسانی است. به secure context نیاز دارد و localhost برای توسعه استثنا دارد. manifest فرادادهٔ وب‌اپ را می‌دهد؛ نصب‌پذیری و قابلیت با مرورگر فرق می‌کند. رفتار آفلاین باید طراحی شود و از manifest به دست نمی‌آید.

برای دارایی ایستای نسخه‌دار cache-first، برای بعضی سندهای حساس به تازگی network-first و برای دادهٔ خصوصی قانون صریح داشته باشید. همهٔ درخواست‌ها را بی‌قید کش نکنید. mutation آفلاین صف ماندگار، id عملیات، بودجهٔ تلاش و حل تعارض هنگام بازگشت شبکه می‌خواهد. navigator.onLine فقط نشانه است و دسترسی به API را ثابت نمی‌کند.

## خطاهای رایج

فعال‌سازی فوری اجباری می‌تواند صفحهٔ باز وابسته به دارایی قدیمی را خراب کند. دادهٔ آفلاین کاربر را هنگام خروج پاک و سهمیه را رعایت کنید.

## تمرین و معیار پذیرش

فقط سند نمونهٔ آفلاین را کش کنید؛ یک بار آنلاین بارگیری، آفلاین reload و سپس worker و کش نام‌دار را حذف کنید.

## راهنمای حل

scope اختصاصی و نام کش نسخه‌دار بگذارید؛ محدودیت بازدید اول و تفاوت کش HTTP با کش worker را توضیح دهید.

## کد مرتبط

- [index.html](../examples/015_offline/index.html)
- [016_service_worker.js](../examples/015_offline/016_service_worker.js)

[ورودی، خروجی و محدودیت نمونه‌ها](../examples/README_Persian.md)

## منبع رسمی

[مستندات اصلی](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

[قبلی](../044_Workers_Streams_and_WASM/044_Lesson_Persian.md) · [بعدی](../046_Realtime_SSE_WebSocket_and_WebRTC/046_Lesson_Persian.md)

</div>
