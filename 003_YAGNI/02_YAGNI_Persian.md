<div dir="rtl">

# اصل به آن نیاز نخواهی داشت (YAGNI - You Aren't Gonna Need It)

## این اصل چیست؟
اصل YAGNI یکی از اصول برنامه‌نویسی مفرط (Extreme Programming) است که بیان می‌کند یک برنامه‌نویس نباید قابلیتی را به نرم‌افزار اضافه کند مگر اینکه واقعاً به آن نیاز باشد.

## تاریخچه و دلیل پیدایش
این اصل در متدولوژی Extreme Programming (XP) ریشه دارد که توسط ران جفریز (Ron Jeffries)، کنت بک (Kent Beck) و وارد کانینگهام (Ward Cunningham) در اواخر دهه ۱۹۹۰ پایه‌گذاری شد. هدف از ایجاد این اصل، مبارزه با تمایل توسعه‌دهندگان به مهندسی بیش از حد (Over-engineering) و پیش‌بینی نیازمندی‌های آینده بود که در اکثر مواقع هرگز اتفاق نمی‌افتند.

## چه مشکلاتی را برطرف می‌کند؟
- **اتلاف زمان**: صرف ساعت‌ها زمان برای ساخت یک سیستم عمومی و قابل پیکربندی برای قابلیتی که هرگز استفاده نمی‌شود.
- **پیچیدگی کد**: انتزاعات و قابلیت‌های بدون استفاده باعث شلوغی کدبیس شده و درک منطق اصلی را برای توسعه‌دهندگان جدید دشوار می‌کند.
- **هزینه نگهداری**: حتی اگر یک کد مورد استفاده قرار نگیرد، همچنان باید کامپایل، تست و نگهداری شود.

## کجا و چه زمانی باید از آن استفاده کرد؟
در زمان طراحی و پیاده‌سازی از YAGNI استفاده کنید. هر زمان که در حال فکر کردن به این موضوع بودید که "شاید در آینده به این نیاز پیدا کنیم..."، توقف کنید! فقط کدی را بنویسید که برای نیازمندی‌های فعلی ضروری است.

## مثال‌ها

### زبان JavaScript

<div dir="ltr">

```javascript
// BAD: Over-engineered anticipating future needs
class UserService {
    // We only need to create a user, but the developer added caching, 
    // notifications, and audit logging "just in case".
    createUser(user) {
        this.cacheUser(user);
        this.notifyAdmin(user);
        this.auditLog('Create', user);
        return db.insert(user);
    }
    // ... many unused methods ...
}

// GOOD: Simple and minimal, matching current requirements
class UserService {
    createUser(user) {
        // Just insert the user to DB as currently requested
        return db.insert(user);
    }
}
```

</div>

### زبان TypeScript

<div dir="ltr">

```typescript
interface User {
    id?: number;
    name: string;
}

// BAD: Over-engineered anticipating future needs
class UserServiceBad {
    public createUser(user: User): void {
        this.cacheUser(user);
        this.notifyAdmin(user);
        this.auditLog('Create', user);
        console.log("Inserted user to DB");
    }
    
    private cacheUser(user: User): void {}
    private notifyAdmin(user: User): void {}
    private auditLog(action: string, user: User): void {}
}

// GOOD: Simple and minimal, matching current requirements
class UserServiceGood {
    public createUser(user: User): void {
        // Just insert the user to DB as currently requested
        console.log("Inserted user to DB");
    }
}
```

</div>

### زبان C#

<div dir="ltr">

```csharp
// BAD: Building a complex interface for a simple requirement
public interface IRepository<T> 
{
    void Add(T entity);
    void Delete(T entity);
    void Update(T entity);
    IEnumerable<T> GetAll();
    IEnumerable<T> Find(Predicate<T> predicate);
    // 10 other methods we don't need right now...
}

// GOOD: Implementing only what is required
public class UserRepository 
{
    // We only need to save a user right now.
    public void Add(User user) 
    {
        _dbContext.Users.Add(user);
        _dbContext.SaveChanges();
    }
}
```

</div>

</div>
