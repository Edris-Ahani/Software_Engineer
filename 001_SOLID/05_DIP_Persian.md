<div dir="rtl">

# اصل وارونگی وابستگی (DIP - Dependency Inversion Principle)

## این اصل چیست؟
اصل وارونگی وابستگی (DIP) حرف 'D' در مخفف SOLID است. این اصل دو بخش دارد:
۱. ماژول‌های سطح بالا (منطق اصلی) نباید به ماژول‌های سطح پایین (دیتابیس، فایل و...) وابسته باشند. هر دو باید به انتزاعات (اینترفیس‌ها) وابسته باشند.
۲. انتزاعات نباید به جزئیات وابسته باشند. این جزئیات هستند که باید به انتزاعات وابسته باشند.

## تاریخچه و دلیل پیدایش
این اصل نیز توسط رابرت سی. مارتین توسعه یافت. هدف آن معکوس کردن معماری سنتی است که در آن کدهای سطح بالای سیستم مستقیماً به کدهای پیاده‌سازی سطح پایین وابسته بودند.

## چه مشکلاتی را برطرف می‌کند؟
- **وابستگی شدید (Tight Coupling)**: اگر منطق اصلی سیستم شما مستقیماً یک اتصال دیتابیس را مقداردهی (Instantiate) کند، شما به شدت به آن تکنولوژی خاص وابسته می‌شوید و تعویض آن سخت خواهد بود.
- **مشکل در تست**: اگر وابستگی به دیتابیس هاردکد شده باشد، نمی‌توانید در هنگام تست واحد (Unit Testing)، دیتابیس واقعی را با یک دیتابیس شبیه‌سازی شده (Mock) جایگزین کنید.

## کجا و چه زمانی باید از آن استفاده کرد؟
برای جدا کردن منطق تجاری سیستم (Core Business Logic) از زیرساخت‌ها (مثل دیتابیس، فایل سیستم، APIهای خارجی) از این اصل استفاده کنید. وابستگی‌ها را به جای ساخته شدن درون کلاس، از طریق متد سازنده (Constructor) به کلاس تزریق کنید (Dependency Injection).

## مثال‌ها

### زبان JavaScript

<div dir="ltr">

```javascript
// BAD: High-level logic depends directly on low-level implementation
class MySQLDatabase {
    save(data) {
        console.log("Saving to MySQL...");
    }
}

class UserService {
    constructor() {
        // Hardcoded dependency!
        this.database = new MySQLDatabase();
    }

    createUser(user) {
        this.database.save(user);
    }
}
```

</div>

<div dir="ltr">

```javascript
// GOOD: High-level logic depends on an abstraction (passed via constructor)
class MySQLDatabase {
    save(data) {
        console.log("Saving to MySQL...");
    }
}

class MongoDatabase {
    save(data) {
        console.log("Saving to MongoDB...");
    }
}

class UserService {
    // We inject the dependency. The service doesn't care which DB it is.
    constructor(database) {
        this.database = database;
    }

    createUser(user) {
        this.database.save(user);
    }
}

// Usage:
const service = new UserService(new MongoDatabase());
```

</div>

### زبان TypeScript

<div dir="ltr">

```typescript
// GOOD: High-level logic depends on an abstraction (passed via constructor)
interface IDatabase {
    save(data: any): void;
}

class MySQLDatabase implements IDatabase {
    public save(data: any): void {
        console.log("Saving to MySQL...");
    }
}

class MongoDatabase implements IDatabase {
    public save(data: any): void {
        console.log("Saving to MongoDB...");
    }
}

class UserService {
    // We inject the dependency. The service doesn't care which DB it is.
    constructor(private database: IDatabase) {}

    public createUser(user: any): void {
        this.database.save(user);
    }
}

// Usage:
const service = new UserService(new MongoDatabase());
```

</div>

### زبان C#

<div dir="ltr">

```csharp
// BAD: Tight coupling
public class FileLogger 
{
    public void Log(string message) => Console.WriteLine("File: " + message);
}

public class UserManager 
{
    private FileLogger _logger;

    public UserManager() 
    {
        _logger = new FileLogger(); // DIP Violation!
    }

    public void AddUser() 
    {
        _logger.Log("User added");
    }
}
```

</div>

<div dir="ltr">

```csharp
// GOOD: Dependency Inversion
public interface ILogger 
{
    void Log(string message);
}

public class FileLogger : ILogger 
{
    public void Log(string message) => Console.WriteLine("File: " + message);
}

public class DatabaseLogger : ILogger 
{
    public void Log(string message) => Console.WriteLine("DB: " + message);
}

public class UserManager 
{
    private readonly ILogger _logger;

    // Dependency is injected via constructor
    public UserManager(ILogger logger) 
    {
        _logger = logger;
    }

    public void AddUser() 
    {
        _logger.Log("User added");
    }
}

// Usage in Startup/Composition Root:
// var manager = new UserManager(new DatabaseLogger());
```

</div>

</div>
