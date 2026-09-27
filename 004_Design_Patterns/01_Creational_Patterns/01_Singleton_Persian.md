<div dir="rtl">

# الگوی سینگلتون (Singleton Pattern)

## این الگو چیست؟
سینگلتون یک الگوی طراحی سازنده (Creational) است که تضمین می‌کند از یک کلاس فقط و فقط یک نمونه (Instance) ساخته شود و یک نقطه دسترسی عمومی (Global) به آن نمونه فراهم می‌کند.

## تاریخچه و دلیل پیدایش
این الگو در سال ۱۹۹۴ در کتاب معروف "Design Patterns" توسط گروه چهارنفره (Gang of Four یا GoF) معرفی شد.

## چه مشکلاتی را برطرف می‌کند؟
- **مدیریت منابع مشترک**: زمانی که برای هماهنگی عملیات در کل سیستم دقیقاً به یک نمونه از کلاس نیاز دارید (مانند استخر اتصالات دیتابیس، سیستم لاگ‌گیری یا مدیر پیکربندی).
- **وضعیت سراسری (Global State)**: این الگو جایگزین امن‌تری برای متغیرهای سراسری (Global Variables) است، زیرا نمونه را کپسوله کرده و نحوه ساخت آن را کنترل می‌کند.

## کجا و چه زمانی باید از آن استفاده کرد؟
از سینگلتون زمانی استفاده کنید که یک کلاس در برنامه شما باید فقط یک نمونه داشته باشد که در دسترس همه کلاینت‌ها باشد (مثل سرویس مرکزی لاگ‌گیری یا مدیر رابط سخت‌افزار). دقت کنید که استفاده بیش از حد از آن می‌تواند منجر به وابستگی شدید و سختی در تست واحد (Unit Testing) شود و در برخی مواقع یک ضدالگو (Anti-pattern) در نظر گرفته می‌شود.

## مثال‌ها

### زبان JavaScript

<div dir="ltr">

```javascript
class DatabaseConnection {
    constructor() {
        if (DatabaseConnection.instance) {
            return DatabaseConnection.instance;
        }
        
        this.connectionString = "mongodb://localhost:27017";
        this.isConnected = true;
        
        // Cache the instance
        DatabaseConnection.instance = this;
        return this;
    }

    query(sql) {
        console.log(`Executing query: ${sql}`);
    }
}

// Usage:
const db1 = new DatabaseConnection();
const db2 = new DatabaseConnection();

console.log(db1 === db2); // true (Both are the exact same instance)
```

</div>

### زبان TypeScript

<div dir="ltr">

```typescript
class Logger {
    private static instance: Logger;

    // Private constructor prevents instantiation from other classes
    private constructor() { }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    public log(message: string): void {
        console.log(`[LOG]: ${message}`);
    }
}

// Usage:
const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();

console.log(logger1 === logger2); // true
```

</div>

### زبان C#

<div dir="ltr">

```csharp
public class Logger
{
    // 1. Private static instance
    private static Logger _instance;
    // Object for thread-safety lock
    private static readonly object _lock = new object();

    // 2. Private constructor prevents instantiation from other classes
    private Logger() { }

    // 3. Public static method to get the instance
    public static Logger Instance
    {
        get
        {
            // Double-check locking for thread safety
            if (_instance == null)
            {
                lock (_lock)
                {
                    if (_instance == null)
                    {
                        _instance = new Logger();
                    }
                }
            }
            return _instance;
        }
    }

    public void Log(string message)
    {
        Console.WriteLine($"[LOG]: {message}");
    }
}

// Usage:
// Logger.Instance.Log("System started.");
// Logger.Instance.Log("User logged in.");
```

</div>

</div>
