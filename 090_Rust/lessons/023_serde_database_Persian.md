<div dir="rtl">

[English version](023_serde_database_English.md)

# ۰۲۳ ـ JSON، Web API و پایگاه داده

[فهرست](../README_Persian.md) · [قبلی](022_io_networking_Persian.md) · [بعدی](024_wasm_embedded_Persian.md)

در سرویس وب سه مرز را جدا کن: انتقال دادهٔ HTTP، قواعد دامنه و ذخیره‌سازی. DTO عمومی لزوماً همان مدل داخلی یا جدول دیتابیس نیست. این جداسازی اجازه می‌دهد API را ثابت نگه داری و جزئیات persistence را عوض کنی.

## Serde و validation

`Serialize` مقدار Rust را برای serializer قابل خواندن می‌کند و `Deserialize` آن را از داده می‌سازد. format می‌تواند JSON یا قالب دیگر باشد؛ Serde خودش مترادف JSON نیست. در پروژه، Axum با extractor نوع `Json<T>` تبدیل HTTP/JSON را انجام می‌دهد.

```rust
use serde::{Deserialize, Serialize};
#[derive(Deserialize)]
struct CreateTask { title: String }
#[derive(Serialize)]
struct TaskView { id: u64, title: String, completed: bool }
```

این snippet به dependencyهای Serde نیاز دارد و باید در پروژهٔ وب قرار گیرد. deserialize شدن موفق فقط شکل داده را تأیید می‌کند؛ title خالی، ظرفیت فروش، مجوز کاربر و دامنهٔ مقدارها باید جدا بررسی شوند.

## جریان پروژهٔ API

```text
POST /tasks -> Json<CreateTask> -> validate title -> lock short-lived store
            -> allocate checked ID -> insert -> 201 + Json<Task>
PATCH /tasks/{id} -> lookup -> completed = true -> 200
```

[کد پروژه](../projects/003_async_api/src/lib.rs) title را trim می‌کند، تعداد scalar value را محدود می‌کند، body را به ۸ KiB و تعداد taskها را به ۱۰۰۰ محدود می‌کند. در خطای داخلی، جزئیات lock یا وضعیت درون سرویس به caller نشت نمی‌کند. تست HTTP بدون بازکردن پورت انجام می‌شود.

```bat
cmd /c cargo test --manifest-path projects/003_async_api/Cargo.toml
```

این پروژه storage حافظه‌ای دارد؛ با restart داده‌ها از بین می‌روند. Mutex محلی تضمین تراکنش بین چند replica یا اتصال دیتابیس نیست.

## مسیر افزودن PostgreSQL یا SQLite

برای SQLx، crate و featureهای runtime، TLS و backend را طبق [مستندات رسمی SQLx](https://docs.rs/sqlx/) انتخاب کن. برای query باید پارامتر bind شود؛ الحاق ورودی کاربر به SQL خطر تزریق دارد. یک الگوی PostgreSQL:

```sql
UPDATE products
SET available = available - $1
WHERE sku = $2 AND available >= $1
RETURNING available;
```

قبل از query، مقدار quantity باید مثبت و قابل نمایش در نوع ستون باشد. اگر هیچ ردیفی برنگشت، باید بین نبودن کالا و موجودی ناکافی بر اساس قرارداد تصمیم بگیری. تراکنش و constraint دیتابیس را برای invariantهای چندجدولی استفاده کن؛ الگوی «اول SELECT، بعد UPDATE جدا» زیر رقابت می‌تواند oversell کند.

pool را یک‌بار برای برنامه بساز، نه برای هر درخواست. تعداد connectionها، timeout، migration، index، N+1، retry محدود و idempotency را با هم طراحی کن. secret اتصال را در repository یا log نگذار. macroهای query در SQLx ممکن است به schema آنلاین یا metadata آفلاین نیاز داشته باشند؛ این مرحله جزو پروژهٔ اجرایی فعلی نیست.

**تمرین:** adapter ذخیره‌سازی را طراحی کن که نبودن task را بدون وابستگی به StatusCode بیان کند؛ handler آن را به 404 نگاشت کند. سپس تست domain را بدون HTTP بنویس.

منبع: [Serde](https://serde.rs/)، [Axum](https://docs.rs/axum/0.8/axum/)، [SQLx](https://docs.rs/sqlx/). بخش پایگاه داده طرح توسعه است و نیاز به راه‌اندازی دیتابیس دارد.

</div>
