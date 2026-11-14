<div dir="rtl">

[English version](018_async_English.md)

# ۰۱۸ ـ Future، async/await و Tokio

[فهرست](../README_Persian.md) · [قبلی](017_channels_atomics_Persian.md) · [بعدی](019_macros_Persian.md)

فراخوانی `async fn` یک Future می‌سازد؛ بدنه تا وقتی poll نشود کارش را پیش نمی‌برد. Future در هر poll یا `Ready(value)` می‌دهد یا `Pending`. اگر Pending شد، runtime باید از طریق Waker از آماده‌شدن دوباره باخبر شود. `.await` در صورت نیاز کنترل را پس می‌دهد؛ الزاماً thread جدید نمی‌سازد.

[مثال ۰۱۹](../examples/src/bin/019_futures.rs) فقط futureهای فوراً آماده دارد و یک بار poll می‌کند:

```bat
cmd /c cargo run -p rust-lessons --bin 019_futures
```

خروجی `Ready: 42` است. Waker خالی این مثال executor عمومی نیست و برای socket، timer یا کار Pending مناسب نیست. برای کار واقعی از runtime استفاده می‌کنیم.

## اجرای واقعی با Tokio

پروژهٔ اختیاری [API](../projects/003_async_api/README_Persian.md) از Tokio و Axum استفاده می‌کند. `#[tokio::main]` runtime را آماده می‌کند. در نمونهٔ صف، یک producer، صف ظرفیت ۲، worker و timeout داریم:

```bat
cmd /c cargo run --manifest-path projects/003_async_api/Cargo.toml --bin 001_bounded_jobs
```

پس از دانلود dependencyها، خروجی `Processed total: 15` است. اگر producer از scope خارج شود، sender drop می‌شود و worker پایان stream را می‌بیند. `JoinSet` هنگام drop، taskهای باقی‌مانده را abort می‌کند؛ این ویژگی در مسیر خطا مانع task رهاشده می‌شود.

## توالی، هم‌زمانی و عمر task

دو `.await` پشت‌سرهم معمولاً دو کار را به‌ترتیب پیش می‌برند. `tokio::join!` چند future را در یک task پیش می‌برد؛ `tokio::spawn` یک task مستقل می‌سازد و معمولاً `Send + 'static` می‌خواهد. گرفتن reference به متغیر محلی caller همیشه مجاز نیست؛ مالکیت را منتقل کن یا lifetime و scope را درست طراحی کن.

`JoinHandle` را await کن تا خطا و panic پنهان نماند. drop کردن JoinHandle یک task spawned معمولاً آن را لغو نمی‌کند. در مقابل، drop کردن خود future یک عملیات می‌تواند cancellation باشد؛ آثار I/O یا تغییر state که قبلاً رخ داده‌اند rollback نمی‌شوند.

## timeout، select و cancellation safety

`timeout` فقط زمانی می‌تواند به‌موقع واکنش دهد که کار به runtime فرصت اجرای timer بدهد. حلقهٔ CPU بی‌وقفه داخل future با timeout به‌تنهایی متوقف نمی‌شود. `tokio::select!` می‌تواند منتظر چند رویداد بماند و شاخه‌های بازنده را drop کند؛ قبل از استفاده، بررسی کن عملیات نیمه‌تمام با drop چه اثری دارد.

برای shutdown، پذیرش کار جدید را متوقف کن، senderها را ببند، کارهای درحال‌اجرا را با مهلت مشخص جمع کن و در پایان منبع را آزاد کن. Stream مفهوم دنبالهٔ async است و شبیه iteratorِ منتظر ورودی است؛ مصرف آن نیز باید bounded و قابل لغو باشد.

## blocking در runtime

`std::thread::sleep`، فایل‌خوانی blocking یا محاسبهٔ CPU طولانی را مستقیم در worker runtime انجام نده. برای blocking از `spawn_blocking` با سقف concurrency و برای محاسبات موازی از thread pool مناسب استفاده کن. `spawn_blocking` در حال اجرا معمولاً با abort ساده متوقف نمی‌شود.

در پروژهٔ وب، Mutex استاندارد فقط چند عملیات کوچک حافظه را محافظت می‌کند و هیچ guardی از `.await` عبور نمی‌کند. برای قفلی که باید میان awaitها نگه داشته شود، طراحی را بازبینی کن؛ در صورت لزوم async mutex انتخاب کن. async بودن قفل هم deadlock منطقی را ناممکن نمی‌کند.

**تمرین:** worker صف را عمداً کند کن؛ timeout و بسته‌شدن sender را بررسی کن. تفاوت اجرای پنج کار متوالی با پنج task و semaphore ظرفیت ۲ را روی کاغذ توضیح بده.

منبع: [Tokio Tutorial](https://tokio.rs/tokio/tutorial)، [Cancellation](https://tokio.rs/tokio/tutorial/select)، [Future](https://doc.rust-lang.org/std/future/trait.Future.html).

</div>
