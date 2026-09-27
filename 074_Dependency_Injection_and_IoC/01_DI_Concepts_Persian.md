<div dir="rtl">

# تزریق وابستگی (DI) و وارونگی کنترل (IoC)

## روش بد (Hard Coupling - اتصال سفت‌وسخت)
تصور کنید در حال ساخت کلاسی برای یک `ماشین (Car)` هستید که برای کار کردن به یک `موتور (Engine)` نیاز دارد.
<div dir="ltr">

```javascript
class Car {
  constructor() {
    // Bad: The Car builds its own engine!
    this.engine = new V8Engine(); 
  }
}
```

</div>
این یک **اتصال سخت (Hard Coupling)** است. اگر فردا بخواهید یک ماشین الکتریکی بسازید، باید کدهای کلاس `Car` را به طور کامل بازنویسی کنید! علاوه بر این، نمی‌توانید برای این ماشین Unit Test بنویسید مگر اینکه موتور واقعی `V8Engine` را هم اجرا کنید (چون نمی‌توانید آن را در تست ماک/جایگزین کنید).

## تزریق وابستگی (Dependency Injection / DI)
به جای اینکه یک کلاس خودش وابستگی‌هایش (Dependencies) را بسازد، ما آن‌ها را از بیرون (معمولاً از طریق Constructor) به آن **تزریق (Inject)** می‌کنیم.
<div dir="ltr">

```javascript
class Car {
  // Good: The Engine is handed to the Car
  constructor(engine) {
    this.engine = engine;
  }
}

const v8 = new V8Engine();
const myCar = new Car(v8);

const electric = new ElectricEngine();
const futureCar = new Car(electric); // Works perfectly without changing Car!
```

</div>
حالا کلاس ماشین اتصالی بسیار سُست (Loosely Coupled) دارد. برایش اهمیتی ندارد که موتور چگونه ساخته شده، فقط هر چیزی که به آن پاس بدهید را استفاده می‌کند. برای Unit Test هم می‌توانید یک `MockEngine` (موتور الکی) به آن تزریق کنید که هیچ کاری انجام نمی‌دهد.

## وارونگی کنترل (Inversion of Control / IoC)
اگر برنامه شما ۱۰۰ کلاس داشته باشد، اینکه بخواهید به صورت دستی همه چیز را ایجاد کنید و پاس بدهید (`new Database()`, `new Logger()`, `new UserService(db, logger)`) بسیار طاقت‌فرسا می‌شود.
یک **کانتینر IoC** (که در فریم‌ورک‌هایی مثل Spring Boot، .NET، Angular و NestJS وجود دارد) این کار را به صورت خودکار مدیریت می‌کند. شما فقط اعلام می‌کنید: "من در این کلاس به یک دیتابیس و یک لاگر نیاز دارم"، و خودِ فریم‌ورک به طور جادویی متوجه می‌شود چطور آن‌ها را بسازد و به کلاس شما تزریق کند. در اینجا کنترلِ ساخته‌شدنِ اشیاء از شما گرفته شده و به فریم‌ورک سپرده می‌شود (این یعنی وارونگیِ کنترل!).

</div>
