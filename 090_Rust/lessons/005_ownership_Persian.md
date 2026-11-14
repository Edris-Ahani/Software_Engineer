<div dir="rtl">

[English version](005_ownership_English.md)

# ۰۰۵ ـ Ownership، Move، Copy و Drop

[فهرست](../README_Persian.md) · [قبلی](004_basics_Persian.md) · [بعدی](006_borrowing_Persian.md)

هر مقدار در مدل مالکیت یک owner دارد؛ owner می‌تواند در طول اجرا عوض شود. وقتی owner از scope خارج می‌شود، مقدار معمولاً drop می‌شود. این قانون همراه با borrowing از استفادهٔ reference به دادهٔ نامعتبر جلوگیری می‌کند.

`String` مالک buffer متنی است. نسبت‌دادن آن به متغیر دیگر، خودبه‌خود متن را عمیقاً کپی نمی‌کند؛ مالکیت منتقل می‌شود. محل فیزیکی داده و اینکه compiler چه کپی‌ای را بهینه می‌کند، با معنای ownership یکی نیست.

```rust
let first = String::from("report");
let second = first;
println!("{second}");
```

بعد از خط دوم، استفاده از `first` مجاز نیست. نمونهٔ زیر عمداً نامعتبر است؛ برای دیدن خطای E0382 آن را فقط در یک پروژهٔ تمرینی قرار بده:

```compile_fail
let first = String::from("report");
let second = first;
println!("{first} {second}");
```

## چه موقع کپی می‌شود؟

نوع‌های سادهٔ دارای trait به نام `Copy`، مثل بسیاری از عددها، با assignment قابل استفادهٔ مجدد می‌مانند. `String` و `Vec` از نوع Copy نیستند. `clone()` برای `String` buffer جدید می‌سازد؛ برای `Rc` و `Arc` معمولاً reference count را افزایش می‌دهد. بنابراین هزینهٔ clone به نوع بستگی دارد.

```rust
let original = String::from("invoice");
let duplicate = original.clone();
let count = 3_u32;
let copied = count;
assert_eq!(original, duplicate);
assert_eq!(count, copied);
```

نوع دارای `Copy` باید `Clone` هم داشته باشد. نوعی که `Drop` اختصاصی دارد نمی‌تواند Copy باشد، چون کپی ضمنی، مسئولیت آزادسازی منبع را مبهم می‌کند.

## عبور از مرز تابع

پارامتر `String` مالکیت را می‌گیرد؛ پارامتر `&str` متن را قرض می‌گیرد. بازگرداندن `String` مالکیت را به caller می‌دهد. در [مثال ۰۰۲](../examples/src/bin/002_ownership.rs)، `normalize_name` ورودی را مصرف می‌کند و خروجی جدید می‌دهد؛ نسخهٔ اصلی برای نمایش با clone نگه داشته شده است. در API واقعی اگر مصرف ownership لازم نیست، `&str` انتخاب مناسب‌تری است.

```bat
cmd /c cargo run -p rust-lessons --bin 002_ownership
```

خروجی شامل `Normalized: alice` و دو مقدار `5` است. بعد از انتقال `original` دیگر آن binding در تابع main استفاده نشده است.

## RAII و منابع غیرحافظه‌ای

`Drop` فقط دربارهٔ heap نیست: فایل، lock guard و connection wrapper نیز می‌توانند منبع آزاد کنند. `drop(guard)` منبع را زودتر آزاد می‌کند؛ متد `Drop::drop` را مستقیماً صدا نمی‌زنی. `mem::forget` آزادسازی را عمداً کنار می‌گذارد؛ برای کد روزمره راه‌حل ownership نیست. در خروج ناگهانی فرایند یا panic با حالت abort نمی‌توان اجرای destructorها را تضمین کرد.

**اشتباه رایج:** افزودن clone برای خاموش‌کردن هر خطای کامپایلر. ابتدا مشخص کن caller هنوز مالک داده باید بماند یا نه؛ سپس borrowing یا انتقال مالکیت را آگاهانه انتخاب کن.

**تمرین:** تابع normalize را به پارامتر `&str` تغییر بده و بدون clone متن اصلی را چاپ کن. توضیح بده چرا هنوز خروجی lowercase می‌تواند به allocation نیاز داشته باشد.

منبع: [Ownership](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html)، [Drop](https://doc.rust-lang.org/std/ops/trait.Drop.html).

</div>
