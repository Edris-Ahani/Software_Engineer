<div dir="rtl">

[English version](015_smart_pointers_English.md)

# ۰۱۵ ـ Smart Pointer و Interior Mutability

[فهرست](../README_Persian.md) · [قبلی](014_testing_Persian.md) · [بعدی](016_threads_Persian.md)

reference عادی مالک داده نیست. smart pointer می‌تواند علاوه بر اشاره به داده، مسئولیت ownership، شمارش ownerها یا کنترل دسترسی را نیز داشته باشد. انتخاب آن باید از مدل مالکیت شروع شود.

| نوع | نقش | محدودیت مهم |
| --- | --- | --- |
| `Box<T>` | مالک منفردِ داده با indirection | مالکیت مشترک نمی‌دهد |
| `Rc<T>` | مالکیت مشترک تک‌نخی | reference count غیراتمیک؛ Send نیست |
| `Arc<T>` | مالکیت مشترک با count اتمیک | داخل T را خودکار thread-safe نمی‌کند |
| `Cell<T>` | تغییر با shared access از راه جابه‌جایی مقدار | reference مستقیم بلندمدت به داده نمی‌دهد |
| `RefCell<T>` | borrowing بررسی‌شده در runtime | تخطی از قواعد borrow می‌تواند panic کند |
| `Mutex<T>` / `RwLock<T>` | دسترسی هماهنگ بین threadها | امکان انتظار و deadlock |
| `Weak<T>` | reference غیرمالک به Rc/Arc | ممکن است دیگر قابل upgrade نباشد |

## Box و نوع بازگشتی

```rust
enum List {
    Item(u32, Box<List>),
    End,
}
```

بدون indirection، اندازهٔ List به اندازهٔ خودش وابسته می‌شود. Box اندازهٔ ثابت pointer را وارد layout می‌کند. برای دنبالهٔ معمولی، Vec اغلب locality و سادگی بهتری از linked list دارد. Box در اینجا درس اندازهٔ نوع است، نه توصیهٔ پیش‌فرض ساخت list.

## RefCell قانون را حذف نمی‌کند

```rust
use std::cell::RefCell;
let count = RefCell::new(0_u32);
{
    let mut value = count.borrow_mut();
    *value += 1;
}
assert_eq!(*count.borrow(), 1);
```

guard باید پیش از borrow ناسازگار drop شود. `try_borrow` و `try_borrow_mut` خطا را به‌صورت Result می‌دهند. RefCell راه‌حل به‌اشتراک‌گذاری داده بین threadها نیست. ریشهٔ interior mutability در سطح پایین `UnsafeCell` است؛ استفادهٔ مستقیم آن نیاز به قرارداد ایمنی دقیق دارد.

## چرخهٔ ownerها

در درخت، والد می‌تواند owner فرزند باشد؛ اگر فرزند هم strong owner والد باشد، count هیچ‌وقت صفر نمی‌شود. [مثال ۰۱۲](../examples/src/bin/012_smart_pointers.rs) فرزندان را `Rc<Node>` و parent را `Weak<Node>` نگه می‌دارد. پس از `drop(root)`، فرزند باقی‌مانده دیگر نمی‌تواند parent را upgrade کند.

```bat
cmd /c cargo run -p rust-lessons --bin 012_smart_pointers
```

خروجی `root -> child` است و assertionها نابودی parent را بررسی می‌کنند. `Deref` دسترسی pointerمانند را فراهم می‌کند و `Drop` آزادسازی منبع را کنترل می‌کند؛ deref coercion علت تبدیل راحت `&String` به `&str` نیز هست.

**تمرین:** روی کاغذ count مالک‌های root و child را در هر مرحله حساب کن. توضیح بده چرا تبدیل Weak به Rc مشکل leak را برمی‌گرداند، حتی اگر برنامه فقط از کد safe استفاده کند.

منبع: [Smart Pointers](https://doc.rust-lang.org/book/ch15-00-smart-pointers.html)، [Arc](https://doc.rust-lang.org/std/sync/struct.Arc.html).

</div>
