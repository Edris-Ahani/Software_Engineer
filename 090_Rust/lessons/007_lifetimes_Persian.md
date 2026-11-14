<div dir="rtl">

[English version](007_lifetimes_English.md)

# ۰۰۷ ـ Lifetime بدون حفظ‌کردن نشانه‌ها

[فهرست](../README_Persian.md) · [قبلی](006_borrowing_Persian.md) · [بعدی](008_models_patterns_Persian.md)

Lifetime مدت اعتبار یک reference است. annotation با نامی مثل `'a` رابطهٔ اعتبار referenceها را بیان می‌کند؛ عمر داده را افزایش نمی‌دهد و چیزی را در runtime زنده نگه نمی‌دارد. compiler اغلب با قواعد elision رابطه را استنتاج می‌کند.

```rust
fn first_word(text: &str) -> &str {
    text.split_whitespace().next().unwrap_or("")
}
```

تنها reference ورودی روشن می‌کند خروجی به کدام داده وابسته است. وقتی چند ورودی داریم و ممکن است خروجی از هرکدام باشد، قرارداد را صریح می‌نویسیم:

```rust
fn longer<'a>(left: &'a str, right: &'a str) -> &'a str {
    if left.len() >= right.len() { left } else { right }
}
```

caller باید خروجی را در محدوده‌ای استفاده کند که هر دو borrow قابل قبول‌اند. این امضا نمی‌گوید داده‌های اصلی دقیقاً هم‌زمان ایجاد یا نابود می‌شوند؛ فقط یک عمر مشترکِ مجاز برای این فراخوانی می‌خواهد.

## Struct دارای reference

[مثال ۰۰۴](../examples/src/bin/004_lifetimes.rs) یک header را بدون کپی متن اصلی تجزیه می‌کند:

```rust
struct Header<'a> {
    key: &'a str,
    value: &'a str,
}
```

`parse_header` با `split_once(':')` دو view می‌سازد. struct تا زمانی قابل استفاده است که متن اصلی زنده و دسترسی‌ها سازگار باشند. اگر header را مستقل از buffer ورودی ذخیره می‌کنی، فیلدهای `String` با هزینهٔ کپی، طراحی ساده‌تری هستند.

```bat
cmd /c cargo run -p rust-lessons --bin 004_lifetimes
```

خروجی شامل `Content-Type`، `application/json` و `Longer: ownership` است. معیار انتخاب longer در این مثال تعداد byte است، نه تعداد حرف قابل‌مشاهده.

## چرا reference به مقدار محلی برنمی‌گردد؟

نمونهٔ زیر عمداً قابل کامپایل نیست:

```compile_fail
fn invalid<'a>() -> &'a str {
    let text = String::from("temporary");
    &text
}
```

با خروج از تابع، owner محلی از بین می‌رود؛ افزودن `'a` آن را نجات نمی‌دهد. خروجی صحیح معمولاً `String` است؛ یا caller باید buffer را فراهم کند.

## معنای `'static`

`&'static str` مثل string literal در کل برنامه معتبر است. قید `T: 'static` یعنی T reference غیرstatic درون خود ندارد؛ به معنی زنده‌ماندن خود T تا پایان برنامه نیست. یک `String` مالک داده می‌تواند این قید را داشته باشد و همچنان زودتر drop شود. این تفاوت در thread و `tokio::spawn` مهم است.

در متدی با `&self`، elision معمولاً lifetime خروجی reference را به self وصل می‌کند. اگر خروجی در واقع از ورودی دیگری می‌آید، lifetime صریح لازم می‌شود. از نشانه‌گذاری همهٔ متغیرها شروع نکن؛ ابتدا رابطهٔ owner و view را رسم کن.

**تمرین:** یک خط `name=value` را به دو reference تجزیه کن. سپس نسخهٔ دارای دو String بساز و توضیح بده کدام نسخه برای cache مستقل از buffer مناسب‌تر است.

منبع: [Validating References with Lifetimes](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html).

</div>
