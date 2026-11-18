<div dir="rtl">

# 040 — امنیت فرانت‌اند

[English](./040_Lesson_English.md) · [مسیر دوره](../README_Persian.md) · [راهنمای اجرا](../RUNNING_Persian.md)

## مفهوم و سازوکار

XSS زمانی رخ می‌دهد که محتوای تحت کنترل مهاجم مانند اسکریپت قابل اعتماد اجرا شود. نمایش متنی، escape متناسب با زمینه و در صورت نیاز HTML غنی، sanitizer نگهداری‌شده را ترجیح دهید. CSP اثر حمله را محدود می‌کند اما جای محل درج امن نیست. Trusted Types در مرورگر پشتیبان انتساب خطرناک DOM را محدود می‌کند.

CSRF از اعتبارنامهٔ خودکار مانند cookie برای درخواست ناخواسته سوءاستفاده می‌کند. دفاع شامل token بررسی‌شده در سرور، بررسی origin، ویژگی SameSite مناسب و معنای امن روش HTTP است. CORS به‌تنهایی دفاع CSRF نیست. پیش از redirect یا انتساب مقصد لینک، URL را بررسی کنید؛ طرح خطرناک را رد و در صورت نیاز origin مجاز را محدود کنید. اسکریپت شخص ثالث را کد دارای دسترسی به صفحه بدانید.

## خطاهای رایج

به بررسی نقش در فرانت‌اند برای مجوز اعتماد نکنید و خطای API را با innerHTML درج نکنید. sanitizer با regex نسازید.

## تمرین و معیار پذیرش

عنوان شبیه markup و نشانی بازگشت ناامن را در آزمایش محلی وارد کنید؛ نمایش لفظی عنوان و محدودیت مقصد را بررسی کنید.

## راهنمای حل

از textContent یا متن JSX استفاده، URL را نسبت به base مشخص parse و protocol و origin را بررسی کنید؛ مجوز مستقل در سرور اعمال شود.

## کد مرتبط

- [008_dom_events.html](../examples/008_dom_events.html)
- [index.html](../examples/../projects/002_persistent_board/index.html)

[ورودی، خروجی و محدودیت نمونه‌ها](../examples/README_Persian.md)

## منبع رسمی

[مستندات اصلی](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS)

[قبلی](../039_Frameworks_and_Web_Components/039_Lesson_Persian.md) · [بعدی](../041_Authentication_and_Sessions/041_Lesson_Persian.md)

</div>
