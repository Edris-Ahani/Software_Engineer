<div dir="rtl">

[English version](016_threads_English.md)

# ۰۱۶ ـ Thread، Mutex، Send و Sync

[فهرست](../README_Persian.md) · [قبلی](015_smart_pointers_Persian.md) · [بعدی](017_channels_atomics_Persian.md)

concurrency یعنی پیشبرد چند کار در بازه‌های هم‌پوشان؛ parallelism یعنی اجرای واقعی هم‌زمان، معمولاً روی چند هسته. thread سیستم‌عامل می‌تواند برای پردازش CPU مناسب باشد، ولی ساخت یک thread برای هر درخواست شبکه هزینهٔ stack و scheduling دارد.

`thread::spawn` یک کار مستقل می‌سازد. closure معمولاً `move` است تا دادهٔ لازم را مالک شود. با `JoinHandle::join` پایان و panic آن را بررسی کن؛ رهاکردن handle به معنی منتظرماندن نیست.

```rust
let name = String::from("worker");
let handle = std::thread::spawn(move || format!("{name} finished"));
assert_eq!(handle.join().expect("The sample worker does not panic"), "worker finished");
```

## ownership مشترک با تغییر کنترل‌شده

`Arc<Mutex<T>>` دو مسئلهٔ مستقل را حل می‌کند: Arc چند owner می‌دهد و Mutex دسترسی exclusive به T. guard حاصل lock تا زمان drop قفل را نگه می‌دارد. دامنهٔ guard را کوچک کن و داخل آن I/O کند انجام نده.

[مثال ۰۱۳](../examples/src/bin/013_threads.rs) چهار thread دارد که هرکدام هزار بار شمارنده را افزایش می‌دهند. پس از join مقدار دقیق `4000` است. یک scoped thread نیز آرایه را قرض می‌گیرد و جمع `6` را برمی‌گرداند.

```bat
cmd /c cargo run -p rust-lessons --bin 013_threads
```

خروجی `Counter: 4000, scoped sum: 6` است. `thread::scope` تضمین می‌کند threadهای آن قبل از پایان scope جمع شوند؛ در نتیجه borrowing دادهٔ محلی با عمر مناسب ممکن می‌شود. این قابلیت با `spawn` مستقل و قید معمول `'static` یکسان نیست.

## Send و Sync

`Send` می‌گوید انتقال ownership نوع بین threadها مجاز است. `Sync` می‌گوید اشتراک `&T` بین threadها مجاز است؛ به بیان دقیق، `&T: Send`. این‌ها معمولاً به‌صورت auto trait بر اساس فیلدها تعیین می‌شوند. `Rc` و `RefCell` به‌تنهایی قرارداد اشتراک چندنخی مناسب ندارند. افزودن `unsafe impl Send` برای خاموش‌کردن خطا می‌تواند برنامه را unsound کند.

## چه چیزهایی هنوز ممکن است خراب شوند؟

compiler بسیاری از data raceهای حافظه را رد می‌کند، ولی ترتیب گرفتن دو lock می‌تواند deadlock بسازد. اگر هر thread دو منبع می‌گیرد، ترتیب مشترک تعریف کن. گرفتن دوبارهٔ همان Mutex نیز راه‌حل reentrant عمومی نیست.

اگر panic هنگام نگه‌داشتن `std::sync::Mutex` رخ دهد، lock ممکن است poisoned شود. `lock()` به همین علت Result می‌دهد. بازیابی با `into_inner` فقط وقتی درست است که بتوانی invariants داده را دوباره برقرار کنی؛ blindly unwrap کردن سیاست قابل اتکایی نیست.

**تمرین:** نسخه‌ای با یک lock برای هر ۱۰۰ افزایش بساز و هزینهٔ synchronization را مقایسه کن. نتیجه را با زمان release و تعداد تکرار کافی بسنج؛ یک اجرای اتفاقی معیار نیست.

منبع: [Fearless Concurrency](https://doc.rust-lang.org/book/ch16-00-concurrency.html)، [thread::scope](https://doc.rust-lang.org/std/thread/fn.scope.html).

</div>
