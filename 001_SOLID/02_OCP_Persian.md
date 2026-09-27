<div dir="rtl">

# اصل باز/بسته (OCP - Open/Closed Principle)

## این اصل چیست؟
اصل باز/بسته (OCP) حرف 'O' در مخفف SOLID است. این اصل بیان می‌کند که موجودیت‌های نرم‌افزاری (کلاس‌ها، ماژول‌ها، توابع و غیره) باید **برای توسعه باز (Open for extension) و برای تغییر بسته (Closed for modification)** باشند. به این معنی که بتوانید بدون تغییر در کدهای موجود، عملکردهای جدیدی به سیستم اضافه کنید.

## تاریخچه و دلیل پیدایش
این اصل توسط برتراند مایر (Bertrand Meyer) در سال ۱۹۸۸ در کتاب "ساخت نرم‌افزار شی‌گرا" معرفی شد. هدف این بود که هنگام افزودن ویژگی‌های جدید، از ایجاد باگ در کدهایی که قبلاً تست شده و به درستی کار می‌کنند، جلوگیری شود.

## چه مشکلاتی را برطرف می‌کند؟
- **کد شکننده (Fragile Code)**: تغییر در کدهای موجود معمولاً باعث از کار افتادن عملکردهای قبلی می‌شود.
- **بازنویسی گسترده**: بدون OCP، افزودن یک نوع یا رفتار جدید نیازمند پیدا کردن تمام دستورات `if` یا `switch` در سراسر پروژه و تغییر آن‌هاست.
- **سربار تست**: اگر یک کلاس موجود را تغییر دهید، مجبور می‌شوید تمام عملکردهای قبلی آن را دوباره تست کنید.

## کجا و چه زمانی باید از آن استفاده کرد؟
زمانی که قوانین تجاری یا الگوریتم‌هایی دارید که انواع مختلفی دارند (مثلاً روش‌های پرداخت، انواع اعلان، فرمت‌های خروجی). از اینترفیس‌ها (Interfaces)، کلاس‌های انتزاعی (Abstract Classes) یا توابع سطح بالا (Higher-order functions) استفاده کنید تا رفتارهای جدید را به سیستم تزریق کنید.

## مثال‌ها

### زبان JavaScript

<div dir="ltr">

```javascript
// BAD: Needs modification every time a new payment method is added
class PaymentProcessor {
    processPayment(paymentType, amount) {
        if (paymentType === 'creditCard') {
            console.log(`Processing credit card payment of $${amount}`);
        } else if (paymentType === 'paypal') {
            console.log(`Processing PayPal payment of $${amount}`);
        }
        // Changing this file for a new method violates OCP!
    }
}

// GOOD: Closed for modification, Open for extension
class CreditCardPayment {
    process(amount) {
        console.log(`Processing credit card payment of $${amount}`);
    }
}

class PayPalPayment {
    process(amount) {
        console.log(`Processing PayPal payment of $${amount}`);
    }
}

class PaymentProcessor {
    // We can pass any new payment class here without changing this method
    processPayment(paymentMethod, amount) {
        paymentMethod.process(amount);
    }
}
```

</div>

### زبان TypeScript

<div dir="ltr">

```typescript
// GOOD: Closed for modification, Open for extension
interface IPaymentMethod {
    process(amount: number): void;
}

class CreditCardPayment implements IPaymentMethod {
    public process(amount: number): void {
        console.log(`Processing credit card payment of ${amount}`);
    }
}

class PayPalPayment implements IPaymentMethod {
    public process(amount: number): void {
        console.log(`Processing PayPal payment of ${amount}`);
    }
}

class PaymentProcessor {
    // We can pass any new payment class here without changing this method
    public processPayment(paymentMethod: IPaymentMethod, amount: number): void {
        paymentMethod.process(amount);
    }
}
```

</div>

### زبان C#

<div dir="ltr">

```csharp
// BAD: Modifying the class for new shapes
public class AreaCalculator 
{
    public double CalculateArea(object[] shapes) 
    {
        double area = 0;
        foreach (var shape in shapes) 
        {
            if (shape is Rectangle r) 
                area += r.Width * r.Height;
            else if (shape is Circle c) 
                area += Math.PI * c.Radius * c.Radius;
            // Adding a Triangle requires changing this class
        }
        return area;
    }
}

// GOOD: Using Polymorphism to satisfy OCP
public abstract class Shape 
{
    public abstract double CalculateArea();
}

public class Rectangle : Shape 
{
    public double Width { get; set; }
    public double Height { get; set; }
    public override double CalculateArea() => Width * Height;
}

public class Circle : Shape 
{
    public double Radius { get; set; }
    public override double CalculateArea() => Math.PI * Radius * Radius;
}

public class AreaCalculator 
{
    public double CalculateArea(Shape[] shapes) 
    {
        double area = 0;
        // This code never changes, even if we add 100 new shapes
        foreach (var shape in shapes) 
        {
            area += shape.CalculateArea();
        }
        return area;
    }
}
```

</div>

</div>
