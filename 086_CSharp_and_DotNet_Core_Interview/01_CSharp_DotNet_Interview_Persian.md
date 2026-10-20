<div dir="rtl" style="text-align: right;">

# سوالات مصاحبه: `C#` و `ASP.NET Core`

مجموعه‌ای از سوالات مهم مصاحبه برای بک‌اند دولوپر، با تمرکز روی زبان `C#` و فریم‌ورک `ASP.NET Core` / `.NET`.

هر بخش با یک فولدر نمونهٔ قابل‌اجرا (`001` تا `016`) هم‌تراز است. نحوهٔ اجرا: `00_HOW_TO_RUN_Persian.md`.

---

# بخش اول: زبان `C#` و runtime

## ۱. مدل اجرا و معماری (`001`)

### ۱. تفاوت `.NET Framework` با `.NET Core` / `.NET` مدرن چیست؟
**پاسخ مورد انتظار:** `.NET Framework` قدیمی و عمدتاً ویندوزی است. `.NET Core` (و ادامهٔ آن با نام `.NET 5+`) کراس‌پلتفرم، متن‌باز، ماژولار، با `CLR` و `BCL` مدرن و عملکرد بهتر برای سرویس‌های ابری است.

### ۲. `CLR` چیست و چه نقشی دارد؟
**پاسخ مورد انتظار:** `Common Language Runtime` محیط اجرای کد مدیریت‌شده است: بارگذاری اسمبلی، `JIT`، مدیریت حافظه/`GC`، امنیت نوع، exception handling و سرویس‌های runtime.

### ۳. `IL` و `JIT` چه معنایی دارند؟
**پاسخ مورد انتظار:** کامپایلر `C#` کد را به `IL` تبدیل می‌کند؛ در زمان اجرا `JIT` آن را به کد بومی ماشین ترجمه و در صورت امکان بهینه می‌کند (`RyuJIT`، `ReadyToRun`/`AOT` در سناریوهای خاص).

### ۴. `Assembly` و `Namespace` چه تفاوتی دارند؟
**پاسخ مورد انتظار:** `Namespace` سازمان‌دهی منطقی تایپ‌هاست؛ `Assembly` واحد استقرار/`DLL` یا exe قابل بارگذاری توسط `CLR` است.

### ۵. چه زمانی `.NET` برای سرویس مناسب نیست؟
**پاسخ مورد انتظار:** تقریباً همیشه مناسب است؛ محدودیت‌ها بیشتر از جنس معماری‌اند (مثلاً latency فوق‌العاده پایین با بودجهٔ حافظه سخت، یا نیاز به runtime خاص). انتخاب اشتباه معمولاً از بلاک کردن threadها یا misuse از `async` می‌آید نه از خود پلتفرم.

---

## ۲. حافظه و `GC` (`002`)

### ۶. تفاوت `stack` و `heap` در `C#` چیست؟
**پاسخ مورد انتظار:** مقادیر کوتاه‌عمر و بسیاری از `value type`های محلی روی stack (یا inline) هستند؛ نمونه‌های `reference type` روی managed heap تخصیص می‌یابند و با `GC` آزاد می‌شوند.

### ۷. `Garbage Collector` نسل‌بندی‌شده چگونه کار می‌کند؟
**پاسخ مورد انتظار:** اشیاء در `Gen0/Gen1/Gen2` جابه‌جا می‌شوند؛ اشیاء کوتاه‌عمر زود جمع می‌شوند. جمع‌آوری نسل بالاتر گران‌تر است.

### ۸. چرا فراخوانی دستی `GC.Collect` معمولاً بد است؟
**پاسخ مورد انتظار:** می‌تواند pauseهای غیرضروری بسازد و الگوی تخصیص طبیعی را به هم بزند؛ فقط با اندازه‌گیری و دلیل مشخص استفاده شود.

### ۹. تفاوت `IDisposable` با finalizer چیست؟
**پاسخ مورد انتظار:** `Dispose` پاکسازی قطعی و به‌موقع است؛ finalizer آخرین تور ایمنی غیرقطعی و پرهزینه است. الگوی استاندارد: `Dispose` + در صورت نیاز finalizer فقط برای unmanaged.

---

## ۳. تایپ‌ها و `OOP` (`003`)

### ۱۰. تفاوت `struct` و `class`؟
**پاسخ مورد انتظار:** `struct` نوع مقداری (کپی معنایی، معمولاً بدون وراثت پیاده‌سازی)، `class` نوع ارجاعی با وراثت و polymorphosim کامل‌تر.

