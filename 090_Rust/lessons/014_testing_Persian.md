<div dir="rtl">

[English version](014_testing_English.md)

# ۰۱۴ ـ تست مؤثر در Rust

[فهرست](../README_Persian.md) · [قبلی](013_modules_workspace_Persian.md) · [بعدی](015_smart_pointers_Persian.md)

تست باید رفتار قابل مشاهده یا قرارداد مهم را بررسی کند. پروژهٔ انبار فقط نتیجهٔ خطا را نمی‌سنجد؛ موجودی را هم بررسی می‌کند تا خطای overflow یا overselling باعث تغییر پنهان وضعیت نشده باشد.

| نوع تست | محل | چه چیزی را می‌سنجد؟ |
| --- | --- | --- |
| Unit | module با `#[cfg(test)]` | تابع یا جزء داخلی |
| Integration | `tests/*.rs` | API عمومی مثل یک مصرف‌کنندهٔ بیرونی |
| Doc test | کد در doc comment | قابل استفاده‌بودن نمونهٔ مستندات |

```rust
fn discounted(price: u32, discount: u32) -> u32 {
    price.saturating_sub(discount)
}
#[cfg(test)]
mod tests {
    use super::discounted;
    #[test]
    fn clamps_discount_at_zero() {
        assert_eq!(discounted(20, 30), 0);
    }
}
```

## بررسی پروژه‌ها از ریشهٔ دوره

```bat
cmd /c cargo test --workspace --offline
cmd /c cargo test -p inventory --offline
cmd /c cargo test -p log-search --offline
cmd /c cargo test -p rust-lessons --bin 017_unsafe --offline
cmd /c cargo test --workspace --doc --offline
cmd /c cargo test --manifest-path projects/003_async_api/Cargo.toml
```

فرمان آخر وابستگی خارجی لازم دارد. تست API از `Router::oneshot` استفاده می‌کند و پورت باز نمی‌کند؛ اختلاف وضعیت HTTP و body را بررسی می‌کند. در پروژهٔ جست‌وجو از `Cursor` به جای فایل و از writer خراب برای شبیه‌سازی BrokenPipe استفاده شده است.

## حالت‌هایی که ارزش تست دارند

- ورودی خالی، مقدار صفر و مقدار مرزی معتبر؛
- ورودی نامعتبر، UTF-8 خراب و خطای writer؛
- عدم تغییر state وقتی عملیات رد می‌شود؛
- تکرار عملیات و قرارداد idempotency، اگر وجود دارد؛
- خطاهای مستقل از موفقیت مسیر عادی.

`#[should_panic]` برای قراردادی که واقعاً panic می‌کند مناسب است؛ آن را برای ورودی عادی کاربر بهانه نکن. تست‌ها معمولاً موازی اجرا می‌شوند، پس environment variable، فایل ثابت و state سراسری می‌توانند flaky شوند. تست را با sleep تصادفی پایدار نکن؛ synchronization یا زمان مجازی runtime را به‌کار ببر.

کامپایل‌شدن تست به معنی اجراشدن تمام binaryها نیست. مثال‌های دارای assertion در main را جدا اجرا کن یا از اسکریپت بررسی دوره استفاده کن. همچنین `cargo test --all-targets` جای فرمان صریح doc test را برای مستندات نمی‌گیرد.

برای library پیچیده، property testing با proptest، fuzzing با cargo-fuzz و Miri برای بخشی از خطاهای unsafe مفیدند؛ این ابزارها نصب جداگانه و در مواردی nightly می‌خواهند. موفقیت آن‌ها اثبات کامل correctness نیست.

**تمرین:** تست موجودی دقیق، خرید دوم پس از اتمام و خطای جمع مبلغ را بخوان. یک writer بساز که در `flush` خطا می‌دهد و اثبات کن خطا در CLI library گم نمی‌شود.

منبع: [Testing](https://doc.rust-lang.org/book/ch11-00-testing.html)، [cargo test](https://doc.rust-lang.org/cargo/commands/cargo-test.html).

</div>
