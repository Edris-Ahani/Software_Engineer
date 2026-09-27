<div dir="rtl">

# الگوی متد کارخانه (Factory Method Pattern)

## این الگو چیست؟
الگوی متد کارخانه (Factory Method) یک الگوی سازنده (Creational) است که یک اینترفیس برای ساخت اشیاء در کلاس پدر فراهم می‌کند، اما به کلاس‌های فرزند اجازه می‌دهد نوع شیء ایجاد شده را تغییر دهند.

## تاریخچه و دلیل پیدایش
این الگو توسط گروه GoF در سال ۱۹۹۴ معرفی شد. دلیل پیدایش آن نیاز به جداسازی کدهای فریم‌ورک/کتابخانه از اشیاء تجاری واقعی بود که سیستم باید آن‌ها را نمونه‌سازی می‌کرد.

## چه مشکلاتی را برطرف می‌کند؟
- **وابستگی شدید به کلاس‌های دقیق (Concrete Classes)**: استفاده مستقیم از کلمه کلیدی `new` باعث هاردکد شدن نام کلاس می‌شود. Factory Method پروسه ساخت شیء را از استفاده‌ی آن جدا می‌کند.
- **نقض اصل مسئولیت واحد (SRP)**: اگر کلاسی کار اصلی خود را انجام دهد و در عین حال منطق پیچیده‌ای برای ساخت اشیاء دیگر داشته باشد، وظایف زیادی بر عهده گرفته است. متد کارخانه وظیفه ساخت را محول می‌کند.

## کجا و چه زمانی باید از آن استفاده کرد؟
زمانی از این الگو استفاده کنید که از قبل نوع دقیق و وابستگی‌های اشیایی که کُد شما قرار است با آن‌ها کار کند را نمی‌دانید. این الگو به طور گسترده در فریم‌ورک‌های رابط کاربری (مانند ساخت دکمه‌های چندسکویی) و لایه‌های دسترسی به داده استفاده می‌شود.

## مثال‌ها

### زبان JavaScript

<div dir="ltr">

```javascript
// Product Interface (Conceptual)
class Transport {
    deliver() {}
}

class Truck extends Transport {
    deliver() {
        console.log("Delivering cargo by land in a box.");
    }
}

class Ship extends Transport {
    deliver() {
        console.log("Delivering cargo by sea in a container.");
    }
}

// Factory (Creator)
class Logistics {
    // The Factory Method
    createTransport() {
        throw new Error("This method must be overridden!");
    }

    planDelivery() {
        const transport = this.createTransport();
        transport.deliver();
    }
}

class RoadLogistics extends Logistics {
    createTransport() {
        return new Truck();
    }
}

class SeaLogistics extends Logistics {
    createTransport() {
        return new Ship();
    }
}

// Usage
const logistics = new RoadLogistics();
logistics.planDelivery(); // Delivering cargo by land...
```

</div>

### زبان TypeScript

<div dir="ltr">

```typescript
// Product Interface
interface ITransport {
    deliver(): void;
}

class Truck implements ITransport {
    public deliver(): void {
        console.log("Delivering cargo by land in a box.");
    }
}

class Ship implements ITransport {
    public deliver(): void {
        console.log("Delivering cargo by sea in a container.");
    }
}

// Factory (Creator)
abstract class Logistics {
    // The Factory Method
    public abstract createTransport(): ITransport;

    public planDelivery(): void {
        const transport = this.createTransport();
        transport.deliver();
    }
}

class RoadLogistics extends Logistics {
    public createTransport(): ITransport {
        return new Truck();
    }
}

class SeaLogistics extends Logistics {
    public createTransport(): ITransport {
        return new Ship();
    }
}

// Usage
const logistics: Logistics = new RoadLogistics();
logistics.planDelivery(); // Delivering cargo by land...
```

</div>

### زبان C#

<div dir="ltr">

```csharp
// 1. The Product Interface
public interface IButton
{
    void Render();
    void OnClick();
}

// 2. Concrete Products
public class WindowsButton : IButton
{
    public void Render() => Console.WriteLine("Rendering Windows Button");
    public void OnClick() => Console.WriteLine("Windows Button Clicked");
}

public class HtmlButton : IButton
{
    public void Render() => Console.WriteLine("Rendering HTML Button");
    public void OnClick() => Console.WriteLine("HTML Button Clicked");
}

// 3. The Creator
public abstract class Dialog
{
    // The Factory Method
    public abstract IButton CreateButton();

    public void RenderWindow()
    {
        IButton okButton = CreateButton();
        okButton.Render();
    }
}

// 4. Concrete Creators
public class WindowsDialog : Dialog
{
    public override IButton CreateButton() => new WindowsButton();
}

public class WebDialog : Dialog
{
    public override IButton CreateButton() => new HtmlButton();
}
```

</div>

</div>