### ۱۱. `boxing` / `unboxing` چیست و چرا مهم است؟
**پاسخ مورد انتظار:** تبدیل `value type` به `object`/`interface` باعث تخصیص heap می‌شود؛ در مسیرهای داغ عملکرد را خراب می‌کند.

### ۱۲. `record` برای چه ساخته شده؟
**پاسخ مورد انتظار:** مدل‌های دادهٔ غیرقابل‌تغییر (یا با `with`)، برابری مبتنی بر مقدار، و `DTO`های تمیز.

### ۱۳. `nullable reference types` چه کمکی می‌کنند؟
**پاسخ مورد انتظار:** هشدار کامپایلر برای null محتمل؛ کاهش `NullReferenceException` با قراردادهای صریح `T?`.

---

## ۴. `Generics`، کالکشن، `LINQ` (`004`)

### ۱۴. فایدهٔ `Generics` چیست؟
**پاسخ مورد انتظار:** ایمنی نوع در زمان کامپایل، حذف boxing در بسیاری موارد، و استفادهٔ مجدد از الگوریتم/ساختار داده.

### ۱۵. تفاوت `List<T>`، `Dictionary<TKey,TValue>` و `HashSet<T>`؟
**پاسخ مورد انتظار:** لیست مرتب با دسترسی ایندکسی؛ دیکشنری نگاشت کلید→مقدار با جستجوی متوسط O(1)؛ مجموعهٔ یکتا بدون تکرار.

### ۱۶. `LINQ` و اجرای معوق (`deferred execution`) یعنی چه؟
**پاسخ مورد انتظار:** بسیاری از کوئری‌ها تا زمان enumerate (`foreach`/`ToList`) اجرا نمی‌شوند؛ ممکن است چندبار اجرا یا side-effect بسازند.

### ۱۷. تفاوت `IEnumerable<T>` و `IQueryable<T>`؟
**پاسخ مورد انتظار:** اولی معمولاً در حافظه؛ دومی expression tree برای ترجمه به کوئری بیرونی (مثل `EF Core` → SQL).

---

## ۵. ناهمزمانی (`005`)

### ۱۸. `async/await` واقعاً thread جدید می‌سازد؟
**پاسخ مورد انتظار:** نه لزوماً. برای `I/O` معمولاً thread آزاد می‌شود تا callback ادامه یابد؛ برای CPU-bound باید صریحاً `Task.Run`/موازی‌سازی استفاده شود.

### ۱۹. تفاوت `Task.WhenAll` و await پشت‌سرهم؟
**پاسخ مورد انتظار:** await سریال است؛ `WhenAll` هم‌پوشانی I/O را می‌دهد.

### ۲۰. نقش `CancellationToken` چیست؟
**پاسخ مورد انتظار:** لغو تعاونی عملیات طولانی/درخواست‌ها هنگام timeout یا shutdown.

### ۲۱. `ConfigureAwait(false)` کجا معنی دارد؟
**پاسخ مورد انتظار:** در کتابخانه‌ها برای اجتناب از capture کردن sync context؛ در `ASP.NET Core` معمولاً sync context کلاسیک وجود ندارد.

---

## ۶. Delegate و Event (`006`)

### ۲۲. تفاوت `delegate`، `Action`/`Func` و `event`؟
**پاسخ مورد انتظار:** delegate تایپ متد اشاره‌گر است؛ `Action`/`Func` میانبرهای عمومی؛ `event` encapsulation برای pub/sub تا فقط اعلان‌کننده `invoke` کند.

### ۲۳. خطر memory leak در event چیست؟
**پاسخ مورد انتظار:** subscriber که unsubscribe نشود، ناشر را زنده نگه می‌دارد (مخصوصاً ناشر طولانی‌عمر).

---

## ۷. استثنا و Dispose (`007`)

### ۲۴. چه زمانی exception سفارشی می‌نویسید؟
**پاسخ مورد انتظار:** وقتی خطای دامنه معنای مشخص دارد و caller باید متفاوت واکنش نشان دهد؛ نه برای کنترل جریان عادی.

### ۲۵. `using` / `await using` چه می‌کند؟
**پاسخ مورد انتظار:** تضمین فراخوانی `Dispose`/`DisposeAsync` حتی در صورت exception.

