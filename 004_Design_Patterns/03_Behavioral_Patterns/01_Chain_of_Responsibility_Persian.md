<div dir="rtl">

# الگوی زنجیره مسئولیت (Chain of Responsibility Pattern)

## این الگو چیست؟
زنجیره مسئولیت یک الگوی طراحی رفتاری (Behavioral) است که به شما اجازه می‌دهد درخواست‌ها را در طول یک زنجیره از "هندلرها" (کنترل‌کننده‌ها) ارسال کنید. پس از دریافت یک درخواست، هر هندلر تصمیم می‌گیرد که آیا آن درخواست را پردازش کند یا آن را به هندلر بعدی در زنجیره پاس دهد.

## تاریخچه و دلیل پیدایش
این الگو توسط گروه GoF در سال ۱۹۹۴ معرفی شد. مفهوم آن شبیه به زنجیره فرماندهی در یک سازمان یا بخش پشتیبانی یک شرکت است (جایی که پشتیبان سطح ۱ مشکل را بررسی می‌کند، اگر نتوانست آن را به پشتیبان سطح ۲ ارجاع می‌دهد و همینطور تا آخر).

## چه مشکلاتی را برطرف می‌کند؟
- **اتصال سخت (Tight Coupling)**: ارسال‌کننده درخواست را از دریافت‌کننده جدا می‌کند و نیازی نیست فرستنده بداند دقیقاً کدام کلاس درخواست را پردازش می‌کند.
- **پردازش پویای درخواست‌ها**: زمانی که مشخص نیست در زمان اجرا چه کلاسی باید به درخواست رسیدگی کند و این موضوع به شرایط بستگی دارد.

## کجا و چه زمانی باید از آن استفاده کرد؟
زمانی از این الگو استفاده کنید که برنامه شما قرار است انواع مختلفی از درخواست‌ها را به روش‌های گوناگون پردازش کند، اما نوع دقیق درخواست‌ها و توالی آن‌ها از قبل مشخص نیست. این الگو به شدت در میان‌افزارها (مانند Express.js در نود جی‌اس)، فریم‌ورک‌های لاگ‌گیری و سیستم‌های پردازش رویداد (Event Bubbling) استفاده می‌شود.

## مثال‌ها

### زبان JavaScript

<div dir="ltr">

```javascript
// Handler
class SupportHandler {
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }

    handle(request) {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }
        return null;
    }
}

// Concrete Handlers
class Level1Support extends SupportHandler {
    handle(request) {
        if (request === "password_reset") {
            return "Level 1: I can reset your password.";
        }
        return super.handle(request);
    }
}

class Level2Support extends SupportHandler {
    handle(request) {
        if (request === "bug_report") {
            return "Level 2: I will log this bug for developers.";
        }
        return super.handle(request);
    }
}

class ManagerSupport extends SupportHandler {
    handle(request) {
        if (request === "refund") {
            return "Manager: I will process your refund.";
        }
        return super.handle(request);
    }
}

// Usage
const level1 = new Level1Support();
const level2 = new Level2Support();
const manager = new ManagerSupport();

level1.setNext(level2).setNext(manager);

console.log(level1.handle("bug_report")); // Level 2 handles it
console.log(level1.handle("refund")); // Manager handles it
```

</div>

### زبان TypeScript

<div dir="ltr">

```typescript
interface IHandler {
    setNext(handler: IHandler): IHandler;
    handle(request: string): string | null;
}

abstract class AbstractHandler implements IHandler {
    private nextHandler: IHandler | null = null;

    public setNext(handler: IHandler): IHandler {
        this.nextHandler = handler;
        return handler;
    }

    public handle(request: string): string | null {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }
        return null;
    }
}

class AuthMiddleware extends AbstractHandler {
    public handle(request: string): string | null {
        if (request === "NoAuth") return "Auth Failed";
        return super.handle(request); // Pass to next
    }
}

class DataValidationMiddleware extends AbstractHandler {
    public handle(request: string): string | null {
        if (request === "BadData") return "Validation Failed";
        return super.handle(request); // Pass to next
    }
}

// Usage
const auth = new AuthMiddleware();
const validation = new DataValidationMiddleware();
auth.setNext(validation);

console.log(auth.handle("NoAuth")); // Auth Failed
console.log(auth.handle("BadData")); // Validation Failed
```

</div>

### زبان C#

<div dir="ltr">

```csharp
using System;

// 1. Handler Interface
public interface IHandler 
{
    IHandler SetNext(IHandler handler);
    object Handle(object request);
}

// 2. Base Handler
public abstract class AbstractHandler : IHandler 
{
    private IHandler _nextHandler;

    public IHandler SetNext(IHandler handler) 
    {
        _nextHandler = handler;
        return handler;
    }

    public virtual object Handle(object request) 
    {
        if (_nextHandler != null) 
        {
            return _nextHandler.Handle(request);
        }
        return null;
    }
}

// 3. Concrete Handlers
public class MonkeyHandler : AbstractHandler 
{
    public override object Handle(object request) 
    {
        if ((request as string) == "Banana") 
            return $"Monkey: I'll eat the {request}.";
        return base.Handle(request);
    }
}

public class SquirrelHandler : AbstractHandler 
{
    public override object Handle(object request) 
    {
        if ((request as string) == "Nut") 
            return $"Squirrel: I'll eat the {request}.";
        return base.Handle(request);
    }
}

// Usage
// var monkey = new MonkeyHandler();
// var squirrel = new SquirrelHandler();
// monkey.SetNext(squirrel);
// Console.WriteLine(monkey.Handle("Nut")); // Handled by Squirrel
```

</div>

</div>
