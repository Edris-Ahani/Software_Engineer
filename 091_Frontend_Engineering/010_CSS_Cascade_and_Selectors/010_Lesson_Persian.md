<div dir="rtl">

# 010 — آبشار و انتخابگرهای CSS

[English](./010_Lesson_English.md) · [مسیر دوره](../README_Persian.md) · [راهنمای اجرا](../RUNNING_Persian.md)

## مفهوم و سازوکار

CSS تعارض اعلان‌ها را با مبدأ، اهمیت، لایهٔ آبشار، specificity، نزدیکی محدوده در موارد مربوط و ترتیب منبع حل می‌کند. ارث‌بری موضوعی جداست؛ بعضی ویژگی‌ها از والد ارث می‌رسند و بعضی مقدار اولیه دارند. انتخابگر خاص‌تر همیشه در برابر مبدأ یا لایهٔ دیگر برنده نیست.

کلاس با specificity پایین و لایه‌های روشن برای reset، پایه، کامپوننت و utility انتخاب کنید. custom property در آبشار شرکت می‌کند و می‌تواند توکن فاصله و رنگ باشد. پیش از override تازه، computed style و اعلان خط‌خورده را در DevTools ببینید. تفاوت pseudo-class مانند :focus-visible و pseudo-element مانند ::before را بدانید؛ محتوای تولیدشده جای دستور ضروری نیست.

## خطاهای رایج

تکرار !important معمولاً مشکل مالکیت یا لایه‌بندی را پنهان می‌کند. متغیر CSS در محل استفاده حل می‌شود و ثابت کپی‌شده نیست.

## تمرین و معیار پذیرش

دو قانون متعارض دکمه را در لایه‌های متفاوت بگذارید. برنده را پیش‌بینی و رنگ محاسبه‌شده و علت آن را بررسی کنید.

## راهنمای حل

برای اعلان عادی، لایهٔ بعدی مستقل از specificity بر لایهٔ قبلی اولویت دارد؛ ترتیب لایه‌ها برای important معکوس است.

## کد مرتبط

- [002_responsive_layout.html](../examples/002_responsive_layout.html)

[ورودی، خروجی و محدودیت نمونه‌ها](../examples/README_Persian.md)

## منبع رسمی

[مستندات اصلی](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Introduction)

[قبلی](../009_Accessibility_Foundations/009_Lesson_Persian.md) · [بعدی](../011_Box_Model_and_Positioning/011_Lesson_Persian.md)

</div>