### ۲۶. `AggregateException` از کجا می‌آید؟
**پاسخ مورد انتظار:** معمولاً از `Task.Wait`/`Task.Result` یا عملیات موازی که چند خطای همزمان جمع می‌کنند.

---

## ۸. Threading (`008`)

### ۲۷. تفاوت concurrency و parallelism در `.NET`؟
**پاسخ مورد انتظار:** concurrency پیشرفت هم‌زمان منطق (اغلب با async)؛ parallelism اجرای واقعی همزمان روی چند هسته (`Parallel`، چند thread).

### ۲۸. `lock` در مقابل `Interlocked`؟
**پاسخ مورد انتظار:** `lock` بخش بحرانی عمومی؛ `Interlocked` عملیات اتمی سبک روی مقادیر ساده.

### ۲۹. کی `Parallel.ForEach` و کی `async`؟
**پاسخ مورد انتظار:** CPU-bound → Parallel/PLINQ؛ I/O-bound → async/await.

---

# بخش دوم: `ASP.NET Core`

## ۹. پایپ‌لاین و Middleware (`009`)

### ۳۰. `ASP.NET Core` چگونه درخواست را پردازش می‌کند؟
**پاسخ مورد انتظار:** هاست (`Kestrel`) → پایپ‌لاین middleware به‌ترتیب ثبت → endpoint → برگشت معکوس از middlewareها.

### ۳۱. ترتیب ثبت middleware چرا حیاتی است؟
**پاسخ مورد انتظار:** مثلاً exception handler و HTTPS redirection باید زود باشند؛ authentication قبل از authorization؛ endpoint آخر زنجیره.

### ۳۲. تفاوت middleware و filter؟
**پاسخ مورد انتظار:** middleware سطح کل پایپ‌لاین HTTP است؛ filterها دور MVC/Minimal endpoint/action می‌چرخند و به action context دسترسی دارند.

---

## ۱۰. `DI` (`010`)

### ۳۳. lifetimeهای اصلی؟
**پاسخ مورد انتظار:**
- `Singleton`: یک نمونه در کل اپ
- `Scoped`: یک نمونه per request/scope
- `Transient`: هر resolve یک نمونه جدید

### ۳۴. چرا `DbContext` باید `Scoped` باشد؟
**پاسخ مورد انتظار:** چون per-request بودن از اشتراک ناامن بین درخواست‌ها/threadها جلوگیری می‌کند و unit-of-work طبیعی می‌سازد.

### ۳۵. Captive dependency چیست؟
**پاسخ مورد انتظار:** وقتی `Singleton` به سرویس `Scoped` وابسته شود و همان نمونهٔ scoped را برای همیشه نگه دارد — باگ خطرناک.

---

## ۱۱. Controller و Minimal APIs (`011`)

### ۳۶. چه زمانی Minimal API و چه زمانی Controller؟
**پاسخ مورد انتظار:** Minimal برای سرویس کوچک/ساده و کد کمتر؛ Controller برای API بزرگ، فیلترهای غنی، قراردادهای تیمی و سازمان‌دهی attribute-based.

### ۳۷. model binding از کجا می‌آید؟
**پاسخ مورد انتظار:** از route/query/header/body طبق قراردادها و attributeهایی مثل `[FromBody]`، `[FromQuery]`.

---

## ۱۲. Configuration و Options (`012`)

### ۳۸. منابع پیکربندی رایج؟
**پاسخ مورد انتظار:** `appsettings.json`، متغیر محیطی، command-line، user secrets، Azure Key Vault و غیره (با اولویت ترکیب).

### ۳۹. تفاوت `IOptions`، `IOptionsSnapshot`، `IOptionsMonitor`؟
**پاسخ مورد انتظار:** `IOptions` ثابت‌تر/singleton؛ `Snapshot` per-scope و قابل reload؛ `Monitor` اعلان تغییر برای سرویس‌های بلندعمر.

---

## ۱۳. Filter و Validation (`013`)

### ۴۰. انواع filter مهم؟
**پاسخ مورد انتظار:** Authorization، Resource، Action، Exception، Result — هرکدام در مرحلهٔ مشخصی از MVC اجرا می‌شوند.

### ۴۱. `[ApiController]` چه رفتاری اضافه می‌کند؟
**پاسخ مورد انتظار:** binding خودکار، پاسخ `400` برای مدل نامعتبر، استنتاج منبع binding، و مشکل‌یابی بهتر API.

