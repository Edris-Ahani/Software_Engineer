<div dir="rtl">

# الگوی دکوراتور (Decorator Pattern)

## این الگو چیست؟
الگوی دکوراتور (تزئین‌کننده) یک الگوی طراحی ساختاری (Structural) است که به شما اجازه می‌دهد رفتارهای جدیدی را به صورت دینامیک و در زمان اجرا (Runtime) به اشیاء اضافه کنید. این کار با قرار دادن شیء مورد نظر درون اشیاء "پوشاننده" (Wrapper) مخصوصی که حاوی رفتارهای جدید هستند، انجام می‌شود.

## تاریخچه و دلیل پیدایش
توسط گروه GoF در سال ۱۹۹۴ معرفی شد. این الگو به عنوان جایگزینی برای ارث‌بری (Subclassing) ایجاد شد. ارث‌بری یک فرآیند ایستا (Static) است (در زمان کامپایل تعیین می‌شود)، در حالی که دکوراتور به شما اجازه می‌دهد قابلیت‌ها را در زمان اجرا به اشیاء متصل کنید.

## چه مشکلاتی را برطرف می‌کند؟
- **انفجار زیرکلاس‌ها (Subclass Explosion)**: اگر یک کلاس `Notifier` داشته باشید و بخواهید قابلیت‌های SMS، ایمیل و Slack را به صورت ترکیبی به آن اضافه کنید، ساخت کلاس‌هایی مثل `SMSAndEmailNotifier` منجر به تولید صدها کلاس می‌شود.
- **محدودیت‌های ارث‌بری ایستا**: ارث‌بری اجازه تغییر رفتار شیء در زمان اجرا را نمی‌دهد و بسیاری از زبان‌ها از ارث‌بری چندگانه پشتیبانی نمی‌کنند.

## کجا و چه زمانی باید از آن استفاده کرد؟
زمانی از این الگو استفاده کنید که نیاز دارید قابلیت‌های اضافی را در زمان اجرا به اشیاء اضافه کنید بدون اینکه کدی که از این اشیاء استفاده می‌کند را تغییر دهید یا بشکنید. این الگو به شدت در استریم‌ها (مانند I/O Streams در جاوا و C#) و اعمال میان‌افزارها (Middlewares) در فریم‌ورک‌های وب استفاده می‌شود.

## مثال‌ها

### زبان JavaScript

<div dir="ltr">

```javascript
// Component Interface
class Notifier {
    send(message) {}
}

// Concrete Component
class EmailNotifier extends Notifier {
    send(message) {
        console.log(`Sending Email: ${message}`);
    }
}

// Base Decorator
class NotifierDecorator extends Notifier {
    constructor(wrappee) {
        super();
        this.wrappee = wrappee;
    }
    send(message) {
        this.wrappee.send(message);
    }
}

// Concrete Decorator
class SMSDecorator extends NotifierDecorator {
    send(message) {
        super.send(message); // Call wrapped object
        console.log(`Sending SMS: ${message}`); // Add new behavior
    }
}

// Usage
const emailNotifier = new EmailNotifier();
const smsAndEmailNotifier = new SMSDecorator(emailNotifier);
smsAndEmailNotifier.send("Hello World!"); 
// Outputs: Sending Email: Hello World! \n Sending SMS: Hello World!
```

</div>

### زبان TypeScript

<div dir="ltr">

```typescript
interface ICoffee {
    getCost(): number;
    getDescription(): string;
}

class SimpleCoffee implements ICoffee {
    public getCost(): number { return 10; }
    public getDescription(): string { return "Simple Coffee"; }
}

// Base Decorator
abstract class CoffeeDecorator implements ICoffee {
    protected decoratedCoffee: ICoffee;

    constructor(coffee: ICoffee) {
        this.decoratedCoffee = coffee;
    }

    public getCost(): number {
        return this.decoratedCoffee.getCost();
    }

    public getDescription(): string {
        return this.decoratedCoffee.getDescription();
    }
}

// Concrete Decorator
class MilkDecorator extends CoffeeDecorator {
    public getCost(): number {
        return super.getCost() + 2;
    }
    public getDescription(): string {
        return super.getDescription() + ", Milk";
    }
}

// Usage
let myCoffee: ICoffee = new SimpleCoffee();
myCoffee = new MilkDecorator(myCoffee);
console.log(`${myCoffee.getDescription()} costs $${myCoffee.getCost()}`);
```

</div>

### زبان C#

<div dir="ltr">

```csharp
using System;

// 1. Component Interface
public interface IDataSource 
{
    void WriteData(string data);
}

// 2. Concrete Component
public class FileDataSource : IDataSource 
{
    public void WriteData(string data) 
    {
        Console.WriteLine($"Writing '{data}' to file.");
    }
}

// 3. Base Decorator
public abstract class DataSourceDecorator : IDataSource 
{
    protected IDataSource wrappee;
    
    public DataSourceDecorator(IDataSource source) 
    {
        wrappee = source;
    }
    
    public virtual void WriteData(string data) 
    {
        wrappee.WriteData(data);
    }
}

// 4. Concrete Decorators
public class EncryptionDecorator : DataSourceDecorator 
{
    public EncryptionDecorator(IDataSource source) : base(source) { }
    
    public override void WriteData(string data) 
    {
        string encryptedData = $"[Encrypted]{data}[/Encrypted]";
        base.WriteData(encryptedData);
    }
}

// Usage
// IDataSource source = new FileDataSource();
// source = new EncryptionDecorator(source);
// source.WriteData("Sensitive Data");
```

</div>

</div>
