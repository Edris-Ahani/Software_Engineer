<div dir="rtl">

# 028 — بسته‌ها، ابزار ساخت و تحلیل کد

[English](./028_Lesson_English.md) · [مسیر دوره](../README_Persian.md) · [راهنمای اجرا](../RUNNING_Persian.md)

## مفهوم و سازوکار

package.json اسکریپت و بازهٔ وابستگی را تعریف و lockfile گراف نسخه‌های حل‌شده را ثبت می‌کند. npm ci از lockfile سازگار نصب می‌کند و در اختلاف manifest شکست می‌خورد. وابستگی runtime همراه برنامه یا برای اجراست؛ وابستگی development برای ساخت و بررسی است.

سرور توسعه ماژول را سریع ارائه و به‌روزرسانی می‌کند؛ ساخت production کد را برای هدف منتخب بسته‌بندی، تبدیل و بهینه می‌کند. tree shaking به ساختار ایستا و اطلاعات side effect وابسته است. تبدیل نحو، API مرورگر را خودکار polyfill و TypeScript را خودکار type-check نمی‌کند. قالب‌بندی برای یکدستی، lint برای الگوی مشکوک و فرمان مستقل برای نوع داشته باشید. مقدار جاسازی‌شده در bundle عمومی است، از جمله متغیر محیطی نمایان‌شده توسط ابزار.

## خطاهای رایج

بدون درک تغییر، شکست وابستگی را با حذف lockfile حل نکنید. رفتار سرور توسعه همان استقرار نیست.

## تمرین و معیار پذیرش

اسکریپت و خروجی پروژهٔ React را بررسی کنید؛ فرمان بررسی نوع، بسته‌بندی و علت نیاز npm ci به lockfile را توضیح دهید.

## راهنمای حل

typecheck و build صریح باشند، lockfile حل‌شده را ثبت و dist را جدا ارائه کنید تا مسیر دارایی production آزمایش شود.

## کد مرتبط

- [package.json](../examples/../projects/003_react_dashboard/package.json)

[ورودی، خروجی و محدودیت نمونه‌ها](../examples/README_Persian.md)

## منبع رسمی

[مستندات اصلی](https://vite.dev/guide/)

[قبلی](../027_Advanced_Types_and_Runtime_Schemas/027_Lesson_Persian.md) · [بعدی](../029_Debugging_and_DevTools/029_Lesson_Persian.md)

</div>
