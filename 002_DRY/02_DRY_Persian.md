<div dir="rtl">

# اصل تکرار نکن (DRY - Don't Repeat Yourself)

## این اصل چیست؟
اصل DRY یک اصل در توسعه نرم‌افزار است که هدف آن کاهش تکرار الگوهای نرم‌افزاری و جایگزینی آن با انتزاع (Abstraction) یا استفاده از نرمال‌سازی داده‌ها برای جلوگیری از افزونگی است.

## تاریخچه و دلیل پیدایش
این اصل توسط اندی هانت (Andy Hunt) و دیو توماس (Dave Thomas) در کتاب "برنامه‌نویس عمل‌گرا" (The Pragmatic Programmer) در سال ۱۹۹۹ معرفی شد. آن‌ها بیان کردند: "هر بخش از دانش باید یک نمایش واحد، بدون ابهام و معتبر در درون یک سیستم داشته باشد."

## چه مشکلاتی را برطرف می‌کند؟
- **کابوس نگهداری (Maintenance)**: زمانی که منطقی کپی می‌شود، رفع یک باگ یا افزودن یک ویژگی نیازمند تغییر در چندین بخش مختلف است. فراموش کردن یک بخش باعث ایجاد ناهماهنگی در سیستم می‌شود.
- **حجم زیاد کد**: تکرار باعث افزایش حجم کدبیس می‌شود و خوانایی و درک آن را دشوارتر می‌کند.

## کجا و چه زمانی باید از آن استفاده کرد؟
هر زمان که متوجه شدید یک منطق، الگوریتم یا پیکربندی را بیش از یک بار می‌نویسید، باید از DRY استفاده کنید. کدهای مشترک را به یک تابع، ماژول یا کلاس جداگانه منتقل کنید تا بتوانید از آن‌ها استفاده مجدد کنید.

## مثال‌ها

### زبان JavaScript

<div dir="ltr">

```javascript
// BAD: Repeated logic
function calculateFullTimeSalary(hourlyRate) {
    const hoursPerWeek = 40;
    const weeksPerYear = 52;
    return hourlyRate * hoursPerWeek * weeksPerYear;
}

function calculatePartTimeSalary(hourlyRate) {
    const hoursPerWeek = 20;
    const weeksPerYear = 52;
    return hourlyRate * hoursPerWeek * weeksPerYear;
}

// GOOD: DRY approach
function calculateSalary(hourlyRate, hoursPerWeek) {
    const weeksPerYear = 52;
    return hourlyRate * hoursPerWeek * weeksPerYear;
}
```

</div>

### زبان TypeScript

<div dir="ltr">

```typescript
// BAD: Repeated logic
function calculateFullTimeSalary(hourlyRate: number): number {
    const hoursPerWeek = 40;
    const weeksPerYear = 52;
    return hourlyRate * hoursPerWeek * weeksPerYear;
}

function calculatePartTimeSalary(hourlyRate: number): number {
    const hoursPerWeek = 20;
    const weeksPerYear = 52;
    return hourlyRate * hoursPerWeek * weeksPerYear;
}

// GOOD: DRY approach
function calculateSalary(hourlyRate: number, hoursPerWeek: number): number {
    const weeksPerYear = 52;
    return hourlyRate * hoursPerWeek * weeksPerYear;}
```

</div>

### زبان C#

<div dir="ltr">

```csharp
// BAD: Repeated logic
public class ReportGenerator 
{
    public void GeneratePdfReport() 
    {
        Console.WriteLine("Connecting to database...");
        Console.WriteLine("Fetching data...");
        Console.WriteLine("Generating PDF...");
    }

    public void GenerateExcelReport() 
    {
        Console.WriteLine("Connecting to database...");
        Console.WriteLine("Fetching data...");
        Console.WriteLine("Generating Excel...");
    }
}

// GOOD: DRY approach
public class ReportGenerator 
{
    private void FetchData() 
    {
        Console.WriteLine("Connecting to database...");
        Console.WriteLine("Fetching data...");
    }

    public void GeneratePdfReport() 
    {
        FetchData();
        Console.WriteLine("Generating PDF...");
    }

    public void GenerateExcelReport() 
    {
        FetchData();
        Console.WriteLine("Generating Excel...");
    }
}
```

</div>

</div>
