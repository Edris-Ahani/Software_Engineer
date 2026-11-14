<div dir="rtl">

[English version](README_English.md)

# پروژهٔ ۰۰۱ ـ جست‌وجوی Stream در فایل لاگ

[بازگشت به دوره](../../README_Persian.md) · [آموزش I/O](../../lessons/022_io_networking_Persian.md)

هدف: خواندن فایل متنی بدون بارگذاری کامل، پیدا کردن خطوط شامل query و چاپ شمارهٔ آن‌ها. برنامه فایل ورودی را تغییر نمی‌دهد و dependency خارجی ندارد.

تمام فرمان‌های این صفحه از ریشهٔ `090_Rust` اجرا می‌شوند:

```bat
cmd /c cargo run -p log-search -- ERROR projects/001_log_search/data/sample.log
cmd /c cargo run -p log-search -- error projects/001_log_search/data/sample.log --ignore-ascii-case
cmd /c cargo test -p log-search --offline
```

دو فرمان اجرا این خروجی را دارند:

```text
2:ERROR payment declined
4:ERROR cache unavailable
```

## قرارداد ورودی و خروجی

فرمت آرگومان `log-search <query> <file> [--ignore-ascii-case]` است. query خالی و گزینهٔ ناشناخته رد می‌شود؛ اگر مسیر فاصله دارد آن را داخل double quote قرار بده. query باید UTF-8 باشد و مسیر فایل از نوع OsString/PathBuf گرفته می‌شود. فایل باید متن UTF-8 باشد.

کد خروج ۰ به معنی یافتن match، ۱ نبود match و ۲ خطای آرگومان یا I/O است. داده روی stdout و خطا روی stderr می‌رود. BrokenPipe خروج موفق دارد تا اتصال به consumerی که زود بسته می‌شود طبیعی باشد.

## ساختار

- [lib.rs](src/lib.rs): SearchOptions و تابع عمومی search روی BufRead/Write.
- [main.rs](src/main.rs): parsing، بازکردن فایل، buffer و exit code.
- [search.rs](tests/search.rs): موفقیت، CRLF، نبود match، UTF-8 خراب و شکست writer.
- [دادهٔ نمونه](data/sample.log): فایل پنج‌خطی برای smoke check.

## محدودیت و توسعه

حافظه با بزرگ‌ترین خط رشد می‌کند، نه کل فایل؛ سقف طول خط در این نسخه وجود ندارد. خط‌ها با `lines` خوانده می‌شوند، پس newline ورودی حذف و در خروجی بازسازی می‌شود. این ابزار regex، جست‌وجوی باینری یا normalization عمومی Unicode ندارد. case-insensitive بودن فقط ASCII است. نتیجهٔ قبلاً نوشته‌شده در stdout با خطای دیرتر rollback نمی‌شود.

تمرین بعدی: گزینهٔ count و سقف طول خط را با حفظ قرارداد خطا اضافه کن. برای فهم طراحی از [درس پروژه‌ها](../../lessons/028_projects_Persian.md) شروع کن.

</div>
