<div dir="rtl">

[English version](011_traits_generics_English.md)

# ۰۱۱ ـ Generic، Trait و چندریختی

[فهرست](../README_Persian.md) · [قبلی](010_errors_Persian.md) · [بعدی](012_closures_iterators_Persian.md)

Generic الگوریتم را مستقل از یک نوع مشخص می‌نویسد؛ trait قابلیت لازم آن نوع را بیان می‌کند. بدون bound، compiler نمی‌تواند فرض کند T قابل مقایسه یا چاپ است.

```rust
fn larger<T: Ord>(left: T, right: T) -> T {
    if left >= right { left } else { right }
}
assert_eq!(larger(10, 20), 20);
```

boundهای زیاد را با `where` خوانا کن. trait می‌تواند متد با پیاده‌سازی پیش‌فرض، associated type و associated constant داشته باشد. مثال کلاسیک `Iterator` یک `type Item` دارد؛ برای هر پیاده‌سازی، نوع عنصر مشخص است.

## dispatch ایستا یا پویا؟

[مثال ۰۱۰](../examples/src/bin/010_traits.rs) trait اعلان با دو adapter ایمیل و پیامک دارد. تابع generic `notify<N: Notifier>` برای نوع‌های مشخص monomorphize می‌شود. آرایهٔ `Vec<Box<dyn Notifier>>` در عوض پیاده‌سازی‌های متفاوت را در یک collection جمع می‌کند و از vtable برای dispatch استفاده می‌کند.

| انتخاب | مناسب برای | پیامد |
| --- | --- | --- |
| Generic یا ورودی `impl Trait` | نوع مشخص در زمان compile | فرصت inline؛ احتمال افزایش اندازهٔ کد |
| `&dyn Trait` | borrowing چند پیاده‌سازی | dispatch پویا، بدون اجبار به Box |
| `Box<dyn Trait>` | ownership یک نوع پنهان | معمولاً allocation و dispatch پویا |
| خروجی `impl Trait` | پنهان‌کردن یک نوع concrete | شاخه‌ها باید همان نوع concrete را بدهند |

`impl Trait` خروجی به معنی بازگرداندن هر نوع دلخواه در هر شاخه نیست. برای نوع‌های متفاوت معمولاً enum یا trait object لازم است.

```bat
cmd /c cargo run -p rust-lessons --bin 010_traits
```

خروجی شامل `Email: Order confirmed` و اعلان `Service restored` برای هر دو کانال است. این پیاده‌سازی فقط متن برمی‌گرداند و ایمیل یا SMS واقعی ارسال نمی‌کند.

## محدودیت‌ها و قراردادها

همهٔ traitها dyn-compatible نیستند. متد generic یا خروجی مستقیم Self در بعضی امضاها نیازمند طراحی متفاوت یا قید `Self: Sized` است. `Clone` معمولاً مستقیماً trait object مناسب نمی‌سازد. نام قدیمی این بحث object safety است.

قانون coherence/orphan مانع پیاده‌سازی دلخواه trait خارجی برای نوع خارجی می‌شود؛ معمولاً باید trait یا نوع متعلق به crate خودت باشد و قواعد پوشش نوع رعایت شوند. newtype مثل `UserId(u64)` هم مرز دامنه می‌دهد و هم امکان پیاده‌سازی trait روی نوع محلی.

traitها inheritance کلاس‌ها نیستند. supertrait قید قابلیت می‌دهد و composition معمولاً طراحی روشن‌تری است. برای تست‌پذیری سرویس، مرز I/O را با trait کوچک جدا کن؛ برای هر struct ساده بدون نیاز واقعی interface نساز.

**تمرین:** اعلان فایل را اضافه کن، ابتدا به‌صورت تابعی که فقط متن می‌سازد. سپس یک mock notifier با ثبت پیام برای تست بساز. تفاوت هزینهٔ clone کردن String و clone کردن Arc را توضیح بده.

منبع: [Generics and Traits](https://doc.rust-lang.org/book/ch10-00-generics.html)، [Dyn Compatibility](https://doc.rust-lang.org/reference/items/traits.html#dyn-compatibility).

</div>
