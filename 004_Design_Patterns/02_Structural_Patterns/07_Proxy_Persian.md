<div dir="rtl">

# الگوی پروکسی (Proxy Pattern)

## این الگو چیست؟
الگوی پروکسی (یا وکیل) یک الگوی طراحی ساختاری (Structural) است که به شما اجازه می‌دهد یک جانشین یا نماینده (Placeholder) برای یک شیء دیگر ایجاد کنید. پروکسی دسترسی به شیء اصلی را کنترل می‌کند و به شما اجازه می‌دهد قبل یا بعد از رسیدن درخواست به شیء اصلی، کارهای خاصی را انجام دهید.

## تاریخچه و دلیل پیدایش
این الگو توسط گروه GoF در سال ۱۹۹۴ معرفی شد. هدف از ایجاد آن به تعویق انداختن هزینه ساخت اشیاء سنگین (Virtual Proxy)، مدیریت کنترل دسترسی و امنیت (Protection Proxy)، و یا نمایندگی اشیایی که در فضاهای آدرس‌دهی دیگر یا سرورهای ریموت قرار دارند (Remote Proxy) بود.

## چه مشکلاتی را برطرف می‌کند؟
- **مدیریت منابع**: بارگذاری یک شیء سنگین (مانند یک کانکشن عظیم پایگاه داده یا یک تصویر با وضوح بسیار بالا) در زمان بالا آمدن برنامه سرعت را کاهش می‌دهد، حتی اگر هرگز در طول برنامه از آن شیء استفاده نشود.
- **کنترل دسترسی و لاگ‌گیری (Logging)**: ممکن است نیاز داشته باشید قبل از اعطای دسترسی به یک سرویس هسته‌ای، دسترسی‌ها را بررسی کنید، کاربران را احراز هویت کنید، یا تعاملات را ثبت (Log) کنید.

## کجا و چه زمانی باید از آن استفاده کرد؟
زمانی از الگوی پروکسی استفاده کنید که نیاز دارید لایه‌ای از کنترل روی نحوه و زمان دسترسی به یک شیء ایجاد کنید. این الگو به طور مکرر برای مقداردهی تنبل (Lazy Initialization)، کش کردن (Caching) درخواست‌ها، یا بررسی‌های امنیتی استفاده می‌شود.

## مثال‌ها

### زبان JavaScript

<div dir="ltr">

```javascript
// The Real Subject
class RealDatabase {
    query(sql) {
        console.log(`Executing query on DB: ${sql}`);
        return ["row1", "row2"];
    }
}

// The Proxy
class DatabaseProxy {
    constructor(userRole) {
        this.userRole = userRole;
        this.realDatabase = null; // Lazy load
    }

    query(sql) {
        // Protection Proxy behavior
        if (this.userRole !== 'ADMIN') {
            console.log("Access Denied: Only ADMIN can query DB.");
            return [];
        }

        // Virtual Proxy behavior (Lazy Initialization)
        if (!this.realDatabase) {
            console.log("Initializing heavy RealDatabase connection...");
            this.realDatabase = new RealDatabase();
        }

        console.log(`[LOG]: Query requested at ${new Date().toISOString()}`);
        return this.realDatabase.query(sql);
    }
}

// Usage
const guestDb = new DatabaseProxy("GUEST");
guestDb.query("SELECT * FROM users"); // Denied

const adminDb = new DatabaseProxy("ADMIN");
adminDb.query("SELECT * FROM users"); // Allowed, DB initialized
adminDb.query("SELECT * FROM posts"); // Allowed, DB already initialized
```

</div>

### زبان TypeScript

<div dir="ltr">

```typescript
interface IServer {
    handleRequest(url: string): void;
}

class RealServer implements IServer {
    public handleRequest(url: string): void {
        console.log(`[RealServer]: Serving content for ${url}`);
    }
}

class CacheProxyServer implements IServer {
    private realServer: RealServer;
    private cache: Map<string, string> = new Map();

    constructor() {
        this.realServer = new RealServer();
    }

    public handleRequest(url: string): void {
        if (this.cache.has(url)) {
            console.log(`[CacheProxy]: Serving ${url} from CACHE`);
        } else {
            console.log(`[CacheProxy]: Cache miss. Forwarding to RealServer.`);
            this.realServer.handleRequest(url);
            this.cache.set(url, "Cached Content");
        }
    }
}

// Usage
const proxy: IServer = new CacheProxyServer();
proxy.handleRequest("/home"); // Miss, forwards to RealServer
proxy.handleRequest("/home"); // Hit, serves from Cache
```

</div>

### زبان C#

<div dir="ltr">

```csharp
using System;

// 1. Subject Interface
public interface IDocument 
{
    void Display();
}

// 2. Real Subject
public class HighResImage : IDocument 
{
    private string _filename;

    public HighResImage(string filename) 
    {
        _filename = filename;
        LoadFromDisk(); // Expensive operation
    }

    private void LoadFromDisk() 
    {
        Console.WriteLine($"Loading massive image {_filename} from disk...");
    }

    public void Display() 
    {
        Console.WriteLine($"Displaying image {_filename}");
    }
}

// 3. Proxy
public class ImageProxy : IDocument 
{
    private HighResImage _realImage;
    private string _filename;

    public ImageProxy(string filename) 
    {
        _filename = filename;
    }

    public void Display() 
    {
        // Lazy Initialization
        if (_realImage == null) 
        {
            _realImage = new HighResImage(_filename);
        }
        _realImage.Display();
    }
}

// Usage
// IDocument image = new ImageProxy("test_10GB_image.png");
// Console.WriteLine("ImageProxy object created. (Image is NOT loaded yet)");
// image.Display(); // Now it loads and displays
// image.Display(); // Does not load again, just displays
```

</div>

</div>
