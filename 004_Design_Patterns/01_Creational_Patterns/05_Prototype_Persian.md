<div dir="rtl">

# الگوی نمونه‌اولیه (Prototype Pattern)

## این الگو چیست؟
الگوی نمونه‌اولیه (Prototype) یک الگوی Creational است که به شما اجازه می‌دهد اشیاء موجود را بدون وابستگی کدهایتان به کلاس‌های آن‌ها، کپی کنید.

## تاریخچه و دلیل پیدایش
این الگو توسط گروه GoF (۱۹۹۴) معرفی شد. هدف از ایجاد آن، رفع پیچیدگی و هزینه بالای ساخت یک شیء از پایه بود، زمانی که اشیاء مشابه قبلاً در حافظه ایجاد شده بودند و فقط نیاز به یک کپی داشتیم.

## چه مشکلاتی را برطرف می‌کند؟
- **هزینه بالای نمونه‌سازی (Instantiation Cost)**: اگر ساخت یک شیء زمان‌بر باشد (مثلاً نیازمند کوئری دیتابیس یا درخواست شبکه باشد)، کلون کردن (Cloning) یک شیءِ کش‌شده بسیار سریع‌تر است.
- **وابستگی به کلاس‌های دقیق**: زمانی که نیاز دارید از یک شیء کپی بگیرید اما کلاس آن Private یا نامشخص است (مثلاً توسط یک API شخص ثالث ارائه شده است).

## کجا و چه زمانی باید از آن استفاده کرد؟
زمانی از این الگو استفاده کنید که کُد شما نباید به کلاس دقیق اشیائی که قرار است کپی شوند وابسته باشد. این الگو در جاوا اسکریپت بسیار رایج است (چون خود زبان مبتنی بر Prototype است) و همچنین در سناریوهای پیکربندی که یک شیء 'پیش‌فرض' کلون شده و کمی تغییر می‌کند، بسیار کاربرد دارد.

## مثال‌ها

### زبان JavaScript

<div dir="ltr">

```javascript
// In JavaScript, prototype cloning is natively supported
const vehiclePrototype = {
    wheels: 4,
    color: 'white',
    
    clone() {
        // Deep clone or shallow clone using Object.create or spread syntax
        return Object.create(this); 
    }
};

const car1 = vehiclePrototype.clone();
car1.color = 'red';

const car2 = vehiclePrototype.clone();
car2.color = 'blue';

console.log(car1.color); // red
console.log(car1.wheels); // 4 (inherited from prototype)
```

</div>

### زبان TypeScript

<div dir="ltr">

```typescript
interface ICloneableShape {
    clone(): ICloneableShape;
}

class Rectangle implements ICloneableShape {
    constructor(public width: number, public height: number) {}

    public clone(): this {
        // Deep clone or shallow clone logic
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}

// Usage
const original = new Rectangle(10, 20);
const copy = original.clone();
copy.width = 50;

console.log(original.width); // 10
console.log(copy.width); // 50
```

</div>

### زبان C#

<div dir="ltr">

```csharp
// The Prototype interface
public interface ICloneableShape
{
    ICloneableShape Clone();
}

public class Rectangle : ICloneableShape
{
    public int Width { get; set; }
    public int Height { get; set; }

    public Rectangle(int width, int height)
    {
        Width = width;
        Height = height;
    }

    // Implementing the Clone method
    public ICloneableShape Clone()
    {
        // MemberwiseClone creates a shallow copy. 
        // For deep copy, you would manually copy reference types.
        return (ICloneableShape)this.MemberwiseClone();
    }
}

// Usage
// Rectangle original = new Rectangle(10, 20);
// Rectangle copy = (Rectangle)original.Clone();
```

</div>

</div>
