<div dir="rtl">

[English version](028_projects_English.md)

# ۰۲۸ ـ سه پروژهٔ کاربردی، قدم‌به‌قدم

[فهرست](../README_Persian.md) · [قبلی](027_troubleshooting_Persian.md) · [بعدی](029_exercises_Persian.md)

هدف این درس حفظ‌کردن فایل آماده نیست. ابتدا قرارداد هر پروژه را بنویس، سپس با نگاه به راهنما پیاده‌سازی کن و در پایان کد خودت را با نسخهٔ دوره مقایسه کن.

## پروژهٔ ۰۰۱: جست‌وجوی لاگ

قرارداد: query غیرخالی و فایل متنی ورودی‌اند؛ خروجی فقط خطوط matchشده با شمارهٔ یک‌مبنایی است. نبود match خطای I/O نیست و exit code متفاوت دارد.

۱. تابعی روی `BufRead` و `Write` بنویس تا تست از فایل واقعی مستقل باشد.
۲. خط‌ها را با enumerate بخوان؛ خطای خواندن و نوشتن را با `?` عبور بده.
۳. SearchOptions بساز و query خالی را رد کن.
۴. flag نوع ASCII را اضافه کن و نامش را دقیق انتخاب کن.
۵. main را به parsing آرگومان، بازکردن فایل و نگاشت exit code محدود کن.
۶. ورودی خالی، CRLF، خطای UTF-8 و writer خراب را تست کن.

```bat
cmd /c cargo run -p log-search -- ERROR projects/001_log_search/data/sample.log
cmd /c cargo test -p log-search --offline
```

[راهنمای پروژه و خروجی](../projects/001_log_search/README_Persian.md). توسعهٔ بعدی: محدودیت طول خط، `--count`، چند فایل و parser آرگومان استاندارد. هر گزینه قرارداد و تست مستقل لازم دارد.

## پروژهٔ ۰۰۲: موجودی بدون تغییر ناقص

قرارداد: SKU یکتا، quantity مثبت، موجودی کافی و مبلغ بدون overflow. اگر رزرو رد شد، هیچ موجودی نباید تغییر کند.

۱. InventoryError را با variantهای قابل تصمیم تعریف کن.
۲. Product را private نگه دار و فقط getter لازم بده.
۳. پیش از کم‌کردن موجودی، quantity، موجودی و `checked_mul` مبلغ را بررسی کن.
۴. duplicate SKU نباید محصول قبلی را overwrite کند.
۵. failure و state پس از failure را با هم تست کن.

```bat
cmd /c cargo run -p inventory
cmd /c cargo test -p inventory --offline
```

[راهنمای انبار](../projects/002_inventory/README_Persian.md). این یک عملیات حافظه‌ای تک‌فرایندی است؛ برای چند فروشگاه یا replica، consistency دیتابیس و تراکنش لازم می‌شود. نام reserve در این مثال کم‌کردن قطعی موجودی است و انقضا، پرداخت یا rollback ندارد.

## پروژهٔ ۰۰۳: HTTP API و صف async

قرارداد: health، ایجاد task، فهرست، خواندن و تکمیل task. title معتبر، ظرفیت محدود، خروجی JSON و خطاهای HTTP مشخص باشند.

۱. DTO ورودی و خروجی را جدا تعریف کن.
۲. router را در lib بساز تا تست بدون socket انجام شود.
۳. handler فقط قفل کوتاه حافظه بگیرد و guard را از await عبور ندهد.
۴. body، طول title و تعداد taskها را محدود کن.
۵. main فقط listener و shutdown را مدیریت کند.
۶. ابتدا با `oneshot` تست کن، سپس طبق راهنما در ترمینال خودت اجرا کن.

```bat
cmd /c cargo test --manifest-path projects/003_async_api/Cargo.toml
cmd /c cargo run --manifest-path projects/003_async_api/Cargo.toml --bin 001_bounded_jobs
```

[راهنمای API، درخواست‌های curl و محدودیت‌ها](../projects/003_async_api/README_Persian.md). داده‌ها در restart از بین می‌روند؛ پروژهٔ آموزشی آمادهٔ انتشار عمومی نیست.

## معیار آمادگی برای پروژهٔ شخصی

باید بتوانی مالک داده را مشخص کنی، بدون clone بی‌دلیل خطاهای borrow را حل کنی، ورودی نامعتبر را با Result مدل کنی، مرز I/O را تست کنی و محدودیت هم‌زمانی را توضیح بدهی. اگر این موارد روشن نیست، ابتدا پروژهٔ جست‌وجو را با دست و بدون کپی بازسازی کن.

</div>
