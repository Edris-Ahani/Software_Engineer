<div dir="rtl">

[English version](README_English.md)

# آموزش جامع و عملی Rust

این پوشه یک مسیر یادگیری از اولین برنامه تا مباحث پیشرفتهٔ Rust با فایل‌های مستقل فارسی و انگلیسی است. درس‌ها را به ترتیب بخوان، مثال مرتبط را اجرا کن، سپس بدون نگاه‌کردن به پاسخ، تمرین را حل کن. تمام کدها، داده‌های نمونه، پروژه‌ها و منابع این دوره همین‌جا هستند.

پیش‌نیاز: آشنایی مقدماتی با متغیر، تابع و ترمینال. تجربهٔ C/C++ لازم نیست. نمونه‌های اصلی از Edition 2024 و APIهای موجود در Rust 1.85 استفاده می‌کنند؛ برای پروژهٔ اختیاری وب، آخرین stable را نصب کن، چون حداقل نسخهٔ وابستگی‌ها ممکن است بالاتر باشد. Edition نام نسخهٔ کامپایلر نیست.

## شروع سریع

ابتدا [نصب روی Windows، Linux، macOS و WSL](lessons/002_installation_Persian.md) را انجام بده. سپس ترمینال را در همین پوشه باز کن:

```bat
cmd /c rustc --version
cmd /c cargo --version
cmd /c cargo run -p rust-lessons --bin 001_basics
cmd /c cargo run -p inventory
cmd /c cargo run -p log-search -- ERROR projects/001_log_search/data/sample.log
cmd /c cargo test --workspace --offline
```

خروجی مثال اول با `Total: 600, shipping: 80` آغاز می‌شود. پروژهٔ انبار مقدار `3500` سنت و موجودی باقی‌ماندهٔ `3` را نشان می‌دهد. پروژهٔ جست‌وجو خطوط خطای شمارهٔ ۲ و ۴ را برمی‌گرداند.

دستورهای عمومی دوره برای Windows با `cmd /c` نوشته شده‌اند. در Linux و macOS همین دستورهای Cargo را بدون این پیشوند اجرا کن. دستورهای مخصوص هر سیستم‌عامل در درس نصب مشخص شده‌اند. دستورهای نسبی، مگر آنکه خلافش گفته شود، از ریشهٔ `090_Rust` اجرا می‌شوند.

## مسیر یادگیری

| درس | موضوع | مثال یا نتیجهٔ عملی |
| --- | --- | --- |
| [۰۰۱](lessons/001_introduction_Persian.md) | Rust چیست و کجا استفاده می‌شود؟ | انتخاب زبان بر اساس نیاز |
| [۰۰۲](lessons/002_installation_Persian.md) | نصب و تنظیم محیط | Windows، Linux، macOS، WSL |
| [۰۰۳](lessons/003_cargo_Persian.md) | rustc، Cargo و ابزارها | ساخت، اجرا، تست و مستندات |
| [۰۰۴](lessons/004_basics_Persian.md) | نحو، نوع‌ها و کنترل جریان | [محاسبهٔ هزینه](examples/src/bin/001_basics.rs) |
| [۰۰۵](lessons/005_ownership_Persian.md) | Ownership، Move، Copy و Drop | [انتقال نام](examples/src/bin/002_ownership.rs) |
| [۰۰۶](lessons/006_borrowing_Persian.md) | Borrowing، reference و slice | [تخفیف روی قیمت‌ها](examples/src/bin/003_borrowing.rs) |
| [۰۰۷](lessons/007_lifetimes_Persian.md) | Lifetime و دادهٔ قرض‌گرفته‌شده | [خواندن header](examples/src/bin/004_lifetimes.rs) |
| [۰۰۸](lessons/008_models_patterns_Persian.md) | Struct، enum و pattern matching | [سفارش](examples/src/bin/005_models.rs)، [وضعیت HTTP](examples/src/bin/006_patterns.rs) |
| [۰۰۹](lessons/009_collections_unicode_Persian.md) | Collection و Unicode | [شمارش کلمات](examples/src/bin/007_collections.rs)، [رشته](examples/src/bin/008_strings.rs) |
| [۰۱۰](lessons/010_errors_Persian.md) | Option، Result و خطا | [اعتبارسنجی port](examples/src/bin/009_errors.rs) |
| [۰۱۱](lessons/011_traits_generics_Persian.md) | Generic، trait و polymorphism | [اعلان چندکاناله](examples/src/bin/010_traits.rs) |
| [۰۱۲](lessons/012_closures_iterators_Persian.md) | Closure و Iterator | [پردازش قیمت‌ها](examples/src/bin/011_iterators.rs) |
| [۰۱۳](lessons/013_modules_workspace_Persian.md) | Module، crate، workspace و feature | سازمان‌دهی همین دوره |
| [۰۱۴](lessons/014_testing_Persian.md) | Unit، integration و doc test | تست جست‌وجو و انبار |
| [۰۱۵](lessons/015_smart_pointers_Persian.md) | Box، Rc، Arc و interior mutability | [درخت بدون چرخهٔ مالکیت](examples/src/bin/012_smart_pointers.rs) |
| [۰۱۶](lessons/016_threads_Persian.md) | Thread، Mutex و Send/Sync | [شمارندهٔ مشترک](examples/src/bin/013_threads.rs) |
| [۰۱۷](lessons/017_channels_atomics_Persian.md) | Channel، backpressure و atomic | [صف محدود](examples/src/bin/014_channels.rs)، [شمارندهٔ اتمیک](examples/src/bin/020_atomics.rs) |
| [۰۱۸](lessons/018_async_Persian.md) | Future، async/await، Tokio و cancellation | [Future](examples/src/bin/019_futures.rs)، پروژهٔ وب |
| [۰۱۹](lessons/019_macros_Persian.md) | macro_rules و procedural macro | [ساخت فهرست](examples/src/bin/015_macros.rs) |
| [۰۲۰](lessons/020_advanced_types_Persian.md) | Typestate، Pin، GAT و نوع‌های پیشرفته | [حالت مقاله](examples/src/bin/016_advanced_types.rs)، [تبدیل نوع](examples/src/bin/021_conversions.rs) |
| [۰۲۱](lessons/021_unsafe_ffi_Persian.md) | unsafe، FFI و layout | [تقسیم امن slice](examples/src/bin/017_unsafe.rs) |
| [۰۲۲](lessons/022_io_networking_Persian.md) | فایل، stream، CLI و شبکه | [پردازش لاگ](examples/src/bin/018_streaming_io.rs) |
| [۰۲۳](lessons/023_serde_database_Persian.md) | JSON، API و پایگاه داده | پروژهٔ Axum و مسیر SQLx |
| [۰۲۴](lessons/024_wasm_embedded_Persian.md) | WASM، Embedded و no_std | طرح آزمایش تخصصی |
| [۰۲۵](lessons/025_performance_Persian.md) | هزینهٔ حافظه و بهینه‌سازی | تحلیل الگوریتم پروژه‌ها |
| [۰۲۶](lessons/026_security_deployment_Persian.md) | امنیت، انتشار و CI | چک‌لیست تحویل |
| [۰۲۷](lessons/027_troubleshooting_Persian.md) | خطاهای متداول کامپایلر | تشخیص و اصلاح |
| [۰۲۸](lessons/028_projects_Persian.md) | ساخت پروژه قدم‌به‌قدم | CLI، انبار و HTTP API |
| [۰۲۹](lessons/029_exercises_Persian.md) | تمرین‌های مرحله‌ای | معیار پذیرش قابل بررسی |
| [۰۳۰](lessons/030_solutions_Persian.md) | راه‌حل و تحلیل تمرین‌ها | اشاره به پیاده‌سازی‌ها |
| [۰۳۱](lessons/031_glossary_resources_Persian.md) | واژه‌نامه، مرور و منابع | ادامهٔ یادگیری |

