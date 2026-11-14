<div dir="rtl">

[English version](002_installation_English.md)

# ۰۰۲ ـ نصب Rust روی سیستم‌عامل‌ها

[فهرست](../README_Persian.md) · [قبلی](001_introduction_Persian.md) · [بعدی](003_cargo_Persian.md)

هدف: نصب toolchain، linker و ابزارهای کیفیت، سپس ساخت یک برنامه. تنها دیدن نسخهٔ `rustc` کافی نیست؛ یک `cargo run` موفق نشان می‌دهد linker نیز آماده است. مراحل زیر دستورالعمل نصب هستند؛ ایجاد این دوره، چیزی روی سیستم تو نصب نمی‌کند.

## Windows بومی: مسیر MSVC

۱. از [صفحهٔ رسمی نصب Rust](https://rust-lang.org/install/) فایل `rustup-init.exe` متناسب با معماری x64 یا ARM64 را دریافت کن. معماری را از Settings → System → About بررسی کن.

۲. پیش‌نیاز MSVC را طبق [راهنمای رسمی rustup](https://rust-lang.github.io/rustup/installation/windows-msvc.html) نصب کن. در Visual Studio Installer، بستهٔ **Build Tools for Visual Studio** و workload **Desktop development with C++** را انتخاب کن. ابزار MSVC متناسب با معماری و Windows SDK نیز باید انتخاب شده باشند. VS Code به‌تنهایی linker نصب نمی‌کند.

۳. `rustup-init.exe` را اجرا و نصب پیش‌فرض stable با ABI نوع MSVC را انتخاب کن. برای سیستم x64 معمولاً target برابر `x86_64-pc-windows-msvc` است. GNU مسیر جداگانه‌ای دارد و برای نیاز خاص MinGW/MSYS2 مطرح است؛ این دو محیط را بی‌دلیل مخلوط نکن.

۴. ترمینال را ببند و باز کن؛ سپس در Command Prompt یا PowerShell اجرا کن:

```bat
cmd /c rustup show
cmd /c rustc --version
cmd /c cargo --version
cmd /c where rustc
cmd /c where cargo
```

ابزارها معمولاً در `%USERPROFILE%\.cargo\bin` قرار دارند. اگر شناسایی نشدند، PATH کاربر و بازشدن ترمینال جدید را بررسی کن. برای خطای `link.exe not found` ابتدا نصب workload و SDK را بررسی کن؛ در صورت نیاز از Developer Command Prompt مربوط به Visual Studio استفاده کن.

## Linux

روی Debian/Ubuntu ابتدا ابزار ساخت را نصب کن؛ نصب بسته‌های سیستم ممکن است دسترسی administrator بخواهد:

```bash
sudo apt update
sudo apt install build-essential curl ca-certificates
```

روی Fedora معادل آن:

```bash
sudo dnf install gcc gcc-c++ make curl ca-certificates
```

سپس نصب رسمی rustup را با حساب عادی اجرا کن:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. "$HOME/.cargo/env"
rustup show
rustc --version
cargo --version
```

این دستور اسکریپت رسمی را دانلود و اجرا می‌کند. اگر سیاست محیط اجرای مستقیم اسکریپت دانلودشده را نمی‌پذیرد، آن را ابتدا در فایل ذخیره و بررسی کن. استفادهٔ هم‌زمان از Rust مدیر بستهٔ توزیع و rustup می‌تواند به اجرای نسخهٔ اشتباه منجر شود؛ مسیر `command -v rustc` را بررسی کن.

## macOS: Intel و Apple Silicon

ابتدا Command Line Tools را نصب کن، سپس rustup:

```bash
xcode-select --install
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. "$HOME/.cargo/env"
rustup show
rustc --version
cargo --version
```

روی Apple Silicon معمولاً target بومی `aarch64-apple-darwin` و روی Intel برابر `x86_64-apple-darwin` است. ترمینال تحت Rosetta ممکن است معماری متفاوتی تشخیص دهد؛ پیش از نصب، اجرای بومی ترمینال و خروجی `uname -m` را بررسی کن. ابزار Xcode نقش compiler/linker بومی را تأمین می‌کند.

## Windows با WSL

WSL یک محیط Linux جداست؛ Rust آن را داخل همان توزیع و با مراحل Linux نصب کن. `cargo.exe` ویندوز جای Cargo لینوکس نیست. برای این دوره نصب WSL ضروری نیست. اگر WSL را انتخاب کردی، بهتر است checkout و خروجی build را در فایل‌سیستم Linux نگه داری و dependencyهای بومی را همان‌جا نصب کنی. [راهنمای رسمی Microsoft](https://learn.microsoft.com/en-us/windows/dev-environment/rust/setup) تفاوت مسیر بومی و WSL را توضیح می‌دهد.

## اولین پروژه و کنترل نصب

در یک مسیر تمرینی که هنوز پوشهٔ `hello_rust` ندارد، روی Windows:

```bat
cmd /c cargo new hello_rust --edition 2024
cmd /c cargo run --manifest-path hello_rust/Cargo.toml
```

خروجی باید `Hello, world!` باشد. در Unix پیشوند `cmd /c` را حذف کن. پروژهٔ ساخته‌شده توسط کاربر خارج از فایل‌های دوره قرار می‌گیرد؛ برای حفظ همهٔ تمرین‌ها در همین پوشه می‌توانی آن را زیر `scratch/` بسازی.

## ابزارهای روزانه و نگهداری نسخه

```bat
cmd /c rustup component add rustfmt clippy
cmd /c rustup update stable
cmd /c rustup doc --book
cmd /c rustup target list --installed
```

در VS Code افزونهٔ رسمی **rust-analyzer** را نصب کن و پوشهٔ حاوی `Cargo.toml` را باز کن. برای debugger، افزونه و debugger متناسب با سیستم‌عامل لازم است. نسخهٔ stable برای این دوره کافی است؛ nightly تنها برای ابزار یا feature مشخص استفاده می‌شود.

برای تکرارپذیری تیمی، پس از موفقیت build یک نسخهٔ دقیق آزموده‌شده را در `rust-toolchain.toml` ثبت کن؛ مقدار متحرک `stable` نتیجه را در طول زمان ثابت نگه نمی‌دارد. قبل از دانلود toolchain، فضای کافی برای compiler، کتابخانه‌ها و پوشهٔ `target` در نظر بگیر.

**کنترل نهایی:** در ریشهٔ دوره `cmd /c cargo run -p rust-lessons --bin 001_basics` را اجرا کن. اگر خطا آمد، [درس عیب‌یابی](027_troubleshooting_Persian.md) را ببین.

منابع: [نصب رسمی](https://rust-lang.org/install/)، [پیش‌نیازهای Windows MSVC](https://rust-lang.github.io/rustup/installation/windows-msvc.html)، [نصب در Rust Book](https://doc.rust-lang.org/book/ch01-01-installation.html).

</div>
