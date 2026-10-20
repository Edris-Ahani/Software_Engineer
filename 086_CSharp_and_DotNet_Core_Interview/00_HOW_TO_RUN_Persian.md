<div dir="rtl" style="text-align: right;">

# نحوه اجرای مثال‌ها

پیش‌نیاز: نصب بودن `SDK` نسخهٔ ۸ یا بالاتر (دستور `dotnet --version`).

یک‌بار وارد فولدر پروژه شوید:

</div>

```bash
cd 086_CSharp_and_DotNet_Core_Interview
dotnet restore
```

<div dir="rtl" style="text-align: right;">

سپس هر بخش را با شماره همان قسمت اجرا کنید:

</div>

```bash
dotnet run --project 001_clr_runtime
dotnet run --project 002_memory_gc
dotnet run --project 003_types_oop
dotnet run --project 004_generics_linq
dotnet run --project 005_async_tasks
dotnet run --project 006_delegates_events
dotnet run --project 007_exceptions_dispose
dotnet run --project 008_threading_parallel
dotnet run --project 009_aspnet_core_pipeline
dotnet run --project 010_di_lifetimes
dotnet run --project 011_controllers_minimal_apis
dotnet run --project 012_config_options
dotnet run --project 013_filters_validation
dotnet run --project 014_efcore_basics
dotnet run --project 015_testing
dotnet run --project 016_advanced_hosting
```

<div dir="rtl" style="text-align: right;">

| شماره | موضوع |
|------:|:------|
| `001` | مدل اجرا و معماری `CLR` / `.NET` |
| `002` | حافظه و `Garbage Collection` |
| `003` | تایپ‌ها و `OOP` |
| `004` | `Generics`، کالکشن‌ها و `LINQ` |
| `005` | `async` / `await` / `Task` |
| `006` | `Delegate`، `Event`، `Func`/`Action` |
| `007` | استثناها و `IDisposable` |
| `008` | چندنخی و موازی‌سازی |
| `009` | پایپ‌لاین `ASP.NET Core` و `Middleware` |
| `010` | تزریق وابستگی و lifetimeها |
| `011` | `Controller` در مقابل `Minimal API` |
| `012` | `Configuration` و الگوی `Options` |
| `013` | `Filter`، اعتبارسنجی و model binding |
| `014` | مبانی `EF Core` |
| `015` | الگوهای تست‌پذیری |
| `016` | `IHostedService`، `Channel` و shutdown |

مثال‌های `009` تا `016` خودشان یک هاست موقت بالا می‌آورند، درخواست می‌زنند، خروجی را چاپ می‌کنند و خارج می‌شوند.

اگر پورتی اشغال بود، همان شماره را در `Program.cs` همان فولدر تغییر دهید (مثلاً `5109`).

</div>
