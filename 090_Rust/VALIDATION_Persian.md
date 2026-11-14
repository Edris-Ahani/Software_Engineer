<div dir="rtl">

[English version](VALIDATION_English.md)

# بررسی محتوای دوره و اجرای نمونه‌ها

[فهرست دوره](README_Persian.md)

## بررسی قابل تکرار

اگر Node.js در دسترس است، از ریشهٔ `090_Rust` فقط ساختار محتوا را بررسی کن:

```bat
cmd /c node --check scripts/check.mjs
cmd /c node scripts/check.mjs --content-only
```

اسکریپت، لینک‌های نسبی، زوج‌بودن code fenceها، wrapper راست‌به‌چپ فایل‌های فارسی، نبود حروف فارسی در کدها و بلوک‌های کد، وجود جفت کامل فارسی و انگلیسی برای هر توضیح، یکسان‌بودن بلوک‌های کد دو نسخه و ترتیب ۳۱ درس در هر زبان، ۲۱ مثال و ۳ پروژه را کنترل می‌کند. این کار compiler Rust، parser کامل TOML، formatter، بررسی زندهٔ وب‌سایت‌ها یا اثبات صحت برنامه نیست.

پس از نصب Rust و componentهای rustfmt و clippy، بررسی اصلی:

```bat
cmd /c node scripts/check.mjs
cmd /c node scripts/check.mjs --with-web
```

فرمان اول check، fmt، clippy و test workspace اصلی و اجرای تک‌تک ۲۱ مثال و دو demo اصلی را انجام می‌دهد. فرمان دوم علاوه بر آن پروژهٔ وب، تست HTTP و صف async را هم بررسی می‌کند و dependency دانلود می‌کند. سرور بلندمدت در اسکریپت اجرا نمی‌شود. هر فرمان timeout دارد و خطا باعث خروج ناموفق نهایی می‌شود. نبود Cargo نیز به‌صورت صریح با خروج ناموفق گزارش می‌شود.

Node برای خود پروژه‌های Rust لازم نیست. می‌توان دستورهای زیر را دستی اجرا کرد:

```bat
cmd /c cargo fmt --all
cmd /c cargo fmt --all -- --check
cmd /c cargo clippy --workspace --all-targets --offline -- -D warnings
cmd /c cargo test --workspace --offline
cmd /c cargo run -p rust-lessons --bin 001_basics
cmd /c cargo run -p inventory
cmd /c cargo run -p log-search -- ERROR projects/001_log_search/data/sample.log
cmd /c cargo fmt --manifest-path projects/003_async_api/Cargo.toml
cmd /c cargo test --manifest-path projects/003_async_api/Cargo.toml
```

دو فرمان fmt بدون `--check` قالب‌بندی فایل‌ها را اصلاح می‌کنند؛ سایر فرمان‌ها رفتار را بررسی می‌کنند. اجرای `cargo test`، تمام mainهای مثال را اجرا نمی‌کند؛ برای اجرای همه از اسکریپت یا فرمان run هر فایل استفاده کن. برای مقایسهٔ خروجی، README و درس مرتبط را بخوان.

## وضعیت محیط تهیهٔ آموزش

در محیط این کار، `rustc` و `cargo` در PATH و محل متداول نصب کاربر پیدا نشدند. بنابراین اجرای compiler، rustfmt، clippy، تست‌های Rust و دانلود/build وابستگی‌های وب در این محیط انجام نشده است و موفقیت آن‌ها ادعا نمی‌شود. روی سیستم چیزی نصب نشده است.

نتیجهٔ اجرا در زمان تهیهٔ دوره:

- بررسی syntax اسکریپت با `node --check` موفق بود.
- بررسی محتوا موفق بود: ۷۷ فایل Markdown شامل ۳۶ جفت کامل فارسی و انگلیسی و ۵ صفحهٔ کوتاه انتخاب زبان؛ جفت‌ها شامل ۳۱ درس در هر زبان، معرفی دوره، گزارش بررسی و راهنمای ۳ پروژه‌اند. ترتیب شماره‌ها، لینک‌های نسبی، یکسان‌بودن بلوک‌های کد و قواعد زبان و جهت متن بررسی شدند.
- اجرای کامل اسکریپت پس از بررسی محتوا، به علت نبود Cargo با کد خروج ۱ متوقف شد؛ هیچ تست Rust اجرا نشد. این توقف، جای نتیجهٔ موفق تست‌ها ثبت نشده است.

برای شروع عملی، [راهنمای نصب](lessons/002_installation_Persian.md) را انجام بده و سپس اسکریپت را دوباره اجرا کن. وابستگی خارجی پروژهٔ وب نسخهٔ patch ثابت ندارد؛ پس از نخستین resolve و تست موفق، lockfile آن را نگه دار. workspace اصلی dependency خارجی ندارد.

</div>
