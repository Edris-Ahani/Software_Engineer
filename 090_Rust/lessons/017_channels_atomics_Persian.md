<div dir="rtl">

[English version](017_channels_atomics_English.md)

# ۰۱۷ ـ Channel، Backpressure و Atomic

[فهرست](../README_Persian.md) · [قبلی](016_threads_Persian.md) · [بعدی](018_async_Persian.md)

به جای اشتراک داده، می‌توان ownership پیام را منتقل کرد. `mpsc` یعنی چند producer و یک consumer. `channel` صف بدون کران مشخص می‌دهد؛ اگر مصرف‌کننده کند شود، حافظه ممکن است رشد کند. `sync_channel(capacity)` صف محدود دارد و producer را هنگام پرشدن متوقف می‌کند.

[مثال ۰۱۴](../examples/src/bin/014_channels.rs) ظرفیت ۲ و پنج پیام دارد. main هم‌زمان با producer پیام‌ها را جمع می‌کند. اگر قبل از مصرف پیام‌ها روی producer عملیات join انجام دهی، producer ممکن است در صف پر منتظر بماند و main نیز منتظر producer شود.

```bat
cmd /c cargo run -p rust-lessons --bin 014_channels
```

خروجی پنج job به ترتیب `job-1` تا `job-5` است. consumer وقتی همهٔ senderها drop شوند، از iteration خارج می‌شود. نگه‌داشتن یک clone فراموش‌شدهٔ sender می‌تواند پایان stream را به تعویق بیندازد. `send` و `recv` نیز هنگام بسته‌شدن سمت مقابل خطا می‌دهند.

## Backpressure یک تصمیم محصول است

وقتی صف پر است، سه سیاست رایج داریم: منتظر بمان، کار را با خطا رد کن یا بر اساس قرارداد مشخص drop کن. ظرفیت بزرگ‌تر مشکل consumer کند را درمان نمی‌کند؛ فقط زمان آشکارشدن آن را عقب می‌اندازد. تعداد taskهای فعال، اندازهٔ هر پیام و timeout را کنار ظرفیت صف حساب کن.

در Tokio از `mpsc::channel` و `send().await` استفاده می‌کنیم؛ توقف producer در آن thread سیستم‌عامل را مانند send مسدودکننده نگه نمی‌دارد. [نمونهٔ صف async](../projects/003_async_api/src/bin/001_bounded_jobs.rs) مجموع پنج job را `15` می‌کند و timeout دارد.

## Atomic چه چیزی را تضمین می‌کند؟

اتمی‌بودن یک عملیات از مشاهدهٔ مقدار نیمه‌نوشته یا lost update در همان عملیات جلوگیری می‌کند. یک تراکنش چندفیلدی خودبه‌خود اتمیک نمی‌شود. برای invariant موجودی و مبلغ، Mutex یا قرارداد تراکنش لازم است.

[مثال ۰۲۰](../examples/src/bin/020_atomics.rs) با `fetch_add` فقط شمارندهٔ مستقل را تغییر می‌دهد:

```bat
cmd /c cargo run -p rust-lessons --bin 020_atomics
```

خروجی `Completed: 4000` است. `Relaxed` اینجا انتخاب شده چون مقدار شمارنده قرار نیست انتشار دادهٔ دیگری را هماهنگ کند و main پس از join می‌خواند.

| Ordering | نکتهٔ آموزشی |
| --- | --- |
| Relaxed | اتمی‌بودن همان مقدار؛ بدون ترتیب‌دهی عمومی داده‌های دیگر |
| Release / Acquire | با مشاهدهٔ مناسبِ انتشار، ترتیب و visibility داده‌های مرتبط را برقرار می‌کنند |
| AcqRel | ترکیب نقش acquire و release برای عملیات مناسب |
| SeqCst | ترتیب کلی قوی‌تر برای عملیات SeqCst؛ الگوریتم غلط را صحیح نمی‌کند |

در الگوریتم lock-free، موفقیت و شکست compare_exchange می‌توانند ordering جدا داشته باشند؛ آن را بدون proof و ابزار بررسی وارد کد نکن. برای شروع، Mutex خواناتر و قابل اعتمادتر است.

**تمرین:** ظرفیت صف را صفر، یک و دو کن و توضیح بده چه چیزی عوض می‌شود. سپس بگو چرا یک AtomicBool به‌تنهایی جای state machine چندمرحله‌ای را نمی‌گیرد.

منبع: [std::sync::mpsc](https://doc.rust-lang.org/std/sync/mpsc/)، [Atomic Ordering](https://doc.rust-lang.org/std/sync/atomic/enum.Ordering.html)، [Tokio Channels](https://tokio.rs/tokio/tutorial/channels).

</div>
