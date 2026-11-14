<div dir="rtl">

[English version](019_macros_English.md)

# ۰۱۹ ـ Declarative و Procedural Macro

[فهرست](../README_Persian.md) · [قبلی](018_async_Persian.md) · [بعدی](020_advanced_types_Persian.md)

macro در زمان compile روی tokenها کار می‌کند و کد تولید می‌کند؛ تابع در زمان اجرا روی مقدارها کار می‌کند. تا وقتی تابع یا generic مشکل را ساده حل می‌کند، macro لازم نیست. `println!` و `vec!` از نمونه‌های آشنا هستند.

```rust
macro_rules! string_list {
    ($($value:expr),* $(,)?) => {
        vec![$(String::from($value)),*]
    };
}
let names = string_list!["api", "worker",];
assert_eq!(names.len(), 2);
```

در این الگو، `expr` یک expression می‌پذیرد، تکرار `*` صفر یا چند ورودی را پوشش می‌دهد و `$(,)?` ویرگول آخر اختیاری می‌دهد. fragmentهای دیگر شامل `ident`، `ty`، `path` و `tt` هستند. macro_rules قوانین hygiene دارد؛ نام‌های داخل macro را مانند متن سادهٔ چسبانده‌شده تصور نکن.

[مثال ۰۱۵](../examples/src/bin/015_macros.rs) را اجرا کن:

```bat
cmd /c cargo run -p rust-lessons --bin 015_macros
```

خروجی سه String برای `api`، `worker` و `scheduler` است. ترتیب و تعداد ارزیابی expressionهای ورودی اهمیت دارد؛ macroای که یک ورودی دارای side effect را چند بار درج می‌کند می‌تواند رفتار غیرمنتظره بسازد. کد تولیدشده را ساده و محدود نگه دار.

## سه شکل procedural macro

| شکل | ظاهر | کاربرد |
| --- | --- | --- |
| Derive | `#[derive(Serialize)]` | پیاده‌سازی trait بر اساس struct/enum |
| Attribute | `#[tokio::main]` | تبدیل یا گسترش item |
| Function-like | `custom!(...)` | تبدیل token به token با منطق اختصاصی |

برای نوشتن procedural macro معمولاً crate جدا با `proc-macro = true` لازم است. parse صحیح ساختار Rust و تولید diagnostic خوب دشوارتر از replace کردن متن است؛ ابزارهایی مانند syn و quote کمک می‌کنند. crate procedural macro روی host اجرا می‌شود، حتی اگر خروجی برای target دیگری باشد.

در API دوره، `Serialize` و `Deserialize` باعث پیاده‌سازی تبدیل JSON می‌شوند؛ این deriveها اعتبارسنجی معنایی title، محدودیت ظرفیت یا کنترل دسترسی را انجام نمی‌دهند. آن قراردادها در کد handler نوشته شده‌اند.

**تمرین:** macro فهرست را برای صفر ورودی با annotation `Vec<String>` اجرا کن و حالت تک‌ورودی و ویرگول انتهایی را بررسی کن. بعد توضیح بده چرا همین کاربرد را می‌توان با iterator هم نوشت و در کدام مورد macro خواناتر است.

منبع: [Macros](https://doc.rust-lang.org/book/ch20-05-macros.html)، [Procedural Macros](https://doc.rust-lang.org/reference/procedural-macros.html).

</div>
