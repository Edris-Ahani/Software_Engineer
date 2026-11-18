<div dir="rtl">

# نصب، اجرا و بررسی

[English](RUNNING_English.md) · [دوره](README_Persian.md)

## نصب و محل اجرای فرمان

Node نسخهٔ ۲۴ یا جدیدتر، npm همراه آن و مرورگر به‌روز لازم است. در Windows از [نصب رسمی Node](https://nodejs.org/en/download) و MSI متناسب با معماری استفاده کنید و پس از نصب ترمینال را دوباره باز کنید. در macOS بستهٔ رسمی و در Linux باینری رسمی یا مدیر نسخهٔ معرفی‌شده در همان صفحه را نصب کنید. برای WSL نصب مستقل Linux داشته باشید و node_modules را با Windows مشترک نکنید.

تمام فرمان‌های این راهنما از ریشهٔ همین دوره اجرا می‌شوند، مگر آنکه cd داخل فرمان آمده باشد:

```bat
cmd /c "cd /d C:\Users\Edris\MyProjects\Software_Engineer\091_Frontend_Engineering"
```

فرمان cd در cmd /c فقط همان فرایند را تغییر می‌دهد؛ در ترمینال خود پوشهٔ کاری را روی این مسیر تنظیم کنید یا فرمان بعدی را همراه cd /d در همان cmd /c بنویسید. در Linux و macOS به همین پوشه بروید و پیشوند cmd /c را حذف کنید؛ برای cd از جداکنندهٔ / استفاده کنید.

## بررسی اصلی؛ بدون نصب بسته

```bat
cmd /c node --version
cmd /c node scripts/check.mjs
cmd /c node --test tests/core.test.mjs tests/server.test.mjs
cmd /c node examples/003_values.mjs
cmd /c node examples/007_event_loop.mjs
cmd /c node examples/010_types.ts
```

check باید ۶۴ فصل، جفت زبان، لینک‌های محلی، پوشش RTL و نحو JavaScript را بررسی کند. تست اصلی قواعد پول، جست‌وجو، reducer، ذخیره، API، پاسخ قدیمی و مرزهای سرور را می‌سنجد. نمونهٔ 003 مجموع 9700 سنت می‌دهد. نمونهٔ 007 ترتیب start، end، promise، microtask و timer را نشان می‌دهد. نمونهٔ 010 ابتدا 1 products و سپس 4500 می‌دهد. اجرای فایل TypeScript در Node حذف نوع است؛ بررسی نوع مستقل با پروژهٔ React انجام می‌شود.

## نمونه‌های مرورگر

```bat
cmd /c node scripts/serve.mjs --duration=600
```

صفحهٔ http://127.0.0.1:4173/ را باز کنید. این سرور فقط روی loopback و فقط برای آزمایش محلی است؛ پس از ۶۰۰ ثانیه خودکار بسته می‌شود و Ctrl+C هم آن را می‌بندد. مدت مجاز ۱ تا ۳۶۰۰ ثانیه است. اگر پورت اشغال است برنامهٔ متعلق به خودتان را شناسایی کنید؛ فرایند ناشناس را متوقف نکنید. تست‌ها پورت موقت می‌گیرند و سرور را خودشان می‌بندند. باز کردن file:// برای ماژول‌ها و worker مناسب نیست.

ورودی و خروجی هر نمونه در [راهنمای نمونه‌ها](examples/README_Persian.md) آمده است. سرور /api/products را با دادهٔ محلی، /api/failure را با 503 و /api/events را با سه رخداد محدود ارائه می‌کند. هیچ backend بیرونی یا اعتبارنامه‌ای لازم نیست.

## پروژهٔ مستقل React

```bat
cmd /c "cd projects\003_react_dashboard && npm ci"
cmd /c "cd projects\003_react_dashboard && npm run typecheck"
cmd /c "cd projects\003_react_dashboard && npm run build"
```

npm ci اینترنت و lockfile همراه پروژه می‌خواهد. برای به‌روزرسانی آگاهانهٔ manifest، npm install اجرا و diff نسخه‌ها را بررسی کنید؛ lockfile را برای رفع خطا بی‌دلیل حذف نکنید. نسخه‌ها دقیق‌اند و فایل قفل مرجع نصب تکرارپذیر است. build باید بررسی نوع و بسته‌بندی را تمام و dist بسازد. سپس با همان سرور محلی صفحهٔ http://127.0.0.1:4173/projects/003_react_dashboard/dist/index.html را ببینید. وابستگی این پروژه از بسته‌های اختیاری ریشه جداست. در این آموزش از dev server ماندگار استفاده نمی‌شود.

## تست مرورگر اختیاری

ابتدا پروژهٔ React را بسازید، سپس از ریشهٔ دوره:

```bat
cmd /c npm ci
cmd /c npx playwright install chromium
cmd /c npm run e2e
```

نصب نخست Playwright و مرورگر اینترنت و فضای دیسک می‌خواهد. تست‌ها headless هستند، دادهٔ نشست مستقل دارند و سرور موقت را می‌بندند. هشت مسیر جست‌وجو و تاریخچه، ذخیره و focus، دادهٔ خراب، عرض باریک، خطای HTTP، worker، SSE و React بررسی می‌شود. وضعیت واقعاً اجراشده در [گزارش بررسی](VALIDATION_Persian.md) ثبت است. آزمون خودکار جای صفحه‌خوان، دستگاه واقعی و ممیزی امنیت production را نمی‌گیرد.

## عیب‌یابی

EACCES هنگام دریافت npm ممکن است محدودیت شبکه یا مجوز cache باشد؛ خطای دقیق و سیاست محیط را بررسی کنید و کورکورانه با دسترسی مدیر تکرار نکنید. برای صفحهٔ خالی نخست Console و Network، سپس مسیر فایل ساخته‌شده را ببینید. در خطای Module not found نصب را در پوشهٔ درست و سازگاری lockfile کنترل کنید. نمونهٔ service worker پس از ثبت روی بارگیری بعدی کنترل می‌گیرد؛ برای پایان آزمایش از دکمهٔ حذف کش استفاده و تب را ببندید.

منابع نصب: [Node](https://nodejs.org/en/download)، [Vite](https://vite.dev/guide/)، [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci) و [Playwright](https://playwright.dev/docs/intro).

</div>
