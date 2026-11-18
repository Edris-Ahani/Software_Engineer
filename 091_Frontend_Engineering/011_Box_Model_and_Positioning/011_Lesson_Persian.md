<div dir="rtl">

# 011 — مدل جعبه، جریان و جای‌گذاری

[English](./011_Lesson_English.md) · [مسیر دوره](../README_Persian.md) · [راهنمای اجرا](../RUNNING_Persian.md)

## مفهوم و سازوکار

جعبه شامل محتوا، padding، border و margin است. با border-box، عرض اعلام‌شده padding و border را هم شامل می‌شود و محاسبهٔ اندازهٔ واکنش‌گرا ساده‌تر است. جریان عادی بلوک‌ها و متن inline را می‌چیند؛ overflow و اندازهٔ min-content بسیاری از خطاهای ظاهری عرض را توضیح می‌دهند.

relative جای اصلی عنصر را حفظ می‌کند؛ absolute آن را از جریان خارج و نسبت به containing block قرار می‌دهد. fixed و sticky مسئله‌های متفاوت حل می‌کنند؛ sticky به محفظهٔ اسکرول و فضای حرکت وابسته است. z-index درون stacking context عمل می‌کند که transform، opacity و ویژگی‌های دیگر می‌سازند. عدد بسیار بزرگ از stacking context والد خارج نمی‌شود.

## خطاهای رایج

چیدن کل صفحه با absolute با افزایش محتوا می‌شکند. والد با محفظهٔ اسکرول ناخواسته می‌تواند sticky را مختل کند.

## تمرین و معیار پذیرش

کارت دارای نشان، عنوان sticky و شناسهٔ طولانی بدون فاصله بسازید. بدون بریدن focus از اسکرول افقی جلوگیری کنید.

## راهنمای حل

محتوا در جریان عادی باشد، ظرف نشان relative شود، متن overflow-wrap داشته باشد و stacking context پوشاننده‌ها بررسی شود.

## کد مرتبط

- [002_responsive_layout.html](../examples/002_responsive_layout.html)

[ورودی، خروجی و محدودیت نمونه‌ها](../examples/README_Persian.md)

## منبع رسمی

[مستندات اصلی](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model)

[قبلی](../010_CSS_Cascade_and_Selectors/010_Lesson_Persian.md) · [بعدی](../012_Flexbox_and_Grid/012_Lesson_Persian.md)

</div>
