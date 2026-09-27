<div dir="rtl">

# اصل جانشینی لیسکوف (LSP - Liskov Substitution Principle)

## این اصل چیست؟
اصل جانشینی لیسکوف (LSP) حرف 'L' در مخفف SOLID است. این اصل بیان می‌کند که اشیاء کلاس فرزند باید بتوانند بدون ایجاد اختلال در عملکرد برنامه، جایگزین اشیاء کلاس پدر شوند.

## تاریخچه و دلیل پیدایش
این اصل توسط باربارا لیسکوف (Barbara Liskov) در سال ۱۹۸۷ در یک سخنرانی با عنوان "انتزاع داده و سلسله مراتب" معرفی شد.

## چه مشکلاتی را برطرف می‌کند؟
- **باگ‌های غیرمنتظره**: زمانی که یک کلاس فرزند رفتار اصلی و قراردادهای کلاس پدر را تغییر می‌دهد، سیستم‌هایی که به کلاس پدر وابسته هستند دچار مشکل می‌شوند.
- **سربار بررسی نوع (Type Checking)**: کدهایی که بیش از حد از `typeof` یا `instanceof` استفاده می‌کنند تا نوع کلاس فرزند را تشخیص دهند، معمولاً این اصل را نقض کرده‌اند.

## کجا و چه زمانی باید از آن استفاده کرد؟
هنگام طراحی سلسله مراتب کلاس‌ها و استفاده از وراثت (Inheritance) باید این اصل را رعایت کنید. اگر کلاس فرزندی ساختید، مطمئن شوید که دقیقاً از قراردادهای پدرش پیروی می‌کند. اگر فرزند نمی‌تواند برخی کارهای پدر را انجام دهد، احتمالاً وراثت انتخاب اشتباهی بوده است (به جای آن از Composition استفاده کنید).

## مثال‌ها

### زبان JavaScript

<div dir="ltr">

```javascript
// BAD: Penguin inherits from Bird but breaks the contract
class Bird {
    fly() {
        console.log("Flying in the sky");
    }
}

class Eagle extends Bird {}

class Penguin extends Bird {
    fly() {
        throw new Error("Penguins cannot fly!"); // Violates LSP!
    }
}

function letBirdFly(bird) {
    bird.fly();
}

letBirdFly(new Eagle()); // Works
letBirdFly(new Penguin()); // Crashes!
```

</div>

<div dir="ltr">

```javascript
// GOOD: Refactored to separate flying and non-flying birds
class Bird {
    // General bird properties
}

class FlyingBird extends Bird {
    fly() {
        console.log("Flying in the sky");
    }
}

class SwimmingBird extends Bird {
    swim() {
        console.log("Swimming in the water");
    }
}

class Eagle extends FlyingBird {}
class Penguin extends SwimmingBird {}

function letBirdFly(bird) {
    bird.fly();
}

letBirdFly(new Eagle()); // Works
// letBirdFly(new Penguin()); // Type error (or ignored), but doesn't crash unexpectedly
```

</div>

### زبان TypeScript

<div dir="ltr">

```typescript
// GOOD: Refactored to separate flying and non-flying birds
class Bird {
    // General bird properties
}

interface IFlyable {
    fly(): void;
}

class FlyingBird extends Bird implements IFlyable {
    public fly(): void {
        console.log("Flying in the sky");
    }
}

class SwimmingBird extends Bird {
    public swim(): void {
        console.log("Swimming in the water");
    }
}

class Eagle extends FlyingBird {}
class Penguin extends SwimmingBird {}

function letBirdFly(bird: IFlyable): void {
    bird.fly();
}

letBirdFly(new Eagle()); // Works
// letBirdFly(new Penguin()); // Compile-time error, preventing unexpected crashes!
```

</div>

### زبان C#

<div dir="ltr">

```csharp
// BAD: Square inherits from Rectangle but breaks mathematical properties
public class Rectangle 
{
    public virtual int Width { get; set; }
    public virtual int Height { get; set; }
    public int Area => Width * Height;
}

public class Square : Rectangle 
{
    public override int Width 
    {
        set { base.Width = value; base.Height = value; }
    }
    public override int Height 
    {
        set { base.Height = value; base.Width = value; }
    }
}

public class AreaTest 
{
    public void TestArea(Rectangle rect) 
    {
        rect.Width = 5;
        rect.Height = 10;
        // For a normal rectangle, Area should be 50. 
        // But if rect is a Square, changing Height to 10 also changes Width to 10. Area becomes 100!
        if (rect.Area != 50) throw new Exception("Bad Area!"); // Violates LSP!
    }
}
```

</div>

<div dir="ltr">

```csharp
// GOOD: Do not use inheritance when mathematical contracts are broken.
public abstract class Shape 
{
    public abstract int Area { get; }
}

public class Rectangle : Shape 
{
    public int Width { get; set; }
    public int Height { get; set; }
    public override int Area => Width * Height;
}

public class Square : Shape 
{
    public int Side { get; set; }
    public override int Area => Side * Side;
}
```

</div>

</div>
