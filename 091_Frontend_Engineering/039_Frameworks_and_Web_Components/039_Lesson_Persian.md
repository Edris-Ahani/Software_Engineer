<div dir="rtl">

# 039 — مقایسهٔ فریم‌ورک‌ها و Web Component

[English](./039_Lesson_English.md) · [مسیر دوره](../README_Persian.md) · [راهنمای اجرا](../RUNNING_Persian.md)

## مفهوم و سازوکار

React رابط را با کامپوننت و state توصیف می‌کند؛ Vue قالب، reactivity و فایل تک‌کامپوننتی دارد؛ Angular فریم‌ورک یکپارچه با تزریق وابستگی، قالب، routing و ابزار واکنشی است؛ Svelte کامپوننت را کامپایل و قابلیت واکنشی ارائه می‌کند. با وجود تفاوت نحو، همه مسئلهٔ مالکیت و چرخهٔ عمر دارند.

انتخاب را براساس توان تیم، اکوسیستم، استقرار، دسترس‌پذیری و هزینهٔ مهاجرت انجام دهید. Web Component با custom element و در صورت نیاز Shadow DOM مرز بومی مرورگر می‌سازد. Shadow DOM بخشی از سبک را جدا می‌کند اما مرز امنیتی نیست. عنصر میان‌فریم‌ورکی هم قرارداد روشن property، attribute، event، focus و فرم می‌خواهد.

## خطاهای رایج

فریم‌ورک را فقط با حجم hello-world مقایسه نکنید. microfrontend را فقط برای متفاوت بودن فریم‌ورک هر تیم انتخاب نکنید.

## تمرین و معیار پذیرش

شمارندهٔ کوچک را custom element بسازید و قرارداد خواندن مقدار و مشاهدهٔ رخداد تغییر را تعریف کنید.

## راهنمای حل

یک بار register کنید، کنترل بومی دسترس‌پذیر بسازید، CustomEvent مستند بفرستید و در قطع اتصال پاک‌سازی کنید؛ همان قرارداد را در فریم‌ورک دیگر مقایسه کنید.

## کد مرتبط

- [014_custom_element.html](../examples/014_custom_element.html)

[ورودی، خروجی و محدودیت نمونه‌ها](../examples/README_Persian.md)

## منبع رسمی

[مستندات اصلی](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)

[Vue](https://vuejs.org/guide/introduction.html) · [Angular](https://angular.dev/overview) · [Svelte](https://svelte.dev/docs/svelte/overview)

[قبلی](../038_SSR_SSG_Nextjs_and_RSC/038_Lesson_Persian.md) · [بعدی](../040_Frontend_Security/040_Lesson_Persian.md)

</div>
