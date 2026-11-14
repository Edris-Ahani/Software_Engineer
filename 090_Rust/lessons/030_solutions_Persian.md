<div dir="rtl">

[English version](030_solutions_English.md)

# ۰۳۰ ـ پاسخ‌ها و تحلیل راه‌حل

[فهرست](../README_Persian.md) · [قبلی: تمرین‌ها](029_exercises_Persian.md) · [بعدی](031_glossary_resources_Persian.md)

کدهای لینک‌شده پاسخ اجرایی تمرین‌های پایه‌اند. با تغییر یک ورودی و توضیح خروجی، مطمئن شو فقط نسخهٔ آماده را اجرا نکرده‌ای.

| تمرین | پیاده‌سازی مرجع | نکتهٔ اصلی |
| --- | --- | --- |
| ۰۰۱ | [هزینهٔ ارسال](../examples/src/bin/001_basics.rs) | if یک expression است؛ دو شاخه نوع یکسان دارند |
| ۰۰۲ | قطعهٔ همین درس | borrowing ورودی، مالکیت خروجی |
| ۰۰۳ | [تخفیف](../examples/src/bin/003_borrowing.rs) | slice mutable و تفریق saturating |
| ۰۰۴ | [header](../examples/src/bin/004_lifetimes.rs) | خروجی به buffer caller وابسته است |
| ۰۰۵ | [سفارش](../examples/src/bin/005_models.rs) | enum داده‌دار و validation پیش از mutation |
| ۰۰۶ | [collection](../examples/src/bin/007_collections.rs) | entry و BTreeMap برای ترتیب نمایش |
| ۰۰۷ | [متن](../examples/src/bin/008_strings.rs) | byte با scalar value یکی نیست |
| ۰۰۸ | [port](../examples/src/bin/009_errors.rs) | Result، From و زنجیرهٔ علت |
| ۰۰۹ | [notifier](../examples/src/bin/010_traits.rs) | trait object برای collection ناهمگون |
| ۰۱۰ | [iterator](../examples/src/bin/011_iterators.rs) | iter و copied، بدون مصرف Vec |
| ۰۱۱ | [درخت](../examples/src/bin/012_smart_pointers.rs) | جهت معکوس Weak است |
| ۰۱۲ | [thread](../examples/src/bin/013_threads.rs) | join و محافظت update |
| ۰۱۳ | [channel](../examples/src/bin/014_channels.rs) | مصرف هم‌زمان و بسته‌شدن همهٔ senderها |
| ۰۱۴ | [typestate](../examples/src/bin/016_advanced_types.rs) | publish مالکیت Draft را مصرف می‌کند |
| ۰۱۵ | [unsafe wrapper](../examples/src/bin/017_unsafe.rs) | proof پیش‌شرط‌ها و تست مرز |
| ۰۱۶ | [انبار](../projects/002_inventory/src/lib.rs) و [تست](../projects/002_inventory/tests/reservations.rs) | تمام خطاها پیش از mutation بررسی می‌شوند |
| ۰۱۷ | [جست‌وجو](../projects/001_log_search/src/lib.rs) و [تست](../projects/001_log_search/tests/search.rs) | مرز I/O با trait؛ انتشار خطا |
| ۰۱۸ | [API](../projects/003_async_api/src/lib.rs) و [تست](../projects/003_async_api/tests/http.rs) | تست Router بدون پورت |
| ۰۱۹ | [صف async](../projects/003_async_api/src/bin/001_bounded_jobs.rs) | ظرفیت محدود، timeout و JoinSet |
| ۰۲۰ | [تبدیل و Cow](../examples/src/bin/021_conversions.rs) | allocation فقط هنگام نیاز به تغییر |

## پاسخ تمرین ۰۰۲

```rust
fn normalize_name(name: &str) -> String {
    name.trim().to_lowercase()
}
let original = String::from("  ALICE  ");
let normalized = normalize_name(&original);
assert_eq!(normalized, "alice");
assert_eq!(original, "  ALICE  ");
```

ورودی مصرف نمی‌شود؛ lowercase خروجی مالک ایجاد می‌کند. اگر هدف تنها trim باشد، خروجی `&str` می‌تواند بدون allocation به همان buffer اشاره کند. لازم نیست برای هر تابع خروجی String داشته باشیم.

## تحلیل تمرین‌های توسعه

**count:** قرارداد mode را با enum مثل Lines/Count مشخص کن. تابع پردازش می‌تواند count را بازگرداند و writer را بر اساس mode استفاده کند؛ تست stdout عادی و count را جدا کن. خطای flush نباید پنهان شود.

**رزرو چندقلمی:** ابتدا درخواست را بر اساس SKU تجمیع کن و overflow جمع quantity را کنترل کن. مرحلهٔ اول بدون mutation برای همهٔ اقلام برنامهٔ رزرو می‌سازد و جمع مبلغ را با checked arithmetic بررسی می‌کند. مرحلهٔ دوم فقط وقتی تمام برنامه معتبر شد اجرا می‌شود. برای storage بیرونی این دو مرحله باید در تراکنش معتبر یا عملیات اتمیک مناسب باشند؛ اعتبارسنجی محلی جلوی تغییر هم‌زمان دیتابیس را نمی‌گیرد.

**حد طول خط:** buffer محدود و خواندن مرحله‌ای با سقف مشخص انتخاب کن. اگر طول از حد گذشت، قرارداد باید بگوید عملیات متوقف می‌شود یا باقی خط دور ریخته می‌شود. سقف را پیش از allocation نامحدود اعمال کن و خط بدون newline را هم تست کن.

**API پایدار:** handler را از repository جدا کن؛ نتیجهٔ دامنه را به status نگاشت کن. در سطح ذخیره‌سازی از constraint، transaction و update شرطی استفاده کن. تست race باید invariant «موجودی منفی نشود و فروش اضافه رخ ندهد» را بررسی کند، نه ترتیب تصادفی اجرای دو request.

**async:** timeout future نمی‌تواند thread درگیر محاسبهٔ بی‌وقفه را به‌زور preempt کند. drop کردن JoinHandle معمولاً task را detach می‌کند؛ JoinSet با drop شدن taskهایش را abort می‌کند. حتی abort هم side effect انجام‌شده را برنمی‌گرداند و کار spawn_blocking در حال اجرا قرارداد متفاوتی دارد.

بهبود معتبر باید همراه حفظ خروجی و رفتار خطا باشد. برای «سریع‌ترشدن» بدون اندازه‌گیری و برای «ایمن‌شدن» صرفاً با عبور چند تست نتیجه‌گیری نکن.

</div>
