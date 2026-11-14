<div dir="rtl">

[English version](003_cargo_English.md)

# ۰۰۳ ـ Cargo و چرخهٔ توسعه

[فهرست](../README_Persian.md) · [قبلی](002_installation_Persian.md) · [بعدی](004_basics_Persian.md)

`rustc` کامپایلر است، `rustup` نسخه‌ها و targetها را مدیریت می‌کند و Cargo ساخت package، dependency، تست و مستندات را هماهنگ می‌کند. package یک manifest دارد و می‌تواند یک library و چند binary داشته باشد؛ crate یک واحد کامپایل است. workspace چند package را زیر یک مدیریت جمع می‌کند.

## فایل‌های مهم

| مسیر | نقش |
| --- | --- |
| `Cargo.toml` | مشخصات package، edition و dependencyها |
| `Cargo.lock` | نسخه‌های حل‌شدهٔ dependencyها؛ برای برنامه‌ها نگهداری شود |
| `src/main.rs` | نقطهٔ ورود binary پیش‌فرض |
| `src/lib.rs` | API کتابخانه |
| `src/bin/001_example.rs` | binary مستقل با نام `001_example` |
| `tests/` | تست‌های integration، مصرف‌کنندهٔ API عمومی |
| `target/` | خروجی موقت build؛ وارد Git نشود |

در این دوره [manifest ریشه](../Cargo.toml) سه عضو دارد؛ package آموزشی با نام `rust-lessons` از طریق `-p` انتخاب می‌شود. نام package لازم نیست با نام پوشه یکی باشد. خط تیرهٔ نام library در کد به underscore تبدیل می‌شود؛ مثلاً package با نام `log-search` در `use log_search` وارد می‌شود.

## فرمان‌ها از ریشهٔ دوره

```bat
cmd /c cargo check --workspace --offline
cmd /c cargo build --workspace --offline
cmd /c cargo run -p rust-lessons --bin 001_basics
cmd /c cargo test --workspace --offline
cmd /c cargo test --workspace --doc --offline
cmd /c cargo fmt --all -- --check
cmd /c cargo clippy --workspace --all-targets --offline -- -D warnings
cmd /c cargo doc --workspace --no-deps --open
cmd /c cargo build -p log-search --release --offline
```

`check` تحلیل و type checking انجام می‌دهد و خروجی اجرایی کامل نمی‌سازد؛ وجود linker را با `build` یا `run` بررسی کن. `--` آرگومان‌های Cargo را از آرگومان برنامه یا ابزار جدا می‌کند. `--release` profile بهینه‌شده را انتخاب می‌کند؛ زمان build معمولاً بیشتر می‌شود.

خروجی release پروژهٔ CLI روی Windows در `target/release/log-search.exe` است. برای Linux/macOS پسوند `.exe` ندارد.

## وابستگی و نسخه

در پروژهٔ اختیاری API از `tokio = "1"`، `serde = "1"` و `axum = "0.8"` استفاده شده است. این بازه‌ها patch دقیق را ثابت نمی‌کنند؛ lockfile نتیجهٔ انتخاب واقعی را ثبت می‌کند. برای نخستین بار dependencyها باید دانلود شوند؛ `--offline` فقط از cache استفاده می‌کند و چیزی دانلود نمی‌کند. پس از تولید lockfile و بررسی موفق، در CI از `--locked` استفاده کن.

```bat
cmd /c cargo tree --manifest-path projects/003_async_api/Cargo.toml
cmd /c cargo fetch --manifest-path projects/003_async_api/Cargo.toml
```

نسخهٔ compiler، edition و حداقل نسخهٔ Rust یا MSRV سه مفهوم مستقل‌اند. Edition 2024 با Rust 1.85 معرفی شد؛ یک dependency می‌تواند compiler جدیدتری بخواهد. دستور `rustup update stable` نسخه را به‌روز می‌کند، نه edition فایل پروژه را.

**تمرین:** بدون تغییر فایل‌های دوره، یک برنامه زیر `scratch/` بساز. تفاوت اجرای `cargo check`، `cargo run` و `cargo test` را توضیح بده. سپس یک تابع را به `lib.rs` منتقل کن و از `main.rs` صدا بزن.

منبع: [The Cargo Book](https://doc.rust-lang.org/cargo/)، [Edition 2024](https://doc.rust-lang.org/edition-guide/rust-2024/index.html).

</div>
