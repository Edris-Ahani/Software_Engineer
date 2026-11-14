<div dir="rtl">

[English version](012_closures_iterators_English.md)

# ۰۱۲ ـ Closure، Iterator و تبدیل داده

[فهرست](../README_Persian.md) · [قبلی](011_traits_generics_Persian.md) · [بعدی](013_modules_workspace_Persian.md)

closure تابعی است که می‌تواند از محیط پیرامون خود مقدار بگیرد. compiler بر اساس نحوهٔ استفاده تصمیم می‌گیرد capture از راه shared borrow، mutable borrow یا move باشد. کلیدواژهٔ `move` capture را به مالکیت منتقل می‌کند؛ به‌تنهایی به معنی FnOnce بودن closure نیست.

| trait | اجازهٔ فراخوانی | نمونهٔ رفتار |
| --- | --- | --- |
| `Fn` | چند بار با shared access | خواندن مقدار captureشده |
| `FnMut` | چند بار با mutable access | افزایش شمارندهٔ captureشده |
| `FnOnce` | دست‌کم یک بار با مصرف closure | انتقال String captureشده به خروجی |

هر closure از FnOnce پشتیبانی می‌کند؛ FnMut و Fn قابلیت‌های قوی‌تری‌اند. نوع bound را بر اساس نیاز caller انتخاب کن.

## مالکیت در iterator

`iter()` معمولاً `&T` می‌دهد، `iter_mut()` معمولاً `&mut T` و `into_iter()` روی collection مالک می‌تواند T را منتقل کند. روی reference به collection، `into_iter` لزوماً مالک عناصر نمی‌شود؛ receiver مهم است.

```rust
let values = vec![1_u32, 2, 3, 4];
let doubled: Vec<_> = values.iter().copied().filter(|value| *value % 2 == 0)
    .map(|value| value * 2).collect();
assert_eq!(doubled, [4, 8]);
assert_eq!(values.len(), 4);
```

adapterهایی مثل `map`، `filter`، `take`، `zip`، `enumerate` و `flat_map` عموماً lazy هستند. تا consumer مثل `collect`، `sum`، `find`، `for_each` یا حلقه مصرفشان نکند کاری انجام نمی‌دهند. `collect::<Vec<_>>()` allocation خروجی می‌خواهد؛ `sum` معمولاً collection میانی لازم ندارد.

```rust
let result: Result<Vec<u32>, _> = ["1", "2", "bad"].into_iter()
    .map(str::parse::<u32>).collect();
assert!(result.is_err());
```

[مثال ۰۱۱](../examples/src/bin/011_iterators.rs) جمع را `400` محاسبه می‌کند، قیمت‌ها را نصف می‌کند، closure دارای شمارنده را با FnMut نشان می‌دهد و یک closure مصرف‌کنندهٔ String دارد.

```bat
cmd /c cargo run -p rust-lessons --bin 011_iterators
```

خروجی شامل چهار برچسب قیمت، `calls: 4` و `one-shot payload` است. یک pipeline بسیار بلند همیشه خواناتر از حلقه نیست؛ وقتی چند وضعیت یا خروج زودهنگام پیچیده داری، حلقهٔ صریح را انتخاب کن.

پیاده‌سازی Iterator اختصاصی مستلزم متد `next(&mut self) -> Option<Self::Item>` است. برای ساخت iterator کوچک، ابتدا `std::iter::from_fn` را بررسی کن. مصرف دوبارهٔ یک iterator تمام‌شده یا منتقل‌شده با ساخت مجدد collection یکی نیست.

**تمرین:** از لیست متن قیمت‌ها، فقط ورودی‌های معتبر و مثبت را جمع کن؛ سپس نسخه‌ای بنویس که اولین ورودی نامعتبر را خطا اعلام کند. تفاوت `filter_map` و `collect` روی Result را توضیح بده.

منبع: [Closures and Iterators](https://doc.rust-lang.org/book/ch13-00-functional-features.html)، [Iterator](https://doc.rust-lang.org/std/iter/trait.Iterator.html).

</div>
