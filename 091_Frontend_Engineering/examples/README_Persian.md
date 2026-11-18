<div dir="rtl">

# راهنمای مثال‌های اجرایی

[English](README_English.md) · [دوره](../README_Persian.md) · [نصب و اجرا](../RUNNING_Persian.md)

همهٔ مسیرها و فرمان‌ها از ریشهٔ دوره هستند. فایل mjs مستقل را با Node اجرا کنید؛ فایل worker فقط از نمونهٔ HTML مربوط بارگیری می‌شود. برای HTML سرور محدود محلی را اجرا و از صفحهٔ اصلی نمونه را باز کنید:

```bat
cmd /c node examples/003_values.mjs
cmd /c node scripts/serve.mjs --duration=600
```

| فایل | ورودی و روش | خروجی مورد انتظار |
| --- | --- | --- |
| [001_semantic_form.html](001_semantic_form.html) | مرورگر: ایمیل معتبر و نام | پیش‌نمایش محلی؛ ایمیل نامعتبر مانع ارسال |
| [002_responsive_layout.html](002_responsive_layout.html) | مرورگر: عرض 320 تا 1440 | تطبیق grid و شکستن شناسهٔ بلند |
| [003_values.mjs](003_values.mjs) | Node، سبد ثابت | 9700 سنت؛ تفاوت 0 و 10؛ رد مقدار منفی |
| [004_closures.mjs](004_closures.mjs) | Node، شمارندهٔ مستقل و دو فراخوانی سریع | 1 2 1 و سپس Settled: new |
| [005_objects.mjs](005_objects.mjs) | Node، تغییر نشانی بدون mutation | Berlin Hamburg و Address shared: false و Alex |
| [006_collections.mjs](006_collections.mjs) | Node، دستهٔ موجود و ناموجود | Accessories و Unknown؛ دو شناسهٔ یکتا |
| [007_event_loop.mjs](007_event_loop.mjs) | Node، callback زمان‌بندی‌شده | start، end، promise، microtask، timer |
| [008_dom_events.html](008_dom_events.html) | مرورگر: ارسال عنوان و حذف | متن لفظی، شمارنده و بازگشت focus |
| [009_fetch.html](009_fetch.html) | مرورگر: بارگیری، شکست و لغو | سه محصول؛ HTTP 503؛ وضعیت لغو |
| [010_types.ts](010_types.ts) | حذف نوع در Node؛ بررسی نوع جدا در پروژه | 1 products و 4500؛ پوشش همهٔ حالت‌ها |
| [011_storage.html](011_storage.html) | مرورگر: انتخاب theme | ذخیره یا پیام صادقانهٔ شکست |
| [012_worker.html](012_worker.html) | مرورگر: محاسبه و کلیک مستقل | 500000500000 و شمارندهٔ کلیک مستقل |
| [013_sum_worker.mjs](013_sum_worker.mjs) | فایل پشتیبان 012؛ حد 0 تا 10000000 | پیام id و مجموع؛ رد حد نامعتبر |
| [014_custom_element.html](014_custom_element.html) | مرورگر: افزایش custom element | افزایش شمارنده و مقدار؛ رخداد valuechange |
| [015_offline/index.html](015_offline/index.html) | مرورگر: ثبت، reload آنلاین و سپس آفلاین | یک سند آفلاین؛ در پایان حذف کش نام‌دار |
| [015_offline/016_service_worker.js](015_offline/016_service_worker.js) | worker پشتیبان، ثبت‌شده فقط در نمونهٔ آفلاین | کش نسخه‌دار یک سند؛ بدون کش API خصوصی |
| [017_canvas.html](017_canvas.html) | مرورگر: مقدار ثابت 3 و 5 و 2 | سه ستون و جدول معادل خوانا |
| [018_intl.html](018_intl.html) | مرورگر: en-US یا fa-IR و زمان ثابت UTC | ارز و تاریخ بومی؛ منطقهٔ Berlin و جهت صریح |
| [019_sse.html](019_sse.html) | مرورگر: دریافت سه رخداد | رخدادهای 1 تا 3 و بسته شدن اتصال |
| [020_motion.html](020_motion.html) | مرورگر: باز کردن بخش و تغییر کاهش حرکت | محتوای خوانا با حرکت اختیاری |

## محدودیت و روش بررسی

۲۰ فایل کد شامل ۱۸ ورودی مستقل و دو worker پشتیبان است. پایه‌ها کتابخانهٔ خارجی ندارند. نمونهٔ fetch به endpointهای محلی سرور وابسته است؛ لغو درخواست سریع ممکن است پس از پایان پاسخ برسد و وضعیت لغو همچنان صریح نمایش داده می‌شود. الگوریتم مجموع worker برای نمایش پیام‌رسانی است و فرمول بستهٔ O(1) برای محاسبهٔ واقعی این مجموع کارآمدتر است.

نمونهٔ ذخیره فقط preference نگه می‌دارد و credential ندارد. در نمونهٔ آفلاین فقط index.html کش می‌شود؛ CSS و لینک خانه در آفلاین تضمین ندارند و بازدید اول بدون شبکه کار نمی‌کند. برای خروج، حذف کش را بزنید و تب را ببندید. canvas جدول جایگزین دارد و سامانهٔ نمودار کامل نیست. قالب دقیق Intl ممکن است با دادهٔ locale و نسخهٔ مرورگر کمی تغییر کند.

کد TypeScript با اجرای Node بررسی نوع نمی‌شود؛ فرمان typecheck پروژهٔ React آن را نیز شامل می‌شود. در browser Console نباید خطای اجرا برای مسیر آزمایش‌شده وجود داشته باشد. تست خودکار، برخی مسیرها را در Chromium می‌سنجد؛ نمایش، screen reader، service worker و موتورهای دیگر به بررسی تکمیلی نیاز دارند. [گزارش](../VALIDATION_Persian.md) نتیجهٔ واقعاً اجراشده را جدا می‌کند.

## ادامهٔ تمرین

به نمونهٔ DOM اعتبارسنجی اضافی، به fetch پاسخ با schema خراب، به worker لغو محاسبه و به کاتالوگ فیلتر دسته اضافه کنید. پیش از تغییر خروجی قابل مشاهده و حالت شکست را بنویسید، سپس فقط بررسی مرتبط را اجرا کنید.

</div>
