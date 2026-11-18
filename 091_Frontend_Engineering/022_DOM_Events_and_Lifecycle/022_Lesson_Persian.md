<div dir="rtl">

# 022 — DOM، رخداد و چرخهٔ عمر

[English](./022_Lesson_English.md) · [مسیر دوره](../README_Persian.md) · [راهنمای اجرا](../RUNNING_Persian.md)

## مفهوم و سازوکار

DOM درخت زنده‌ای است که JavaScript آن را جست‌وجو و تغییر می‌دهد. برای متن ساده textContent و برای ساختار، عنصر بسازید. کوچک‌ترین زیردرخت مرتبط را جست‌وجو کنید. جایگزینی زیردرخت ممکن است focus، انتخاب متن ورودی و listener را حذف کند؛ هویت لازم برای تعامل را حفظ کنید.

رخداد از مرحلهٔ capture و bubbling عبور می‌کند. delegation یک listener روی والد پایدار می‌گذارد و با closest فرزند مناسب را می‌یابد؛ نوع عنصر و قرار گرفتن در ظرف را بررسی کنید. preventDefault عمل پیش‌فرض مرورگر را متوقف می‌کند و stopPropagation انتشار را قطع می‌کند و ممکن است handler دیگر را بشکند. هر کامپوننت به پاک‌سازی listener، timer، observer و کار معلق نیاز دارد.

## خطاهای رایج

گره جداشده از طریق listener یا closure نگه‌داشته‌شده می‌تواند در حافظه بماند. innerHTML با ورودی نامطمئن مرز تزریق می‌سازد.

## تمرین و معیار پذیرش

دکمهٔ افزایش و افزودن آیتم با فرم بسازید؛ هنگام تغییر شمارنده focus کنترل موجود را حفظ کنید.

## راهنمای حل

فقط متن شمارنده را تغییر دهید، گره تازه اضافه کنید و برای عمل آیتم از listener واگذارشده استفاده کنید. تابع dispose داشته باشید.

## کد مرتبط

- [008_dom_events.html](../examples/008_dom_events.html)

[ورودی، خروجی و محدودیت نمونه‌ها](../examples/README_Persian.md)

## منبع رسمی

[مستندات اصلی](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events)

[قبلی](../021_Async_Event_Loop_and_Cancellation/021_Lesson_Persian.md) · [بعدی](../023_Fetch_APIs_and_Resilience/023_Lesson_Persian.md)

</div>
