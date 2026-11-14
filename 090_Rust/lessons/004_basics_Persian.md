<div dir="rtl">

[English version](004_basics_English.md)

# ۰۰۴ ـ متغیر، نوع، تابع و کنترل جریان

[فهرست](../README_Persian.md) · [قبلی](003_cargo_Persian.md) · [بعدی](005_ownership_Persian.md)

متغیر با `let` در حالت عادی immutable است. `mut` تغییر مقدار را مجاز می‌کند؛ shadowing با `let` نام قبلی را با binding جدید جایگزین می‌کند و حتی می‌تواند نوع را عوض کند. `const` مقدار compile-time با نوع صریح است؛ `static` محل ذخیره با عمر کل برنامه دارد و برای شروع جایگزین متغیر عادی نیست.

```rust
const MAX_RETRIES: u8 = 3;
let mut retries = 0_u8;
retries += 1;
let input = "42";
let input: u32 = input.parse().expect("The sample contains a valid number");
assert_eq!(input, 42);
assert!(retries <= MAX_RETRIES);
```

## انتخاب نوع

`i32` عدد صحیح علامت‌دار و `u32` بدون علامت است. `usize` برای اندازه و index وابسته به معماری است؛ برای شناسهٔ پایدار پروتکل به پهنای مشخص نیاز داری. `f32` و `f64` اعشاری تقریبی‌اند؛ مبلغ پول را با کوچک‌ترین واحد صحیح یا کتابخانهٔ decimal مناسب مدل کن. `bool` منطقی، `char` یک Unicode scalar value، tuple ترکیبی از نوع‌ها و array مجموعهٔ هم‌نوع با طول ثابت است.

```rust
let point: (i32, i32) = (10, 20);
let (x, y) = point;
let values: [u32; 3] = [1, 2, 3];
let repeated = [0_u8; 16];
assert_eq!(x + y, 30);
assert_eq!(values.len() + repeated.len(), 19);
```

تبدیل `as` ممکن است اطلاعات را قطع کند؛ برای ورودی غیرقابل اعتماد از `TryFrom` استفاده کن. در محاسبات حساس `checked_add`، `checked_mul` و خانوادهٔ آن‌ها خطای overflow را آشکار می‌کنند. بر رفتار متفاوت buildهای debug و release در overflow تکیه نکن.

## Expression و statement

Rust زبان expressionمحور است؛ `if` و block مقدار می‌دهند. سمی‌کالن آخرین expression را به statement تبدیل می‌کند و مقدار block معمولاً `()` می‌شود.

```rust
fn final_price(price: u32, discount: u32) -> u32 {
    price.saturating_sub(discount)
}
let label = if final_price(100, 20) > 0 { "paid" } else { "free" };
assert_eq!(label, "paid");
```

تابع پارامترهای نوع‌دار و خروجی بعد از `->` دارد. `return` برای خروج زودهنگام مفید است؛ در انتهای تابع expression کافی است. شرط `if` باید `bool` باشد؛ عدد خودبه‌خود true نمی‌شود.

## حلقه‌ها

`for` برای پیمایش iterator، `while` برای شرط و `loop` برای تکرار با خروج صریح است. `break` می‌تواند از `loop` مقدار برگرداند؛ label برای خروج از حلقهٔ بیرونی وجود دارد. `1..4` انتهای باز و `1..=4` انتهای بسته دارد.

```rust
let mut remaining = 3;
let result = loop {
    remaining -= 1;
    if remaining == 0 { break "done"; }
};
assert_eq!(result, "done");
for value in 1..=3 { println!("{value}"); }
```

مثال کامل [۰۰۱](../examples/src/bin/001_basics.rs) را با `cmd /c cargo run -p rust-lessons --bin 001_basics` اجرا کن. خروجی هزینهٔ کل `600` و ارسال `80` است.

**خطای رایج:** index خارج از محدوده panic می‌دهد. برای index پویا از `get` استفاده کن و `Option` را بررسی کن. ورودی کاربر را با `expect` نمونه‌ها پردازش نکن.

**تمرین:** هزینهٔ ارسال وزن بیش از ۱۰۰۰ گرم را در حالت express پیش‌بینی کن. تابعی بنویس که جمع قیمت‌های بزرگ را با `checked_add` محاسبه و در overflow مقدار `None` برگرداند.

منبع: [Common Programming Concepts](https://doc.rust-lang.org/book/ch03-00-common-programming-concepts.html).

</div>
