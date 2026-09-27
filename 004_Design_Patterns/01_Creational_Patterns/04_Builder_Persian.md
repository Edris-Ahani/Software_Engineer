<div dir="rtl">

# الگوی سازنده (Builder Pattern)

## این الگو چیست؟
الگوی سازنده (Builder) یک الگوی طراحی Creational است که به شما امکان می‌دهد اشیاء پیچیده را مرحله به مرحله بسازید. این الگو اجازه می‌دهد از یک کد سازنده یکسان برای تولید انواع و نمایش‌های مختلفی از یک شیء استفاده کنید.

## تاریخچه و دلیل پیدایش
این الگو توسط گروه GoF در سال ۱۹۹۴ معرفی شد. هدف از ایجاد آن، حل مشکل متدهای سازنده تلسکوپی (Telescoping Constructors) بود (متد سازنده‌ای که پارامترهای بسیار زیادی دارد).

## چه مشکلاتی را برطرف می‌کند؟
- **سازنده‌های تلسکوپی**: از ایجاد کلاس‌هایی با متدهای سازنده غول‌پیکر که ده‌ها پارامتر (اغلب اختیاری یا `null`) دارند جلوگیری می‌کند.
- **وضعیت ناقص شیء**: تضمین می‌کند که یک شیء قبل از بازگردانده شدن، به صورت کامل و در یک توالی مشخص ساخته می‌شود و از ایجاد اشیاء با مقداردهی ناقص جلوگیری می‌کند.

## کجا و چه زمانی باید از آن استفاده کرد؟
زمانی از این الگو استفاده کنید که ساخت یک شیء پیچیده شامل مراحل متعددی است، یا زمانی که به نمایش‌های مختلفی از یک شیء نیاز دارید (مثلاً ساخت یک کوئری SQL، ایجاد یک ساختار پیچیده از عناصر HTML، یا پیکربندی پروفایل کاربری با تنظیمات اختیاری زیاد).

## مثال‌ها

### زبان JavaScript

<div dir="ltr">

```javascript
class User {
    constructor() {
        this.name = '';
        this.age = 0;
        this.email = '';
        this.phone = '';
        this.address = '';
    }
}

class UserBuilder {
    constructor(name) {
        this.user = new User();
        this.user.name = name;
    }

    setAge(age) {
        this.user.age = age;
        return this; // Return builder for chaining
    }

    setEmail(email) {
        this.user.email = email;
        return this;
    }

    setAddress(address) {
        this.user.address = address;
        return this;
    }

    build() {
        return this.user;
    }
}

// Usage with Method Chaining
const myUser = new UserBuilder("John Doe")
    .setAge(30)
    .setEmail("john@example.com")
    .setAddress("123 Main St")
    .build();

console.log(myUser);
```

</div>

### زبان TypeScript

<div dir="ltr">

```typescript
class UserProfile {
    public name: string = '';
    public age: number = 0;
    public email: string = '';
}

interface IUserBuilder {
    setAge(age: number): this;
    setEmail(email: string): this;
    build(): UserProfile;
}

class UserProfileBuilder implements IUserBuilder {
    private user: UserProfile;

    constructor(name: string) {
        this.user = new UserProfile();
        this.user.name = name;
    }

    public setAge(age: number): this {
        this.user.age = age;
        return this; // Return builder for chaining
    }

    public setEmail(email: string): this {
        this.user.email = email;
        return this;
    }

    public build(): UserProfile {
        return this.user;
    }
}

// Usage with Method Chaining
const myUser: UserProfile = new UserProfileBuilder("John Doe")
    .setAge(30)
    .setEmail("john@example.com")
    .build();

console.log(myUser);
```

</div>

### زبان C#

<div dir="ltr">

```csharp
public class Car 
{
    public string Engine { get; set; }
    public int Seats { get; set; }
    public bool HasGPS { get; set; }
    public bool HasTripComputer { get; set; }
}

public interface ICarBuilder 
{
    void Reset();
    void SetSeats(int seats);
    void SetEngine(string engine);
    void SetGPS(bool hasGPS);
    Car GetResult();
}

public class SportsCarBuilder : ICarBuilder 
{
    private Car _car = new Car();

    public void Reset() => _car = new Car();
    public void SetSeats(int seats) => _car.Seats = seats;
    public void SetEngine(string engine) => _car.Engine = engine;
    public void SetGPS(bool hasGPS) => _car.HasGPS = hasGPS;
    
    public Car GetResult() 
    {
        Car result = _car;
        Reset();
        return result;
    }
}

// Optional: Director class to dictate building steps
public class Director 
{
    public void ConstructSportsCar(ICarBuilder builder) 
    {
        builder.Reset();
        builder.SetSeats(2);
        builder.SetEngine("V8");
        builder.SetGPS(true);
    }
}
```

</div>

</div>
