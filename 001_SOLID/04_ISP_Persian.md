<div dir="rtl">

# اصل تفکیک رابط (ISP - Interface Segregation Principle)

## این اصل چیست؟
اصل تفکیک رابط (ISP) حرف 'I' در مخفف SOLID است. این اصل بیان می‌کند که هیچ کلاینتی (کلاسی) نباید مجبور شود به متدهایی وابسته باشد که از آن‌ها استفاده نمی‌کند. اینترفیس‌های بزرگ و حجیم باید به اینترفیس‌های کوچک‌تر و تخصصی‌تر تقسیم شوند.

## تاریخچه و دلیل پیدایش
رابرت سی. مارتین این اصل را در دهه ۱۹۹۰ زمانی که به عنوان مشاور برای شرکت زیراکس (Xerox) کار می‌کرد توسعه داد. زیراکس یک سیستم نرم‌افزاری بزرگ برای پرینترهای چندکاره داشت و هر تغییری در کلاس اصلی باعث می‌شد کل سیستم نیاز به کامپایل مجدد داشته باشد.

## چه مشکلاتی را برطرف می‌کند؟
- **اینترفیس‌های چاق (Fat Interfaces)**: اینترفیس‌هایی که ده‌ها متد دارند و برای تمام کلاس‌هایی که آن‌ها را پیاده‌سازی می‌کنند مرتبط نیستند.
- **وابستگی‌های غیرضروری**: تغییر یک بخش از یک اینترفیس بزرگ، تمام کلاس‌هایی را که آن را پیاده‌سازی کرده‌اند تحت تاثیر قرار می‌دهد، حتی اگر از آن بخش استفاده نکنند.
- **پیاده‌سازی‌های خالی**: مجبور کردن برنامه‌نویس به پیاده‌سازی یک متد و پرتاب خطای `NotImplementedException` فقط به این دلیل که کلاس مربوطه آن قابلیت را پشتیبانی نمی‌کند.

## کجا و چه زمانی باید از آن استفاده کرد؟
هنگام که متوجه شدید کلاس‌هایی که اینترفیس شما را پیاده‌سازی می‌کنند برخی متدها را خالی رها کرده‌اند یا خطا پرتاب می‌کنند، باید از ISP استفاده کنید. اینترفیس بزرگ را بر اساس نقش‌ها به اینترفیس‌های کوچکتر بشکنید.

## مثال‌ها

### زبان TypeScript
*نکته: جاوا اسکریپت به صورت بومی اینترفیس ندارد، اما این مفهوم در تایپ‌اسکریپت یا کلاس‌های پایه کاربرد دارد.*

<div dir="ltr">

```typescript
// BAD: Fat interface
interface Worker {
    work(): void;
    eat(): void;
    sleep(): void;
}

class HumanWorker implements Worker {
    work() { console.log("Working"); }
    eat() { console.log("Eating"); }
    sleep() { console.log("Sleeping"); }
}

class RobotWorker implements Worker {
    work() { console.log("Working"); }
    eat() { throw new Error("Robots do not eat"); } // ISP Violation!
    sleep() { throw new Error("Robots do not sleep"); } // ISP Violation!
}
```

</div>

<div dir="ltr">

```typescript
// GOOD: Segregated interfaces
interface Workable {
    work(): void;
}

interface Eatable {
    eat(): void;
}

interface Sleepable {
    sleep(): void;
}

class HumanWorker implements Workable, Eatable, Sleepable {
    work() { console.log("Working"); }
    eat() { console.log("Eating"); }
    sleep() { console.log("Sleeping"); }
}

class RobotWorker implements Workable {
    work() { console.log("Working"); }
    // No need to implement eat() or sleep()
}
```

</div>

### زبان C#

<div dir="ltr">

```csharp
// BAD: Fat interface
public interface IPrinterTasks 
{
    void Print(string content);
    void Scan(string content);
    void Fax(string content);
}

// A simple printer doesn't have scan or fax features!
public class BasicPrinter : IPrinterTasks 
{
    public void Print(string content) => Console.WriteLine("Printing...");
    public void Scan(string content) => throw new NotImplementedException(); // ISP Violation!
    public void Fax(string content) => throw new NotImplementedException(); // ISP Violation!
}
```

</div>

<div dir="ltr">

```csharp
// GOOD: Segregated interfaces
public interface IPrinter 
{
    void Print(string content);
}

public interface IScanner 
{
    void Scan(string content);
}

public interface IFax 
{
    void Fax(string content);
}

public class BasicPrinter : IPrinter 
{
    public void Print(string content) => Console.WriteLine("Printing...");
}

public class AdvancedMultiFunctionPrinter : IPrinter, IScanner, IFax 
{
    public void Print(string content) => Console.WriteLine("Printing...");
    public void Scan(string content) => Console.WriteLine("Scanning...");
    public void Fax(string content) => Console.WriteLine("Faxing...");
}
```

</div>

</div>
