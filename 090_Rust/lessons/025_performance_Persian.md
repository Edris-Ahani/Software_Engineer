<div dir="rtl">

[English version](025_performance_English.md)

# ۰۲۵ ـ عملکرد، حافظه و اندازه‌گیری

[فهرست](../README_Persian.md) · [قبلی](024_wasm_embedded_Persian.md) · [بعدی](026_security_deployment_Persian.md)

Rust امکان کنترل هزینه را می‌دهد، ولی الگوریتم ضعیف را خودکار بهینه نمی‌کند. ابتدا معیار بساز: latency، throughput، peak memory، تعداد allocation و اندازهٔ binary. ورودی آزمایش باید نمایندهٔ دادهٔ واقعی باشد و مقایسه در profile یکسان انجام شود.

## تحلیل مثال‌های دوره

| مثال | زمان | حافظهٔ اضافه و نکته |
| --- | --- | --- |
| تخفیف slice | O(n) | O(1)، درجا |
| شمارش کلمات | متناسب با طول متن با lookupهای میانگین hash | O(k) برای k کلمهٔ یکتا؛ مرتب‌سازی خروجی جداست |
| جست‌وجوی لاگ | پیمایش خط‌ها؛ هزینهٔ contains به طول خط و query وابسته است | O(L) با L بزرگ‌ترین خط؛ مستقل از کل اندازهٔ فایل |
| انبار BTreeMap | lookup و درج O(log p) برای p کالا | O(p) و هزینهٔ خود کلیدها |
| فهرست API | O(t) برای t task و طول titleها | clone خروجی O(t)، با سقف تعداد task |

پروژهٔ جست‌وجو در حالت ignore ASCII case برای هر خط lowercase جدید می‌سازد. این طراحی ساده است ولی می‌تواند allocation بیشتری ایجاد کند. قبل از تغییر، benchmark کن؛ normalization عمومی Unicode مسئلهٔ متفاوتی است.

## مسیر بهینه‌سازی

۱. ابتدا correctness و حالت مرزی را تثبیت کن.
۲. release بساز و با ورودی ثابت اندازه‌گیری کن.
۳. با profiler محل مصرف زمان یا allocation را پیدا کن.
۴. یک تغییر انجام بده، دوباره اندازه بگیر و تست‌ها را اجرا کن.

```bat
cmd /c cargo build -p log-search --release --offline
cmd /c cargo run -p log-search --release -- ERROR projects/001_log_search/data/sample.log
```

فایل پنج‌خطی برای benchmark معنی‌دار کافی نیست؛ فقط smoke check است. برای زمان اجرا، build را بیرون از بازهٔ اندازه‌گیری انجام بده. warm-up، cache سیستم‌عامل و تعداد نمونه‌ها نتیجه را تغییر می‌دهند.

## هزینه‌های پنهان رایج

- clone متن یا Vec در حلقهٔ داغ؛
- ساخت collection میانی که تنها یک جمع از آن لازم است؛
- lock پررقابت یا نگه‌داشتن guard هنگام I/O؛
- task و channel بدون سقف که memory را رشد می‌دهند؛
- ساخت connection شبکه یا دیتابیس برای هر عملیات؛
- linked list به جای Vec بدون دلیل مبتنی بر الگوی دسترسی.

`Vec::with_capacity` وقتی اندازهٔ تقریبی معلوم است می‌تواند reallocation را کم کند، ولی ظرفیت بیش از نیاز حافظه را نگه می‌دارد. iteratorها اغلب به حلقهٔ کارآمد تبدیل می‌شوند؛ عبارت «zero-cost abstraction» تضمین بی‌هزینه‌بودن هر allocation یا dynamic dispatch نیست.

برای benchmark، [Criterion](https://docs.rs/criterion/) و برای جلوگیری از حذف محاسبات آزمایشی `std::hint::black_box` را بررسی کن. ابزار profiling به سیستم‌عامل وابسته است. LTO، codegen-units و panic strategy را بعد از اندازه‌گیری و بررسی اثر build time و رفتار تغییر بده؛ flagهای بیشتر الزاماً عملکرد بهتر نمی‌سازند.

**تمرین:** یک فایل لاگ بزرگ با seed ثابت بساز، خروجی را به sink مناسب بفرست و مصرف حافظهٔ `read_to_string` را با پردازش خطی مقایسه کن. خروجی یکسان و خطاهای I/O را نیز کنترل کن.

منبع: [Cargo Profiles](https://doc.rust-lang.org/cargo/reference/profiles.html)، [black_box](https://doc.rust-lang.org/std/hint/fn.black_box.html).

</div>
