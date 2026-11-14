<div dir="rtl">

[English version](008_models_patterns_English.md)

# ۰۰۸ ـ Struct، Enum و Pattern Matching

[فهرست](../README_Persian.md) · [قبلی](007_lifetimes_Persian.md) · [بعدی](009_collections_unicode_Persian.md)

struct چند فیلد مرتبط را در یک نوع جمع می‌کند. با private نگه‌داشتن فیلدها و ارائهٔ constructor می‌توان حالت معتبر را کنترل کرد. `impl` محل متدهاست: `&self` مشاهده، `&mut self` تغییر و `self` مصرف ownership را نشان می‌دهد. تابعی مثل `new` که self ندارد associated function است و با `Type::new` صدا زده می‌شود.

```rust
#[derive(Debug)]
struct Customer {
    id: u64,
    name: String,
}
impl Customer {
    fn label(&self) -> String { format!("{}: {}", self.id, self.name) }
}
let customer = Customer { id: 1, name: "Alice".into() };
assert_eq!(customer.label(), "1: Alice");
```

Tuple struct مانند `struct UserId(u64);` برای newtype مفید است. Unit struct مانند `struct Draft;` بدون فیلد است و در typestate کاربرد دارد. `derive` پیاده‌سازی traitهای شناخته‌شده را تولید می‌کند؛ هر derive فقط وقتی ممکن است که فیلدها قیود لازم را داشته باشند.

## Enum داده‌دار: حالت نامعتبر را کمتر کن

به جای دو فیلد `is_paid` و `receipt: Option<String>` که می‌توانند ناسازگار شوند، حالت‌ها را مدل کن:

```rust
enum Status {
    Pending,
    Paid { receipt: String },
    Cancelled,
}
```

`Paid` همیشه receipt دارد. در [مثال سفارش](../examples/src/bin/005_models.rs) متد `pay` تنها از Pending به Paid می‌رود و پرداخت تکراری خطا می‌دهد. وضعیت Cancelled هم یک variant مجزاست. برای محافظت در مرز کتابخانه، فیلد status نباید عمومی باشد.

```bat
cmd /c cargo run -p rust-lessons --bin 005_models
cmd /c cargo run -p rust-lessons --bin 006_patterns
```

برنامهٔ اول `Order 42 paid: receipt-42` چاپ می‌کند. برنامهٔ دوم به ترتیب `no response`، `client error` و `success` نشان می‌دهد، چون از انتهای Vec خارج می‌کند.

## Patternها

`match` باید همهٔ حالت‌ها را پوشش دهد. در الگو می‌توان struct/tuple را باز کرد، range نوشت، چند حالت را با `|` ترکیب کرد، با guard شرط گذاشت، بخش‌های اضافی را با `..` نادیده گرفت یا با `@` مقدار را هم‌زمان bind کرد. guard جای exhaustiveness را نمی‌گیرد.

```rust
let response = Some(503_u16);
let kind = match response {
    Some(code @ 500..=599) => format!("server error: {code}"),
    Some(200..=299) => String::from("success"),
    Some(_) => String::from("other"),
    None => String::from("no response"),
};
assert_eq!(kind, "server error: 503");
```

برای یک حالت از `if let` و برای تکرار از `while let` استفاده کن. `let ... else` خروج زودهنگام خوانا می‌دهد؛ شاخهٔ else باید جریان را ترک کند. `match &value` به‌جای `match value` می‌تواند مانع انتقال مالکیت فیلدهای غیرCopy شود.

**تمرین:** متد cancel را اضافه کن؛ Pending قابل لغو باشد ولی Paid خیر. برای پرداخت دوباره و لغو پس از پرداخت تست بنویس. استفاده از چند boolean را با enum مقایسه کن.

منبع: [Structs](https://doc.rust-lang.org/book/ch05-00-structs.html)، [Enums](https://doc.rust-lang.org/book/ch06-00-enums.html)، [Patterns](https://doc.rust-lang.org/book/ch19-00-patterns.html).

</div>
