<div dir="rtl">

[English version](013_modules_workspace_English.md)

# ۰۱۳ ـ Module، Crate، Workspace و Feature

[فهرست](../README_Persian.md) · [قبلی](012_closures_iterators_Persian.md) · [بعدی](014_testing_Persian.md)

module ابزار namespace و visibility است، نه واحد deployment. `mod pricing;` فایل یا module را وارد درخت module می‌کند؛ `use` فقط نام در مسیر را کوتاه می‌کند. `pub` دسترسی عمومی، `pub(crate)` دسترسی در crate و `pub(super)` دسترسی در module والد می‌دهد. داده را تا حد نیاز private نگه دار.

```text
src/lib.rs             -> pub mod pricing;
src/pricing.rs         -> pub fn calculate(...)
src/main.rs            -> use my_package::pricing::calculate;
```

`crate::` از ریشهٔ crate شروع می‌کند، `super::` از والد و `self::` از module جاری. `pub use` می‌تواند API کوتاه و پایدار بسازد و جزئیات مسیر داخلی را از مصرف‌کننده پنهان کند. فایل مجزا به‌تنهایی module نمی‌شود؛ باید در درخت اعلام شده باشد.

## طراحی همین دوره

[پروژهٔ جست‌وجو](../projects/001_log_search/src/lib.rs) پردازش متن را در lib دارد و main فقط آرگومان، فایل و exit code را مدیریت می‌کند. به همین دلیل تست می‌تواند `Cursor` بدهد و بدون فایل واقعی یا subprocess رفتار را بررسی کند. [انبار](../projects/002_inventory/src/lib.rs) هیچ وابستگی به ترمینال یا HTTP ندارد.

workspace ریشه یک خروجی target مشترک و lockfile مشترک دارد. `resolver = "3"` انتخاب نسخه با توجه به سازگاری Rust را بهبود می‌دهد، اما تضمین خودکار سازگاری همهٔ APIها یا MSRV dependencyها نیست. پروژهٔ async با `[workspace]` مستقل و `exclude` جدا شده است.

```bat
cmd /c cargo metadata --no-deps --format-version 1
cmd /c cargo check --workspace --offline
cmd /c cargo check --manifest-path projects/003_async_api/Cargo.toml
```

## Feature و cfg

featureهای Cargo قابلیت‌های اختیاری را فعال می‌کنند؛ در dependency graph معمولاً به‌صورت additive با هم متحد می‌شوند. آن‌ها را برای دو حالت ناسازگارِ انحصاری بدون طراحی صریح استفاده نکن. `#[cfg(...)]` کد را مشروط کامپایل می‌کند؛ `cfg!` صرفاً یک مقدار bool تولید می‌کند و شاخه‌هایش همچنان باید از نظر نام و نوع معتبر باشند.

```rust
#[cfg(target_os = "windows")]
fn platform_label() -> &'static str { "windows" }

#[cfg(not(target_os = "windows"))]
fn platform_label() -> &'static str { "other" }
```

`#[cfg(test)]` کد ویژهٔ unit test را محدود می‌کند. برای فایل‌مسیر، به جای چسباندن separator سیستم‌عامل از `PathBuf::join` استفاده کن.

## build.rs و انتشار

`build.rs` هنگام build اجرا می‌شود و می‌تواند binding یا کد بومی بسازد؛ بنابراین dependency و build script کد اجرایی‌اند، نه فقط داده. برای مثال‌های پایه به آن نیاز نداریم. هنگام انتشار library، visibility، SemVer، featureها، MSRV، license و مستندات بخشی از API عمومی‌اند.

**تمرین:** منطق اعتبارسنجی SKU انبار را به module داخلی منتقل کن بدون آنکه API عمومی یا تست‌های integration تغییر کنند. تنها در صورت رشد واقعی پروژه آن را چند crate کن.

منبع: [Module System](https://doc.rust-lang.org/book/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html)، [Cargo Features](https://doc.rust-lang.org/cargo/reference/features.html)، [Workspaces](https://doc.rust-lang.org/cargo/reference/workspaces.html).

</div>
