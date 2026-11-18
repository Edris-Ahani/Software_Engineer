<div dir="rtl">

# 055 — یکپارچه‌سازی و استقرار

[English](./055_Lesson_English.md) · [مسیر دوره](../README_Persian.md) · [راهنمای اجرا](../RUNNING_Persian.md)

## مفهوم و سازوکار

خط تحویل ساخت را از منبع و lockfile بازتولید و پیش از انتشار artifact، نوع، تست و خروجی را بررسی می‌کند. در صورت امکان یک بار بسازید و همان artifact را ارتقا دهید. تنظیم مرورگر عمومی است؛ اعتبارنامهٔ خصوصی روی زیرساخت قابل اعتماد بماند.

میزبانی ایستا دارایی ساخته‌شده و SSR محیط اجرای سازگار و ظرفیت می‌خواهد. SPA مسیرمحور fallback route لازم دارد ولی فایل گمشده باید 404 بماند. دارایی را پیش از تعویض HTML منتشر و فایل hashدار قدیمی را برای تب باز حفظ کنید. health check، انتشار تدریجی، پایش و rollback آزموده داشته باشید. preview محلی artifact را بررسی می‌کند و تنظیم سرور production نیست.

## خطاهای رایج

ساخت موفق درستی سرآیند، مسیر، redirect هویت یا invalidation CDN را ثابت نمی‌کند. روی هر سرور ساخت متفاوت انجام ندهید.

## تمرین و معیار پذیرش

برای React خط لوله با npm ci، typecheck، build، تست پایه، ذخیره artifact، smoke check و معیار rollback بنویسید.

## راهنمای حل

بررسی پیش از انتشار باشد، dist زیر base واقعی ارائه و بارگیری مستقیم route و بازیابی فایل گمشده سنجیده شود.

## کد مرتبط

- [package.json](../examples/../projects/003_react_dashboard/package.json)

[ورودی، خروجی و محدودیت نمونه‌ها](../examples/README_Persian.md)

## منبع رسمی

[مستندات اصلی](https://vite.dev/guide/static-deploy)

[قبلی](../054_Graphics_Animation_and_Specialized_APIs/054_Lesson_Persian.md) · [بعدی](../056_Observability_Analytics_and_Privacy/056_Lesson_Persian.md)

</div>