### ۴۲. اعتبارسنجی با `DataAnnotations` چگونه کار می‌کند؟
**پاسخ مورد انتظار:** attribute روی DTO + model state؛ در API معمولاً قبل از ورود به action رد می‌شود.

---

## ۱۴. `EF Core` (`014`)

### ۴۳. `DbContext` چیست؟
**پاسخ مورد انتظار:** واحد کار و ردیابی تغییرات؛ پل بین موجودیت‌ها و دیتابیس.

### ۴۴. تفاوت `Add`، `Update`، `Attach`؟
**پاسخ مورد انتظار:** `Add` insert؛ `Update` همهٔ فیلدها را modified علامت می‌زند؛ `Attach` موجودیت را بدون modified بودن شروع می‌کند تا خودتان state را تنظیم کنید.

### ۴۵. `N+1` چیست و چطور کم می‌شود؟
**پاسخ مورد انتظار:** حلقه روی parentها و query جدا برای childها. راه حل: `Include`/`ThenInclude`، projection، یا split query آگاهانه.

### ۴۶. چرا `AsNoTracking` برای خواندن فقط‌خواندنی مفید است؟
**پاسخ مورد انتظار:** overhead ردیابی را کم می‌کند و برای queryهای گزارش/خواندنی سریع‌تر است.

---

## ۱۵. تست (`015`)

### ۴۷. تفاوت unit و integration در `ASP.NET Core`؟
**پاسخ مورد انتظار:** unit روی کلاس با وابستگی mock؛ integration با `WebApplicationFactory`/`TestServer` پایپ‌لاین واقعی را بالا می‌آورد.

### ۴۸. چرا `DI` تست را آسان می‌کند؟
**پاسخ مورد انتظار:** می‌توانید در تست، پیاده‌سازی واقعی را با fake جایگزین کنید بدون تغییر کد production.

---

## ۱۶. Hosting پیشرفته (`016`)

### ۴۹. `IHostedService` / `BackgroundService` چه کاربردی دارد؟
**پاسخ مورد انتظار:** کارهای پس‌زمینه داخل همان پروسه: صف داخلی، polling، warmup، پیام‌خوانی سبک.

### ۵۰. `Channel<T>` چه مزیتی نسبت به `BlockingCollection` دارد؟
**پاسخ مورد انتظار:** API ناهمزمان مدرن، عملکرد بالا، یکپارچگی بهتر با `async` و cancellation.

### ۵۱. graceful shutdown در `ASP.NET Core` چگونه است؟
**پاسخ مورد انتظار:** دریافت سیگنال توقف → توقف پذیرش → اتمام درخواست‌های جاری با `CancellationToken` → dispose سرویس‌ها.

---

## سوالات ترکیبی سطح ارشد

### ۵۲. اگر `Singleton` به `DbContext` وابسته شود چه می‌شود؟
**پاسخ مورد انتظار:** captive dependency؛ رفتار ناپایدار، exceptionهای threading، داده‌های اشتباه. باید طراحی را عوض کنید (`IDbContextFactory` یا Scoped consumer).

### ۵۳. چطور cross-cutting concerns مثل لاگ زمان پاسخ را پیاده می‌کنید؟
**پاسخ مورد انتظار:** middleware سراسری، یا action filter، یا `IAsyncDisposable`/diagnostic middleware؛ انتخاب بسته به نیاز به `HttpContext` در برابر `ActionContext`.

### ۵۴. تفاوت exception handling در middleware و exception filter؟
**پاسخ مورد انتظار:** middleware کل پایپ‌لاین را می‌پوشاند (حتی قبل از endpoint)؛ filter بیشتر حول MVC action است.

### ۵۵. برای API عمومی چه لایه‌های امنیتی/`pipeline` را ذکر می‌کنید؟
**پاسخ مورد انتظار:** HTTPS، authentication، authorization، validation، rate limiting، CORS دقیق، headers امنیتی، و عدم نشت جزئیات exception در production.

---

## چک‌لیست جمع‌بندی مصاحبه

**`C#`:** `CLR`/`JIT`، `GC`، value/reference، `async/await`، `LINQ`، delegates/events، `IDisposable`، threading.

**`ASP.NET Core`:** middleware pipeline، `DI` lifetimes، Minimal vs Controller، Options، filters/validation، `EF Core` scoped، تست با factory، `IHostedService` + cancellation.

</div>
