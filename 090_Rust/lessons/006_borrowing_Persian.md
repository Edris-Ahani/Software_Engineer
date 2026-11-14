<div dir="rtl">

[English version](006_borrowing_English.md)

# ۰۰۶ ـ Reference، Borrowing و Slice

[فهرست](../README_Persian.md) · [قبلی](005_ownership_Persian.md) · [بعدی](007_lifetimes_Persian.md)

وقتی تابع فقط به داده نگاه می‌کند، بهتر است ownership را نگیرد. `&T` یک shared reference و `&mut T` یک exclusive reference است. در طول استفادهٔ referenceها، می‌توان چند shared borrow داشت یا یک exclusive borrow؛ نمی‌توان دسترسی هم‌پوشان ناسازگار به همان داده داشت.

```rust
fn byte_length(text: &str) -> usize { text.len() }
fn append_suffix(text: &mut String) { text.push_str(".log"); }
let mut filename = String::from("application");
let length = byte_length(&filename);
append_suffix(&mut filename);
assert_eq!(length, 11);
assert_eq!(filename, "application.log");
```

قرض‌گرفتن طول عمر owner را تغییر نمی‌دهد. reference نباید بیشتر از دادهٔ اشاره‌شده معتبر بماند. کامپایلر اغلب پایان borrow را از آخرین استفاده تشخیص می‌دهد؛ لازم نیست همیشه پایان block باشد.

```rust
let mut name = String::from("api");
let view = &name;
println!("{view}");
name.push_str("-v2");
```

اگر `view` را بعد از تغییر دوباره مصرف کنی، shared و mutable borrow هم‌پوشان می‌شوند و خطا می‌گیری. راه‌حل معمول کوتاه‌ترکردن استفاده از view یا جابه‌جایی ترتیب عملیات است، نه افزودن unsafe.

## Slice مالک داده نیست

`&[T]` یک view از دنباله است و طول نیز همراه آن است. `&mut [T]` تغییر عناصر را می‌دهد ولی افزایش طول Vec را نمی‌دهد. `&str` نیز view معتبر UTF-8 است؛ `String` ظرف مالک متن است. پارامتر `&str` هم string literal و هم `String` قرض‌گرفته‌شده را می‌پذیرد.

```rust
fn sum(values: &[u32]) -> u32 { values.iter().sum() }
let values = vec![10, 20, 30];
assert_eq!(sum(&values), 60);
assert_eq!(sum(&values[1..]), 50);
```

`&Vec<T>` معمولاً API محدودتری از `&[T]` است؛ مگر به قابلیت اختصاصی Vec نیاز داشته باشی، slice را بپذیر. تبدیل referenceهای سازگار با deref coercion بسیاری از فراخوانی‌ها را ساده می‌کند.

## دو بخش مستقل از یک داده

اگر دو mutable reference به indexهای Vec بسازی، compiler همیشه نمی‌تواند مستقل‌بودن indexها را ثابت کند. `split_at_mut` قرارداد استقلال دو slice را فراهم می‌کند:

```rust
let mut values = [1, 2, 3, 4];
let (left, right) = values.split_at_mut(2);
left[0] += 10;
right[0] += 20;
assert_eq!(values, [11, 2, 23, 4]);
```

در [مثال ۰۰۳](../examples/src/bin/003_borrowing.rs)، تابع تخفیف `&mut [u32]` می‌گیرد و `saturating_sub` مانع زیرصفررفتن می‌شود. دستور `cmd /c cargo run -p rust-lessons --bin 003_borrowing` خروجی `Rust: [70, 0, 270]` دارد. در محاسبهٔ مالی واقعی سیاست کمینه‌کردن در صفر باید تصمیم روشن دامنه باشد.

**تمرین:** تابعی بنویس که دو نیمهٔ یک slice را جداگانه تغییر دهد. سپس یک shared reference را عمداً بعد از تغییر mutable استفاده کن و متن خطای compiler را توضیح بده.

منبع: [References and Borrowing](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html)، [Slices](https://doc.rust-lang.org/book/ch04-03-slices.html).

</div>
