<div dir="rtl">

[English version](024_wasm_embedded_English.md)

# ۰۲۴ ـ WebAssembly، Embedded و no_std

[فهرست](../README_Persian.md) · [قبلی](023_serde_database_Persian.md) · [بعدی](025_performance_Persian.md)

این دو مسیر محیط اجرا و ابزار متفاوت می‌خواهند. مثال‌های workspace اصلی برای سیستم‌عامل میزبان هستند؛ دستورهای این درس را روی کل workspace اجرا نکن و انتظار نداشته باش هر crate استانداردی برای هر target قابل ساخت باشد.

## WebAssembly

WASM یک فرمت اجرایی قابل حمل است، نه دسترسی مستقیم به تمام APIهای مرورگر. برای تماس با JavaScript و DOM معمولاً wasm-bindgen و web-sys نیاز است. برای محیط‌های server-side مبتنی بر WASI، target و host API فرق می‌کند.

ابتدا هدف مرورگری را اضافه کن:

```bat
cmd /c rustup target add wasm32-unknown-unknown
```

در یک crate تمرینی مستقل با `crate-type = ["cdylib"]` می‌توان تابع export کرد:

```rust
#[unsafe(no_mangle)]
pub extern "C" fn square(value: u32) -> u32 {
    value.saturating_mul(value)
}
```

برای ABI سادهٔ عددی، host می‌تواند export را بارگذاری کند؛ String، Vec و objectهای JS نیاز به قرارداد binding دارند. سپس تنها همان crate را بساز:

```bat
cmd /c cargo build --manifest-path scratch/wasm_demo/Cargo.toml --target wasm32-unknown-unknown --release
```

این manifest باید توسط تو در تمرین ساخته شود؛ جزو پروژه‌های آماده نیست. گرفتن `.wasm` پایان کار نیست: نحوهٔ load، async initialization، انتقال buffer، featureهای مرورگر و ابزار package نیز باید مشخص شوند. انتقال حجم زیاد داده بین JS و WASM ممکن است سود محاسبه را کاهش دهد.

## Embedded

`#![no_std]` وابستگی خودکار به std را حذف می‌کند، ولی `core` باقی است. `alloc` برای Box/Vec در محیط دارای allocator قابل استفاده است. `no_std` لزوماً «بدون heap» یا «بدون سیستم‌عامل» نیست؛ هدف، جداسازی نیاز به std است. در bare metal باید entry point، panic handler، memory layout و driverهای برد تعیین شوند.

مسیر عملی برای یک برد مشخص:

۱. معماری CPU، مدل برد، debugger/probe و target پشتیبانی‌شده را از راهنمای همان برد انتخاب کن.
۲. target مناسب را با rustup اضافه کن؛ یک target نمونه برای برخی Cortex-Mها `thumbv7em-none-eabihf` است و برای همهٔ بردها درست نیست.
۳. از template و HAL معتبر همان سخت‌افزار شروع کن؛ linker script و روش flash به برد وابسته‌اند.
۴. LED یا UART را اجرا کن، سپس زمان‌بندی، interrupt و اشتراک داده را اضافه کن.

register سخت‌افزار با حافظهٔ عادی فرق دارد؛ volatile بودن نیز جای synchronization یا atomic بودن را نمی‌گیرد. استفاده از HAL امن بخشی از قراردادهای خام pointer را پشت API مناسب نگه می‌دارد.

## Cross-compilation

`rustup target add` تنها کتابخانه‌های هدف را اضافه می‌کند؛ linker، SDK، headerهای C یا ابزار flash را خودبه‌خود برای هر target نصب نمی‌کند. build شدن برای یک target نیز به معنی اجراشدن تست‌ها روی host نیست.

**تمرین:** میان یک ماژول WASM برای پردازش تصویر و یک firmware حسگر، نیازهای ورودی/خروجی، حافظه و ابزار انتشار را مقایسه کن. بدون سخت‌افزار، بخش الگوریتم pure را روی host تست کن.

منبع: [wasm32-unknown-unknown](https://doc.rust-lang.org/rustc/platform-support/wasm32-unknown-unknown.html)، [wasm-bindgen](https://wasm-bindgen.github.io/wasm-bindgen/)، [Embedded Rust Book](https://docs.rust-embedded.org/book/).

</div>
