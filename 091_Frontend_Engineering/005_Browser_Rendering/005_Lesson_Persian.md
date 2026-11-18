<div dir="rtl">

# 005 — رندر مرورگر و موتور اجرا

[English](./005_Lesson_English.md) · [مسیر دوره](../README_Persian.md) · [راهنمای اجرا](../RUNNING_Persian.md)

## مفهوم و سازوکار

تجزیهٔ HTML درخت DOM را می‌سازد و CSS اطلاعات سبک را فراهم می‌کند. محاسبهٔ سبک، layout، paint و compositing این ساختار را به پیکسل تبدیل می‌کنند. تغییر هندسه ممکن است layout لازم داشته باشد؛ حرکت با transform یا opacity گاهی از آن جلوگیری می‌کند، ولی compositing تصمیم پیاده‌سازی مرورگر است و تضمین ندارد.

JavaScript و رندر برای زمان نخ اصلی رقابت می‌کنند. کار طولانی همگام، حتی با شبکهٔ سریع، ورودی و نمایش را عقب می‌اندازد. خواندن اندازه بلافاصله پس از نوشتن سبک ممکن است layout همگام اجباری ایجاد کند. خواندن‌ها را پیش از نوشتن‌ها گروه‌بندی، اندازهٔ DOM درگیر را کم و نتیجه را با trace اندازه‌گیری کنید. requestAnimationFrame زمان اجرای کار را پیش از فرصت رندر تعیین می‌کند و محاسبهٔ سنگین را ارزان نمی‌کند.

## خطاهای رایج

افزودن will-change به همهٔ عناصر منابع مصرف می‌کند و ممکن است سرعت را کاهش دهد. بین microtaskها نمایش فریم تضمین نمی‌شود.

## تمرین و معیار پذیرش

تغییر اندازهٔ grid را ضبط و حرکت با top را با transform مقایسه کنید. رخدادهای layout و paint را پیدا کنید.

## راهنمای حل

محتوا، محدودیت دستگاه و مدت را یکسان نگه دارید. تفاوت trace را توضیح دهید و سریع‌تر بودن همیشگی transform را فرض نکنید.

## کد مرتبط

- [002_responsive_layout.html](../examples/002_responsive_layout.html)
- [020_motion.html](../examples/020_motion.html)

[ورودی، خروجی و محدودیت نمونه‌ها](../examples/README_Persian.md)

## منبع رسمی

[مستندات اصلی](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work)

[قبلی](../004_Internet_HTTP_and_DNS/004_Lesson_Persian.md) · [بعدی](../006_Semantic_HTML/006_Lesson_Persian.md)

</div>
