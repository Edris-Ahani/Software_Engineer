<div dir="rtl">

[English version](README_English.md)

# پروژهٔ ۰۰۳ ـ Task API با Tokio و Axum

[بازگشت به دوره](../../README_Persian.md) · [درس async](../../lessons/018_async_Persian.md)

این پروژه workspace مستقلی با dependencyهای خارجی است: Axum سری ۰٫۸، Tokio سری ۱ و Serde سری ۱. آخرین Rust stable را نصب کن؛ نخستین build به اینترنت نیاز دارد. بازه‌های manifest نسخهٔ patch را ثابت نمی‌کنند؛ lockfile واقعی را پس از resolve و تست موفق نگه دار.

## تست و اجرا

فرمان‌ها از ریشهٔ `090_Rust` هستند:

```bat
cmd /c cargo test --manifest-path projects/003_async_api/Cargo.toml
cmd /c cargo run --manifest-path projects/003_async_api/Cargo.toml --bin 001_bounded_jobs
```

تست‌ها router را در حافظه صدا می‌زنند و سرور یا port باز نمی‌کنند. مثال صف باید `Processed total: 15` چاپ کند.

برای کار با HTTP، خودت یک ترمینال جدا باز کن و سرور را اجرا کن؛ این دستور تا توقف دستی باز می‌ماند:

```bat
cmd /c cargo run --manifest-path projects/003_async_api/Cargo.toml
```

پس از پیام `Listening on http://127.0.0.1:3000`، در ترمینال دیگر روی Windows:

```bat
cmd /c curl.exe -i http://127.0.0.1:3000/health
cmd /c curl.exe -i -X POST http://127.0.0.1:3000/tasks -H "Content-Type: application/json" --data-binary @projects/003_async_api/data/001_create_task.json
cmd /c curl.exe -i http://127.0.0.1:3000/tasks
cmd /c curl.exe -i -X PATCH http://127.0.0.1:3000/tasks/1
cmd /c curl.exe -i http://127.0.0.1:3000/tasks/1
```

در Unix از `curl` بدون `.exe` و بدون `cmd /c` استفاده کن. فایل JSON از پیچیدگی escaping بین shellها جلوگیری می‌کند. با Ctrl+C در ترمینال سرور، shutdown درخواست می‌شود.

## قرارداد مسیرها

| مسیر | رفتار | نتیجهٔ معمول |
| --- | --- | --- |
| `GET /health` | آماده‌بودن نمونه | ۲۰۰ و `ok` |
| `POST /tasks` | ایجاد با title trimشده | ۲۰۱ و JSON task |
| `GET /tasks` | فهرست مرتب‌شده با id | ۲۰۰ و array |
| `GET /tasks/{id}` | خواندن یک task | ۲۰۰ یا ۴۰۴ |
| `PATCH /tasks/{id}` | completed را true می‌کند، بدون body | ۲۰۰ یا ۴۰۴ |

روی store خالی، ایجاد اول JSON زیر را می‌دهد:

```json
{"id":1,"title":"Read Rust","completed":false}
```

پس از PATCH، completed برابر true است. PATCH تکراری همین وضعیت را حفظ می‌کند. title خالی یا بیش از ۱۲۰ scalar value با ۴۲۲ رد می‌شود؛ body بزرگ‌تر از ۸ KiB هنگام استخراج JSON با ۴۱۳ رد می‌شود؛ ظرفیت ۱۰۰۰ task باعث ۵۰۳ می‌شود. خطای JSON یا نوع نامعتبر path را extractor فریم‌ورک مدیریت می‌کند.

## طراحی و محدودیت‌ها

[lib.rs](src/lib.rs) router و handlerها را دارد، [main.rs](src/main.rs) listener و shutdown را، و [تست HTTP](tests/http.rs) رفتار را در حافظه بررسی می‌کند. lock استاندارد فقط state کوچک حافظه را می‌پوشاند؛ هیچ guardی از await عبور نمی‌کند. نمونهٔ [صف محدود](src/bin/001_bounded_jobs.rs) مستقل از server است و کار پس‌زمینهٔ متصل به endpointها نیست.

داده با restart حذف می‌شود. این نمونه login، TLS، authorization، pagination، rate limiting و پایگاه داده ندارد؛ روی localhost برای آموزش اجرا می‌شود. سقف تعداد task و body، جای محدودیت نرخ یا تعداد اتصال را نمی‌گیرد. برای طراحی مرحلهٔ بعد [درس امنیت](../../lessons/026_security_deployment_Persian.md) و [دیتابیس](../../lessons/023_serde_database_Persian.md) را ببین.

منبع API: [Axum 0.8](https://docs.rs/axum/0.8/axum/)، [Tokio](https://tokio.rs/tokio/tutorial)، [Serde](https://serde.rs/).

</div>
