<div dir="rtl">

# 035 — کارایی React و Suspense

[English](./035_Lesson_English.md) · [مسیر دوره](../README_Persian.md) · [راهنمای اجرا](../RUNNING_Persian.md)

## مفهوم و سازوکار

پیش از memo کردن، هزینهٔ تعامل را اندازه بگیرید. بالا بردن بی‌دلیل state، مقدار ناپایدار Context، فهرست بزرگ و محاسبهٔ گران می‌توانند غالب باشند. memo، useMemo و useCallback ابزار بهینه‌سازی با هزینهٔ خود هستند؛ درستی نباید به حفظ مقدار memo وابسته باشد.

transition تغییر کم‌فوریت را علامت می‌زند تا ورودی فوری پاسخ‌گو بماند. deferred value اجازه می‌دهد نمای کند از ورودی جدید عقب بماند. هیچ‌کدام محاسبه را به worker منتقل نمی‌کند. Suspense نمایش جایگزین را برای کد lazy یا منبع دادهٔ سازگار هماهنگ می‌کند؛ fetch معمولی در useEffect خودکار suspend نمی‌شود. Error Boundary شکست render فرزند را می‌گیرد، نه هر خطای handler یا عملیات غیرهمگام را.

## خطاهای رایج

memo کردن همهٔ تابع‌ها ممکن است بدون کاهش render پیچیدگی اضافه کند. fallback جایگزین کل صفحه می‌تواند تجربه را مختل کند.

## تمرین و معیار پذیرش

فیلتر فهرست بزرگ را profile کنید؛ دادهٔ کمتر، virtualization و تأخیر نتیجه با ورودی فوری را مقایسه کنید.

## راهنمای حل

trace پیش و پس را ثبت کنید؛ کوچک‌ترین تغییر کاهندهٔ کار اندازه‌گیری‌شده را انتخاب و نشان انتظار دسترس‌پذیر را حفظ کنید.

## کد مرتبط

- [main.tsx](../examples/../projects/003_react_dashboard/src/main.tsx)

[ورودی، خروجی و محدودیت نمونه‌ها](../examples/README_Persian.md)

## منبع رسمی

[مستندات اصلی](https://react.dev/reference/react/useTransition)

[قبلی](../034_Effects_Refs_and_Cleanup/034_Lesson_Persian.md) · [بعدی](../036_Server_State_Forms_and_Data/036_Lesson_Persian.md)

</div>
