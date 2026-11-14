<div dir="rtl">

[English version](027_troubleshooting_English.md)

# ۰۲۷ ـ خطاهای رایج و روش رفع آن‌ها

[فهرست](../README_Persian.md) · [قبلی](026_security_deployment_Persian.md) · [بعدی](028_projects_Persian.md)

اولین خطای compiler را از بالا بخوان؛ خطاهای بعدی ممکن است پیامد همان باشند. کوچک‌ترین مثال بازتولیدکننده بساز و مالک داده، آخرین استفادهٔ borrow و نوع مورد انتظار تابع را مشخص کن.

| نشانه | علت محتمل | اقدام |
| --- | --- | --- |
| rustc/cargo شناخته نمی‌شود | PATH یا نصب ناقص | ترمینال جدید، `where cargo`، بررسی `.cargo/bin` |
| `link.exe not found` | ابزار MSVC یا SDK نصب نیست | نصب workload C++ و بررسی Developer Command Prompt |
| `cc not found` در Unix | linker/toolchain بومی غایب | نصب ابزارهای توسعهٔ سیستم‌عامل |
| dependency compiler جدید می‌خواهد | MSRV dependency بالاتر است | stable را به‌روز کن یا نسخهٔ سازگار را آگاهانه انتخاب کن |
| E0382 | استفاده پس از move | borrowing، جابه‌جایی ترتیب یا clone با دلیل |
| E0502 | borrow مشترک و mutable هم‌پوشان | آخرین استفادهٔ reference را پیش از mutation تمام کن |
| E0499 | دو mutable borrow ناسازگار | کوتاه‌کردن scope یا `split_at_mut` |
| E0597 / E0515 | reference از owner بیشتر عمر می‌کند | خروجی مالک یا buffer متعلق به caller |
| E0308 | نوع مورد انتظار با مقدار متفاوت است | نوع expression، Option/Result و سمی‌کالن انتهایی را بررسی کن |
| future قابل Send نیست | guard یا Rc از await عبور می‌کند | scope کوتاه‌تر، مالکیت مناسب و synchronization درست |
| برنامه با channel پایان نمی‌یابد | sender اضافی زنده است | تمام ownerهای sender و ترتیب join را بررسی کن |
| API روی port اجرا نمی‌شود | پورت اشغال یا bind نامعتبر | مصرف‌کنندهٔ پورت و آدرس bind را بررسی کن |

## ابزارهای تشخیص

```bat
cmd /c rustc --explain E0382
cmd /c rustc --explain E0502
cmd /c rustup show
cmd /c cargo check --workspace --offline
cmd /c cargo tree --manifest-path projects/003_async_api/Cargo.toml
```

اگر workspace اصلی در حالت offline خطای دانلود dependency می‌دهد، بررسی کن تصادفاً manifest پروژهٔ وب را انتخاب نکرده باشی. اگر toolchain از قبل نصب نشده، خود rustup هم ممکن است برای دریافت compiler به شبکه نیاز داشته باشد؛ offline فقط مربوط به Cargo dependency resolution است.

## نمونهٔ borrow هم‌پوشان

نمونهٔ زیر عمداً خطا می‌دهد:

```compile_fail
let mut values = vec![1, 2];
let first = &values[0];
values.push(3);
println!("{first}");
```

push می‌تواند buffer را جابه‌جا کند. اگر فقط مقدار عددی را لازم داری، `let first = values[0];` یک Copy مستقل می‌دهد. اگر view لازم داری، استفاده از آن را پیش از push تمام کن. reserve کردن ظرفیت، قرارداد borrow checker را حذف نمی‌کند.

## panic و backtrace

برای اجرای تشخیصی یک برنامه روی Windows:

```bat
cmd /c "set RUST_BACKTRACE=1&& cargo run -p rust-lessons --bin 001_basics"
```

در این مثال عادی panic انتظار نمی‌رود؛ فرمان نشان می‌دهد چطور backtrace را برای همان child process فعال کنی. در Unix شکل آن `RUST_BACKTRACE=1 cargo run ...` است. از انتشار backtrace حاوی مسیرها یا دادهٔ حساس در محیط عمومی خودداری کن.

**تمرین:** مثال نامعتبر را در scratch بازسازی و با دو راه اصلاح کن: کپی عدد و جابه‌جایی ترتیب عملیات. توضیح بده چرا clone کل Vec راه‌حل ضروری نیست.

منبع: [Rust Error Index](https://doc.rust-lang.org/error_codes/error-index.html)، [Windows MSVC](https://rust-lang.github.io/rustup/installation/windows-msvc.html).

</div>
