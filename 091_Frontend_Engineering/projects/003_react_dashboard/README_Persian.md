<div dir="rtl">

# داشبورد React و TypeScript

[English](README_English.md) · [دوره](../../README_Persian.md) · [اجرای کامل](../../RUNNING_Persian.md)

## هدف و پیش‌نیاز

کامپوننت دارای نوع، قرارداد reducer مشترک، فیلتر مشتق، بازخورد فرم و artifact production.

پیش‌نیاز: JavaScript، TypeScript، مبانی React و Node نسخهٔ ۲۴ یا جدیدتر. وابستگی‌ها در همین پروژه و lockfile آن مستقل‌اند.

## اجرا و ورودی

از ریشهٔ دوره اجرا کنید:

```bat
cmd /c "cd projects\003_react_dashboard && npm ci"
cmd /c "cd projects\003_react_dashboard && npm run build"
cmd /c node scripts/serve.mjs --duration=600
```

سپس http://127.0.0.1:4173/projects/003_react_dashboard/dist/index.html را باز کنید. ورودی نام کار و فیلتر All، Open یا Done است. سرور پس از ۶۰۰ ثانیه بسته می‌شود.

## خروجی و معیار پذیرش

دادهٔ اولیه دو کار با یک مورد تکمیل‌شده دارد. کار اضافه و Done را انتخاب کنید؛ فقط تکمیل‌شده‌ها می‌مانند. reload نمونهٔ اولیه را برمی‌گرداند چون state این مرجع ذخیره نمی‌شود.

با Tab و Enter همان کار را انجام دهید. در عرض باریک محتوای ضروری نباید از دست برود. متن شبیه HTML باید لفظی نمایش داده شود و کد اجرا نکند.

## بررسی

```bat
cmd /c node --test tests/core.test.mjs tests/server.test.mjs
cmd /c node scripts/check.mjs
```

پس از نصب ابزار اختیاری و ساخت React، cmd /c npm run e2e را از ریشه اجرا کنید. تست مرورگر همین مسیرهای قابل مشاهده را بررسی می‌کند. نصب، نتیجهٔ واقعی و محدودیت در [گزارش](../../VALIDATION_Persian.md) آمده است.

## محدودیت و تمرین تکمیلی

API، ذخیره، هویت، کتابخانهٔ routing و کش دادهٔ سرور ندارد. پس از مشخص کردن مالکیت، اعتبارسنجی و شکست، مرزها را یکی‌یکی اضافه کنید.

ابتدا معیار پذیرش و حالت شکست توسعهٔ انتخابی را بنویسید. منطق دامنه در lib و جزئیات UI در همین پروژه باقی بماند؛ همهٔ مثال‌ها محلی و آموزشی‌اند.

</div>
