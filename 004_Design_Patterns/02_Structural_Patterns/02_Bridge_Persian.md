<div dir="rtl">

# الگوی پل (Bridge Pattern)

## این الگو چیست؟
الگوی پل (Bridge) یک الگوی ساختاری است که به شما اجازه می‌دهد یک کلاس بزرگ یا مجموعه‌ای از کلاس‌های کاملاً مرتبط را به دو سلسله‌مراتب جداگانه (انتزاع و پیاده‌سازی) تقسیم کنید که می‌توانند مستقل از یکدیگر توسعه یابند.

## تاریخچه و دلیل پیدایش
این الگو توسط گروه GoF در سال ۱۹۹۴ معرفی شد. هدف از ایجاد آن جلوگیری از "انفجار کلاس‌ها" (Class Explosion) بود که زمانی رخ می‌دهد که یک موجودیت دارای دو بعد مختلف برای تغییر باشد (مانند ترکیب شکل و رنگ).

## چه مشکلاتی را برطرف می‌کند؟
- **انفجار کلاس‌ها**: اگر کلاس `Shape` (شکل) داشته باشید و بخواهید قابلیت `Color` (رنگ) را اضافه کنید، ممکن است مجبور شوید کلاس‌های `دایره_قرمز`، `دایره_آبی`، `مربع_قرمز`، `مربع_آبی` را بسازید. اضافه کردن یک شکل یا رنگ جدید تعداد کلاس‌ها را به صورت تصاعدی افزایش می‌دهد.
- **وابستگی شدید**: منطق سطح بالا (انتزاع یا Abstraction) را از جزئیات مربوط به پلتفرم خاص (پیاده‌سازی یا Implementation) جدا می‌کند.

## کجا و چه زمانی باید از آن استفاده کرد؟
زمانی از این الگو استفاده کنید که می‌خواهید یک کلاس یکپارچه (Monolithic) را که دارای متغیرهای مختلفی از یک عملکرد است، سازماندهی و تقسیم کنید (مانند یک کامپوننت UI که باید در سیستم‌عامل‌های مختلف کار کند یا رسم اشکال هندسی در APIهای گرافیکی مختلف).

## مثال‌ها

### زبان JavaScript

<div dir="ltr">

```javascript
// Implementation hierarchy
class VectorRenderer {
    renderCircle(radius) {
        console.log(`Drawing a vector circle of radius ${radius}`);
    }
}

class RasterRenderer {
    renderCircle(radius) {
        console.log(`Drawing pixels for a circle of radius ${radius}`);
    }
}

// Abstraction hierarchy
class Shape {
    constructor(renderer) {
        this.renderer = renderer;
    }
    draw() {}
}

class Circle extends Shape {
    constructor(renderer, radius) {
        super(renderer);
        this.radius = radius;
    }

    draw() {
        this.renderer.renderCircle(this.radius);
    }
}

// Usage
const raster = new RasterRenderer();
const circle = new Circle(raster, 5);
circle.draw();
```

</div>

### زبان TypeScript

<div dir="ltr">

```typescript
// Implementation
interface Color {
    fill(): string;
}

class RedColor implements Color {
    fill(): string { return "Red"; }
}

class BlueColor implements Color {
    fill(): string { return "Blue"; }
}

// Abstraction
abstract class ColoredShape {
    protected color: Color;

    constructor(color: Color) {
        this.color = color;
    }

    abstract draw(): void;
}

class Square extends ColoredShape {
    draw(): void {
        console.log(`Drawing a ${this.color.fill()} square.`);
    }
}

// Usage
const red = new RedColor();
const redSquare = new Square(red);
redSquare.draw();
```

</div>

### زبان C#

<div dir="ltr">

```csharp
// 1. Implementation
public interface IDevice 
{
    void TurnOn();
    void TurnOff();
    void SetChannel(int channel);
}

public class TvDevice : IDevice 
{
    public void TurnOn() => Console.WriteLine("TV turned on");
    public void TurnOff() => Console.WriteLine("TV turned off");
    public void SetChannel(int channel) => Console.WriteLine($"TV channel set to {channel}");
}

public class RadioDevice : IDevice 
{
    public void TurnOn() => Console.WriteLine("Radio turned on");
    public void TurnOff() => Console.WriteLine("Radio turned off");
    public void SetChannel(int channel) => Console.WriteLine($"Radio frequency set to {channel}");
}

// 2. Abstraction
public class RemoteControl 
{
    protected IDevice device;

    public RemoteControl(IDevice device) 
    {
        this.device = device;
    }

    public void TogglePower() 
    {
        Console.WriteLine("Remote: Power toggle");
        device.TurnOn();
    }
}

// Refined Abstraction
public class AdvancedRemoteControl : RemoteControl 
{
    public AdvancedRemoteControl(IDevice device) : base(device) { }

    public void Mute() 
    {
        Console.WriteLine("Remote: Muted");
    }
}

// 3. Client Usage
// IDevice tv = new TvDevice();
// RemoteControl remote = new RemoteControl(tv);
// remote.TogglePower();
```

</div>

</div>