## ساختار و جداسازی وابستگی‌ها

- `lessons/`: آموزش‌های شماره‌گذاری‌شده در فایل‌های مستقل `_Persian.md` و `_English.md`، همراه با مثال، خطای رایج و تمرین.
- `examples/`: یک package با ۲۱ برنامهٔ مستقل؛ هر برنامه با `--bin` انتخاب می‌شود.
- [پروژهٔ ۰۰۱: جست‌وجوی لاگ](projects/001_log_search/README_Persian.md): ورودی/خروجی stream، خطا، CLI و تست.
- [پروژهٔ ۰۰۲: مدیریت موجودی](projects/002_inventory/README_Persian.md): منطق دامنه، overflow و حفظ وضعیت در خطا.
- [پروژهٔ ۰۰۳: API ناهمگام](projects/003_async_api/README_Persian.md): Tokio، Axum، JSON، صف محدود و تست HTTP.
- [راهنمای بررسی](VALIDATION_Persian.md): دستورها و محدودیت اجرای تست‌ها در زمان تهیهٔ آموزش.

workspace اصلی هیچ وابستگی خارجی ندارد؛ بعد از نصب toolchain می‌توان آن را آفلاین ساخت و تست کرد. پروژهٔ وب workspace مستقل دارد تا برای شروع، دانلود کتابخانه‌های وب لازم نباشد. دادهٔ هیچ پروژه‌ای با پروژه‌های دیگر این مخزن مخلوط نمی‌شود.

## برنامهٔ پیشنهادی مطالعه

هفتهٔ اول درس‌های ۱ تا ۸ و اجرای مثال‌ها؛ هفتهٔ دوم درس‌های ۹ تا ۱۵ و پروژهٔ جست‌وجو؛ هفتهٔ سوم درس‌های ۱۶ تا ۲۳ و پروژه‌های انبار و API؛ هفتهٔ چهارم مباحث تخصصی، تمرین‌ها و بازنویسی یک ابزار واقعی خودت با Rust. هر روز خروجی را پیش‌بینی کن، برنامه را اجرا کن و یک حالت مرزی به تست‌ها اضافه کن.

این مجموعه مبانی و سرفصل‌های اصلی و پیشرفته را پوشش می‌دهد؛ مرجع تک‌تک APIهای استاندارد یا جایگزین مستندات تخصصی سیستم‌عامل، embedded و دیتابیس نیست. برای عمق بیشتر، لینک رسمی همان درس را دنبال کن. روش نصب و APIهای وب با [راهنمای رسمی نصب](https://rust-lang.org/install/)، [rustup](https://rust-lang.github.io/rustup/)، [Tokio](https://tokio.rs/tokio/tutorial) و [Axum](https://docs.rs/axum/0.8/axum/) تطبیق داده شده‌اند.

</div>
