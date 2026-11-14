<div dir="rtl">

[English version](010_errors_English.md)

# ۰۱۰ ـ Option، Result و طراحی خطا

[فهرست](../README_Persian.md) · [قبلی](009_collections_unicode_Persian.md) · [بعدی](011_traits_generics_Persian.md)

`Option<T>` نبودن مقدار را با `None` و وجود آن را با `Some(T)` بیان می‌کند. `Result<T,E>` موفقیت را با `Ok(T)` و خطا را با `Err(E)` بیان می‌کند. نبودن عضو map عموماً Option است؛ خطای خواندن فایل اطلاعات بیشتری می‌خواهد و Result مناسب است.

```rust
fn first_positive(values: &[i32]) -> Option<i32> {
    values.iter().copied().find(|value| *value > 0)
}
assert_eq!(first_positive(&[-1, 0, 2]), Some(2));
assert_eq!(first_positive(&[]), None);
```

## عملگر سؤال چه می‌کند؟

`?` در Result مقدار Ok را باز می‌کند و در Err زود برمی‌گردد؛ در صورت وجود تبدیل مناسب از `From`، نوع خطا را تبدیل می‌کند. در Option نیز None را زود بازمی‌گرداند. برای جابه‌جایی بین این دو باید صریح باشی: مثلاً `ok_or` نبودن را به خطا تبدیل می‌کند.

```rust
fn parse_nonzero(input: &str) -> Result<u16, &'static str> {
    let value = input.parse::<u16>().map_err(|_| "Invalid integer")?;
    if value == 0 { return Err("Value must not be zero"); }
    Ok(value)
}
assert!(parse_nonzero("0").is_err());
```

[مثال ۰۰۹](../examples/src/bin/009_errors.rs) خطای typed برای port می‌سازد: خطای parse را نگه می‌دارد، `Display` متن قابل‌خواندن می‌دهد و `Error::source` زنجیرهٔ علت را حفظ می‌کند. `From<ParseIntError>` اجازه می‌دهد `?` بدون نگاشت دستی کار کند.

```bat
cmd /c cargo run -p rust-lessons --bin 009_errors
```

خروجی `Port: 8080` است؛ ورودی صفر و ۶۵۵۳۶ باید Err باشند.

## انتخاب قرارداد خطا

در library، enum خطای عمومی به caller امکان تصمیم بر اساس variant می‌دهد؛ مقایسهٔ متن خطا قرارداد شکننده‌ای است. در binary کوچک، `Box<dyn Error>` برای جمع‌کردن خطاهای مختلف ساده است. در پروژه‌های بزرگ، ابزارهایی مثل thiserror یا anyhow می‌توانند boilerplate را کم کنند، اما جای طراحی مرز خطا را نمی‌گیرند.

`unwrap` و `expect` برای حالت واقعاً تضمین‌شده، تست یا مثال کنترل‌شده قابل توضیح‌اند؛ در مسیر ورودی کاربر، شبکه یا فایل معمولاً باید خطا مدیریت شود. panic عموماً نقص قرارداد داخلی است، نه پاسخ عادی به نامعتبر بودن ورودی. `catch_unwind` تمام خطاها یا panicهای حالت abort را مهار نمی‌کند.

توابع `map`، `and_then`، `unwrap_or_else` و `transpose` تبدیل ترکیب‌ها را ساده می‌کنند. خروجی `Iterator<Item = Result<T,E>>` را می‌توان به `Result<Vec<T>,E>` جمع کرد تا در نخستین خطا متوقف شود.

**تمرین:** ورودی portهای `abc`، `0`، `8080` و `65536` را دسته‌بندی کن. سپس در پروژهٔ انبار تست کن که خطای overflow موجودی را تغییر نمی‌دهد.

منبع: [Error Handling](https://doc.rust-lang.org/book/ch09-00-error-handling.html)، [Result](https://doc.rust-lang.org/std/result/).

</div>
