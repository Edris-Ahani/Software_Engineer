<div dir="rtl">

[English version](021_unsafe_ffi_English.md)

# ۰۲۱ ـ unsafe، FFI و قرارداد حافظه

[فهرست](../README_Persian.md) · [قبلی](020_advanced_types_Persian.md) · [بعدی](022_io_networking_Persian.md)

unsafe بررسی نوع‌ها یا borrow checker را خاموش نمی‌کند؛ اجازهٔ مجموعه‌ای از عملیات با تعهد ایمنی دستی را می‌دهد، مانند dereference کردن raw pointer یا صدا زدن تابع unsafe. برنامه‌نویس باید preconditionها را اثبات کند. خطای این proof می‌تواند به undefined behavior منجر شود.

## یک wrapper کوچک با قرارداد روشن

[مثال ۰۱۷](../examples/src/bin/017_unsafe.rs) نسخهٔ آموزشی تقسیم `&mut [u8]` را دارد. در تولید از `split_at_mut` استاندارد استفاده کن. wrapper ابتدا مرز middle را کنترل می‌کند، سپس دو محدودهٔ جدا و درون buffer را می‌سازد. کامنت `SAFETY` دلیل معتبر بودن pointer، طول و عدم overlap را ثبت می‌کند.

```bat
cmd /c cargo run -p rust-lessons --bin 017_unsafe
cmd /c cargo test -p rust-lessons --bin 017_unsafe --offline
```

خروجی برنامه `[9, 2, 8, 4]` است. تست‌ها مرز صفر، انتهای slice و index نامعتبر را پوشش می‌دهند. تست موفق اثبات همهٔ شرایط ایمنی نیست؛ از جمله alignment، provenance، initialized بودن و aliasing باید در استدلال بررسی شوند.

قید `unsafe_op_in_unsafe_fn = "deny"` در workspace باعث می‌شود حتی داخل unsafe fn نیز عملیات unsafe در block صریح باشد. کوچک‌نگه‌داشتن blockها بازبینی را آسان می‌کند.

## FFI: عبور از مرز Rust و C

`extern "C"` ABI را مشخص می‌کند؛ `#[repr(C)]` layout سازگار با قرارداد C برای struct می‌دهد. هیچ‌کدام `String` یا `Vec` را خودبه‌خود به دادهٔ قابل تبادل با C تبدیل نمی‌کند. معمولاً pointer همراه length یا handle opaque می‌فرستی و مالکیت و تابع آزادسازی را صریح تعریف می‌کنی.

```rust
#[repr(C)]
pub struct ByteView {
    pub data: *const u8,
    pub length: usize,
}

#[unsafe(no_mangle)]
pub extern "C" fn add_saturating(left: u32, right: u32) -> u32 {
    left.saturating_add(right)
}
```

این قطعه نمایش قرارداد layout/export است و library قابل لینک کامل همراه header C نیست. برای ساخت آن، crate-type و header، toolchain مقصد و تست از سمت C لازم است. Edition 2024 برای `no_mangle` syntax نوع unsafe attribute دارد؛ یکتایی symbol exportشده بخشی از قرارداد است.

## پرسش‌های ضروری مرز FFI

- چه کسی buffer را تخصیص داده و چه کسی با کدام allocator آزاد می‌کند؟
- pointer تا چه زمانی معتبر و با چه alignment و lengthی قابل استفاده است؟
- آیا null مجاز است؟ آیا callback از thread دیگر یا پس از پایان call اجرا می‌شود؟
- خطا با error code، handle یا buffer گزارش می‌شود؟
- آیا panic ممکن است از مرز ABI عبور کند؟ قرارداد باید مانع unwind نامجاز باشد.

برای C string، `CString` و `CStr` مناسب‌تر از فرض دلخواه دربارهٔ NUL هستند؛ وجود NUL داخلی نیز باید بررسی شود. `transmute` ابزار تبدیل عمومی نوع نیست و برای parser یا serialization معمولاً انتخاب نادرستی است. union و static mut نیز قراردادهای ایمنی دارند؛ در کد عادی از نوع‌های safe و synchronization استفاده کن.

**تمرین:** پنج شرط ایمنی block مثال را با جملهٔ خودت بنویس. سپس توضیح بده چرا pointer غیرnull به‌تنهایی به معنی pointer قابل خواندن نیست.

منبع: [Unsafe Rust](https://doc.rust-lang.org/book/ch20-01-unsafe-rust.html)، [Rustonomicon FFI](https://doc.rust-lang.org/nomicon/ffi.html)، [Edition 2024 Unsafe Attributes](https://doc.rust-lang.org/edition-guide/rust-2024/unsafe-attributes.html).

</div>
