<div dir="rtl">

# 021 — ناهمگامی، حلقهٔ رخداد و لغو

[English](./021_Lesson_English.md) · [مسیر دوره](../README_Persian.md) · [راهنمای اجرا](../RUNNING_Persian.md)

## مفهوم و سازوکار

کد همگام درون task تا پایان اجرا می‌شود. واکنش promise پس از پشتهٔ جاری و پیش از task بعدی به شکل microtask اجرا می‌شود. timer حداقل تأخیر را مشخص می‌کند، نه زمان دقیق. تابع async همیشه promise می‌دهد؛ await اجرای همان تابع را معلق می‌کند و کار پردازشی را به نخ دیگر منتقل نمی‌کند.

برای عملیات مستقل که همه باید موفق شوند Promise.all و برای نتیجه‌های مستقل allSettled به کار ببرید. هم‌زمانی دسته‌های بزرگ را محدود کنید. AbortController لغو را به API همکار اعلام می‌کند. لغو و جلوگیری از نتیجهٔ قدیمی دو مسئلهٔ مرتبط اما متفاوت‌اند؛ پاسخ ممکن است پیش از لغو برسد، پس مالک فعلی UI را نیز بررسی کنید.

## خطاهای رایج

forEach منتظر callback غیرهمگام نمی‌ماند. زنجیرهٔ بی‌پایان microtask می‌تواند رندر و timer را گرسنه نگه دارد.

## تمرین و معیار پذیرش

ترتیب log همگام، promise حل‌شده، queueMicrotask و setTimeout را پیش‌بینی کنید؛ سپس دو جست‌وجوی با پایان معکوس بسازید.

## راهنمای حل

ابتدا log همگام، سپس microtask صف‌شده و در پایان timer می‌آید. با شناسهٔ افزایشی درخواست، پاسخ جست‌وجوی قدیمی را نادیده بگیرید.

## کد مرتبط

- [007_event_loop.mjs](../examples/007_event_loop.mjs)
- [009_fetch.html](../examples/009_fetch.html)

[ورودی، خروجی و محدودیت نمونه‌ها](../examples/README_Persian.md)

## منبع رسمی

[مستندات اصلی](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)

[قبلی](../020_Modules_and_Error_Handling/020_Lesson_Persian.md) · [بعدی](../022_DOM_Events_and_Lifecycle/022_Lesson_Persian.md)

</div>
