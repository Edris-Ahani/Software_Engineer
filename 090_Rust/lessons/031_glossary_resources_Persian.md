<div dir="rtl">

[English version](031_glossary_resources_English.md)

# ۰۳۱ ـ واژه‌نامه، مرور و منابع رسمی

[فهرست](../README_Persian.md) · [قبلی](030_solutions_Persian.md)

| اصطلاح | معنای کاربردی |
| --- | --- |
| Ownership | مسئولیت مالکیت و پایان عمر یک مقدار |
| Move | انتقال مالکیت؛ الزاماً کپی عمیق نیست |
| Borrow | دسترسی بدون گرفتن مالکیت |
| Lifetime | محدودهٔ اعتبار reference؛ annotation رابطه را بیان می‌کند |
| Slice | view از دنباله با طول، بدون مالکیت مستقل |
| RAII / Drop | آزادسازی منبع با پایان عمر owner یا guard |
| Trait | قرارداد قابلیت نوع |
| Generic | تعریف الگوریتم یا نوع پارامتری |
| Monomorphization | تولید کد برای نوع‌های مشخص generic |
| Dyn dispatch | انتخاب پیاده‌سازی از طریق trait object در runtime |
| Interior mutability | تغییر کنترل‌شده از راه shared reference |
| Send / Sync | قرارداد انتقال یا اشتراک امن بین threadها |
| Future / Poll | نمایش کار async و وضعیت آماده یا منتظر |
| Executor / Runtime | پیشبرد taskها و امکانات اجرای async |
| Backpressure | بازتاب ظرفیت محدود consumer به producer |
| Pin / Unpin | قرارداد جابه‌جایی دادهٔ حساس به آدرس |
| FFI / ABI | مرز فراخوانی با زبان دیگر و قرارداد باینری آن |
| Crate / Package | واحد کامپایل / مجموعهٔ تعریف‌شده با manifest |
| Workspace | مدیریت مشترک چند package |
| MSRV | حداقل نسخهٔ compiler پشتیبانی‌شده |

## پرسش‌های مرور

**آیا Rust شیءگراست؟** encapsulation و polymorphism با struct، impl و trait دارد؛ inheritance کلاس‌محور مدل اصلی آن نیست. enum و composition ابزارهای مهم طراحی‌اند.

**آیا همهٔ داده‌ها روی stack هستند؟** خیر. String، Vec، Box و بسیاری از نوع‌ها می‌توانند heap داشته باشند. owner و محل storage دو مفهوم متفاوت‌اند.

**آیا Arc همان Mutex است؟** خیر؛ اولی مالکیت مشترک و دومی دسترسی هماهنگ می‌دهد. `Arc<RefCell<T>>` به‌تنهایی راه‌حل چندنخی نیست.

**آیا async یعنی parallel؟** خیر؛ futureها می‌توانند روی یک thread هم پیش بروند. برای کار CPU باید مدل اجرا و تعداد هسته‌ها را جدا بررسی کرد.

**آیا clone همیشه گران است؟** هزینه به نوع بستگی دارد؛ String معمولاً buffer را کپی می‌کند ولی Arc شمارش owner را تغییر می‌دهد.

**آیا safe Rust leak یا deadlock ندارد؟** ممکن است داشته باشد. تضمین‌های حافظه جای correctness منطق و محدودیت منابع را نمی‌گیرند.

**چه زمانی به lifetime صریح نیاز دارم؟** وقتی رابطهٔ referenceهای API برای elision روشن نباشد، یا struct/view به borrow وابسته باشد؛ نه برای هر متغیر.

## منابع برای ادامه

- [The Rust Book](https://doc.rust-lang.org/book/): آموزش اصلی زبان؛ برای تکمیل هر فصل این دوره.
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/): مثال‌های کوتاه و قابل آزمایش.
- [Standard Library](https://doc.rust-lang.org/std/): قرارداد دقیق APIهای std، انواع خطا و پیچیدگی‌ها.
- [Rust Reference](https://doc.rust-lang.org/reference/): جزئیات رسمی syntax، type و رفتار زبان.
- [Rust Edition Guide](https://doc.rust-lang.org/edition-guide/): تفاوت editionها و migration.
- [Cargo Book](https://doc.rust-lang.org/cargo/): feature، workspace، profile، dependency و انتشار.
- [rustup Book](https://rust-lang.github.io/rustup/): toolchain، target و پیش‌نیازهای نصب.
- [Rustlings](https://github.com/rust-lang/rustlings): تمرین‌های کوچک با خطاهای عمدی.
- [Tokio](https://tokio.rs/tokio/tutorial): runtime، channel، select و shutdown.
- [Serde](https://serde.rs/): serialization و مدل داده.
- [Axum](https://docs.rs/axum/0.8/axum/): extractor، routing، state و response.
- [Rustonomicon](https://doc.rust-lang.org/nomicon/): قراردادهای پیشرفتهٔ unsafe؛ بعد از تثبیت مبانی.
- [Embedded Rust](https://docs.rust-embedded.org/book/): سخت‌افزار، no_std و محیط bare metal.

برای مطالعهٔ آفلاین پس از نصب با rustup:

```bat
cmd /c rustup doc --book
cmd /c rustup doc --std
cmd /c rustup doc --reference
```

بهتر است پس از دوره یک ابزار کوچک واقعی را با Rust بسازی، API و خطاهایش را مستند کنی و مصرف منابعش را اندازه بگیری. سپس با توجه به پروژه، یکی از مسیرهای backend، سیستم، WASM یا embedded را عمیق‌تر ادامه بده.

</div>
