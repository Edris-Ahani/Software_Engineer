<div dir="rtl">

[English version](020_advanced_types_English.md)

# ۰۲۰ ـ نوع‌های پیشرفته، Typestate و Pin

[فهرست](../README_Persian.md) · [قبلی](019_macros_Persian.md) · [بعدی](021_unsafe_ffi_Persian.md)

این درس نقشهٔ مفاهیم پیشرفته است. ابتدا کاربرد typestate و تبدیل را اجرا کن؛ GAT، HRTB و Pin را زمانی عمیق کن که طراحی API تو واقعاً به آن‌ها نیاز دارد.

## Newtype، alias و تبدیل

`type UserId = u64` فقط نام دیگری برای همان نوع است؛ compiler آن را از OrderId جدا نمی‌کند. `struct UserId(u64)` نوع متفاوت می‌سازد. `From` برای تبدیل بدون شکست و `TryFrom` برای تبدیل fallible است؛ با پیاده‌سازی From، معمولاً Into متناظر به دست می‌آید.

[مثال ۰۲۱](../examples/src/bin/021_conversions.rs) صفر را برای UserId رد می‌کند و با `Cow<'a, str>` فقط در صورت نیاز به lowercase نسخهٔ مالک می‌سازد:

```bat
cmd /c cargo run -p rust-lessons --bin 021_conversions
```

خروجی `Ok(UserId(42))` است. `Cow::Borrowed` بدون کپی از ورودی استفاده می‌کند و `Cow::Owned` دادهٔ مستقل دارد. این مثال فقط lowercase نوع ASCII را هدف گرفته است.

## Const generic و Typestate

```rust
fn total<const N: usize>(values: [u32; N]) -> u32 { values.iter().sum() }
assert_eq!(total([1, 2, 3]), 6);
```

N بخشی از نوع array است. همهٔ محاسبات دلخواه روی const generic در هر محل stable مجاز نیستند؛ محدودیت‌های compiler را از Reference بررسی کن.

[مثال ۰۱۶](../examples/src/bin/016_advanced_types.rs) `Article<Draft>` را با مصرف ownership به `Article<Published>` تبدیل می‌کند؛ متد `url` تنها روی Published وجود دارد. `PhantomData` حالت را در type system حمل می‌کند بدون آنکه نمونهٔ واقعی State لازم باشد.

```bat
cmd /c cargo run -p rust-lessons --bin 016_advanced_types
```

خروجی `/articles/rust` است. این URLساز فقط مثال است و برای متن دلخواه slug معتبر تولید نمی‌کند. typestate جلوی صدا زدن url روی draft را می‌گیرد؛ برای وضعیت پویا که از دیتابیس می‌آید enum ممکن است مناسب‌تر باشد.

## Associated Type، GAT و HRTB

associated type خروجی نوع یک پیاده‌سازی را مشخص می‌کند. GAT اجازه می‌دهد این خروجی خودش پارامتر lifetime یا نوع داشته باشد؛ کاربرد رایج viewهایی است که به borrow خود container وابسته‌اند:

```rust
trait Lending {
    type Item<'a> where Self: 'a;
    fn next<'a>(&'a mut self) -> Option<Self::Item<'a>>;
}
fn accepts_any_borrow<F>(operation: F)
where F: for<'a> Fn(&'a str) -> usize,
{
    assert_eq!(operation("rust"), 4);
}
```

`for<'a>` قید higher-ranked است: عملیات باید برای هر lifetime مناسب قابل استفاده باشد، نه فقط یک borrow خاص. trait دارای GAT را لزوماً نمی‌توان به `dyn Trait` تبدیل کرد؛ dyn compatibility جداگانه بررسی می‌شود.

## Sized، DST و Pin

`str`، `[T]` و `dyn Trait` نوع‌هایی با اندازهٔ پویا هستند؛ معمولاً پشت pointer استفاده می‌شوند. `?Sized` قید پیش‌فرض Sized را شل می‌کند. pointer چنین نوعی می‌تواند metadata مانند length یا vtable داشته باشد؛ layout داخلی را قرارداد FFI فرض نکن.

بعضی futureها پس از شروع، referenceهایی مرتبط با محل ذخیرهٔ خود دارند. `Pin<P>` همراه با قرارداد pointer و `Unpin` جابه‌جانشدن دادهٔ حساس به آدرس را مدل می‌کند. `Box::pin` راه سادهٔ pin کردن روی heap است. Pin به معنی immutable بودن داده یا جلوگیری از جابه‌جایی خود handle نیست؛ جابه‌جایی pointee تحت قرارداد pin موضوع اصلی است.

`async fn` در trait روی stable قابل استفاده است، اما dyn dispatch و تعیین Send برای future خروجی نیازمند طراحی جداست. صرف افزودن async به trait یک `Box<dyn Trait>` عمومی نمی‌سازد.

**تمرین:** متد preview را فقط برای Draft تعریف کن. سپس تلاش کن preview را بعد از publish صدا بزنی و دلیل خطا را بنویس.

منبع: [Advanced Types](https://doc.rust-lang.org/book/ch20-03-advanced-types.html)، [Pin](https://doc.rust-lang.org/std/pin/)، [Associated Items](https://doc.rust-lang.org/reference/items/associated-items.html).

</div>
