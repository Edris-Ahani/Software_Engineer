<div dir="rtl">

[English version](022_io_networking_English.md)

# ۰۲۲ ـ فایل، Stream، CLI و شبکه

[فهرست](../README_Persian.md) · [قبلی](021_unsafe_ffi_Persian.md) · [بعدی](023_serde_database_Persian.md)

مرز I/O محل خطای واقعی است: فایل ممکن است حذف شود، UTF-8 خراب باشد، خروجی بسته شود یا socket پاسخ ندهد. منطق پردازش را به traitهایی مثل `BufRead` و `Write` وابسته کن تا هم فایل واقعی و هم buffer حافظه قابل استفاده باشند.

```rust
use std::io::{BufRead, Write};
fn copy_lines(reader: impl BufRead, mut writer: impl Write) -> std::io::Result<()> {
    for line in reader.lines() { writeln!(writer, "{}", line?)?; }
    writer.flush()
}
```

`read_to_string` کل فایل را یکجا می‌خواند؛ `BufReader` تعداد syscallهای ریز را کم می‌کند و پردازش خطی می‌تواند حافظه را به بزرگ‌ترین خط محدود کند. `lines()` هر خط را در String می‌سازد و newline را حذف می‌کند. بنابراین این روش byte-for-byte copy نیست و برای فایل باینری مناسب نیست.

[مثال ۰۱۸](../examples/src/bin/018_streaming_io.rs) از `Cursor` می‌خواند و فقط `ERROR database unavailable` را چاپ می‌کند:

```bat
cmd /c cargo run -p rust-lessons --bin 018_streaming_io
cmd /c cargo run -p log-search -- ERROR projects/001_log_search/data/sample.log
```

برنامهٔ دوم خروجی زیر دارد:

```text
2:ERROR payment declined
4:ERROR cache unavailable
```

## طراحی CLI واقعی

[main پروژه](../projects/001_log_search/src/main.rs) از `args_os` استفاده می‌کند تا نام فایل الزاماً UTF-8 نباشد؛ query متنی را جدا اعتبارسنجی می‌کند. خروجی داده به stdout و پیام خطا به stderr می‌رود. کد خروج ۰ یعنی match پیدا شده، ۱ یعنی match وجود ندارد و ۲ یعنی خطا. BrokenPipe برای سازگاری با pipe موفق تلقی می‌شود.

برای CLI بزرگ‌تر، parserهایی مثل clap، help، subcommand و autocomplete مفیدند؛ برای این مثال std کافی است. `exit` ناگهانی را جایگزین return نکن، چون می‌تواند destructor و flushهای مورد انتظار را دور بزند.

## قرارداد شبکه

TCP stream مرز پیام ندارد: یک `read` ممکن است فقط بخشی از داده را بدهد و یک `write` ممکن است همهٔ buffer را ننویسد. از `read_exact` یا `write_all` وقتی قراردادش مناسب است استفاده کن و framing، سقف اندازه و timeout را صریح تعیین کن. عدد صفرِ read معمولاً EOF است.

HTTP و JSON را بهتر است با کتابخانهٔ آزموده‌شده مدیریت کنی؛ یک split ساده روی newline، HTTP parser قابل اتکا نیست. پروژهٔ API از Axum برای routing و extractor استفاده می‌کند و فقط روی localhost گوش می‌دهد.

نوشتن موفق در buffer یا `flush()` الزاماً به معنی ماندگاری روی دیسک نیست. برای ذخیره‌سازی durable به سیاست `sync_all`، فایل موقت، rename و رفتار سیستم‌عامل فکر کن. حتی rename اتمیک در یک filesystem به‌تنهایی تضمین همهٔ سناریوهای قطع برق نیست.

**تمرین:** writer با خطای flush را تست کن. برای ورودی نامعتبر UTF-8 توضیح بده آیا باید رد شود، باینری خوانده شود یا با replacement نمایش داده شود؛ این انتخاب قرارداد محصول است.

منبع: [std::io](https://doc.rust-lang.org/std/io/)، [std::net](https://doc.rust-lang.org/std/net/)، [CLI Project](https://doc.rust-lang.org/book/ch12-00-an-io-project.html).

</div>
