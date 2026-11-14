<div dir="rtl">

[English version](026_security_deployment_English.md)

# ۰۲۶ ـ امنیت، CI و تحویل برنامه

[فهرست](../README_Persian.md) · [قبلی](025_performance_Persian.md) · [بعدی](027_troubleshooting_Persian.md)

memory safety بخش مهمی از امنیت است؛ جای authentication، authorization، validation و محدودیت منابع را نمی‌گیرد. API آموزشی این دوره برای localhost است و login، TLS، persistence یا کنترل دسترسی چندکاربره ندارد. قبل از استفادهٔ عملی این مرزها باید کامل شوند.

## وابستگی و داده

dependency می‌تواند build script یا procedural macro اجرا کند. تعداد و featureهای آن را محدود کن، maintainer و license را بررسی کن و lockfile برنامه را نگه دار. ابزارهای cargo-audit و cargo-deny را طبق منابع رسمی نصب و روی dependency graph اجرا کن؛ نبود گزارش امنیتی به معنی نبود آسیب‌پذیری نیست.

ورودی را از نظر شکل، دامنه و اندازه بررسی کن. برای HTTP سقف body، concurrency، deadline و rate limit در نظر بگیر. برای parser لاگ، محدودیت بزرگ‌ترین خط مهم است؛ stream کردن فایل به‌تنهایی جلوی یک خط چندگیگابایتی را نمی‌گیرد. نمونهٔ CLI حاضر این سقف را اعمال نمی‌کند.

در log، token، password، body حساس و URL دارای secret را ننویس. پیام خطای بیرونی باید به مصرف‌کننده کمک کند و جزئیات داخلی را افشا نکند. برای tracing، شناسهٔ درخواست و زمان عملیات مفیدتر از dump کردن تمام داده‌هاست.

## کنترل کیفیت پیش از تحویل

از ریشهٔ دوره روی Windows:

```bat
cmd /c cargo fmt --all -- --check
cmd /c cargo clippy --workspace --all-targets --offline -- -D warnings
cmd /c cargo test --workspace --offline
cmd /c cargo test --workspace --doc --offline
cmd /c cargo fmt --manifest-path projects/003_async_api/Cargo.toml -- --check
cmd /c cargo clippy --manifest-path projects/003_async_api/Cargo.toml --all-targets -- -D warnings
cmd /c cargo test --manifest-path projects/003_async_api/Cargo.toml
```

پس از تولید و نگهداری lockfileهای هر دو workspace، در CI از `--locked` استفاده کن. روی Linux/macOS پیشوند `cmd /c` را حذف کن. برای codebase چندسکویی، matrix واقعی Windows/Linux/macOS تفاوت linker، مسیر و line ending را آشکار می‌کند.

## تحویل باینری

release را برای target درست بساز، executable را روی محیط نزدیک به مقصد smoke test کن و نیاز به shared library یا runtime بومی را بررسی کن. فایل اجرایی native الزاماً بدون dependency سیستم نیست. افزودن target در rustup جای نصب linker و SDK را نمی‌گیرد.

پیکربندی حساس از محیط deployment یا secret manager بیاید. سرویس با کاربر کم‌اختیار اجرا شود؛ log و health check و سقف منابع تعریف شود. shutdown باید کار جدید را متوقف و کارهای در جریان را در مهلت معلوم جمع کند. دادهٔ in-memory در restart از دست می‌رود و برای نیاز پایدار باید storage مناسب اضافه شود.

## چه چیزی را در نسخه ثبت کنیم؟

نسخهٔ compiler، target، lockfile، featureها و فرمان build را ثبت کن. artifact را به commit و pipeline مربوط وصل کن. برای انتشار crate عمومی، SemVer، license، مستندات و API عمومی را بررسی کن؛ برای این نمونه‌ها `publish = false` مانع انتشار تصادفی package است.

**تمرین:** برای API فعلی سه ریسک انتخاب کن و یک طرح عملی برای هرکدام بده: پایداری داده، کنترل دسترسی و محدودیت نرخ. فقط تغییر زبان به Rust هیچ‌یک را خودکار حل نمی‌کند.

منبع: [Cargo Lockfile](https://doc.rust-lang.org/cargo/guide/cargo-toml-vs-cargo-lock.html)، [RustSec cargo-audit](https://github.com/rustsec/rustsec/tree/main/cargo-audit)، [cargo-deny](https://embarkstudios.github.io/cargo-deny/).

</div>
