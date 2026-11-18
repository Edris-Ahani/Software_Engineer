<div dir="rtl">

# 034 — اثرها، ref و پاک‌سازی

[English](./034_Lesson_English.md) · [مسیر دوره](../README_Persian.md) · [راهنمای اجرا](../RUNNING_Persian.md)

## مفهوم و سازوکار

effect کامپوننت commit‌شده را با سامانهٔ بیرونی مانند subscription، timer یا API مرورگر هماهنگ می‌کند. ابزار پیش‌فرض محاسبهٔ فهرست فیلترشده یا پاسخ به عمل کاربر نیست. dependency مقدار واکنشی مصرف‌شده را توصیف می‌کند؛ حذف آن رفتار قدیمی می‌سازد.

cleanup پیش از اجرای دوباره و هنگام unmount، setup را خنثی می‌کند. Strict Mode توسعه ممکن است عمداً setup و cleanup را تکرار کند تا هماهنگی ناامن آشکار شود. ref مقدار قابل تغییر را بدون render نگه می‌دارد و می‌تواند به گره DOM اشاره کند؛ تغییر ref.current رابط را به‌روز نمی‌کند. در effect غیرهمگام هم کار را لغو و هم پاسخ نامتعلق به render جاری را نادیده بگیرید.

## خطاهای رایج

خاموش کردن قانون dependency معمولاً مشکل مدل را می‌پوشاند. cleanup نباید کار مالک جدیدتر را خنثی کند.

## تمرین و معیار پذیرش

subscription رخداد window و بارگذاری قابل لغو اضافه کنید؛ چند بار mount، تغییر dependency و unmount انجام دهید.

## راهنمای حل

ثبت و حذف listener متناظر، AbortController مخصوص setup و پرچم مالکیت یا id درخواست پیش از اعمال پاسخ داشته باشید.

## کد مرتبط

- [009_fetch.html](../examples/009_fetch.html)

[ورودی، خروجی و محدودیت نمونه‌ها](../examples/README_Persian.md)

## منبع رسمی

[مستندات اصلی](https://react.dev/learn/synchronizing-with-effects)

[قبلی](../033_React_State_and_Reducers/033_Lesson_Persian.md) · [بعدی](../035_React_Performance_and_Suspense/035_Lesson_Persian.md)

</div>
