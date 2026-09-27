<div dir="rtl">

# اصل مسئولیت واحد (SRP - Single Responsibility Principle)

## این اصل چیست؟
اصل مسئولیت واحد (SRP) حرف 'S' در کلمه اختصاری SOLID است. این اصل بیان می‌کند که یک کلاس، ماژول یا تابع باید فقط و فقط یک دلیل برای تغییر داشته باشد. این بدان معناست که هر بخش از کد باید تنها یک وظیفه یا مسئولیت مشخص را بر عهده بگیرد.

## تاریخچه و دلیل پیدایش
این اصل توسط رابرت سی. مارتین (Robert C. Martin - معروف به Uncle Bob) در سال ۲۰۰۳ در کتاب "توسعه نرم‌افزار چابک، اصول، الگوها و رویه‌ها" معرفی شد. این اصل بر پایه مفهوم انسجام (Cohesion) بنا شده است.

## چه مشکلاتی را برطرف می‌کند؟
- **وابستگی شدید (High Coupling)**: وقتی یک کلاس کارهای زیادی انجام می‌دهد، تغییر یک بخش ممکن است به‌طور غیرمنتظره باعث از کار افتادن بخش دیگری شود.
- **دشواری در تست**: کلاس‌های همه‌کاره (God Classes) به دلیل داشتن وابستگی‌های متعدد، برای تست واحد (Unit Testing) بسیار چالش‌برانگیز هستند.
- **تداخل در ادغام کد (Merge Conflicts)**: اگر یک کلاس همزمان درگیر فرمت‌بندی رابط کاربری، منطق تجاری و دسترسی به دیتابیس باشد، چندین برنامه‌نویس به طور همزمان روی یک فایل کار خواهند کرد که باعث تداخل‌های مکرر می‌شود.

## کجا و چه زمانی باید از آن استفاده کرد؟
هنگام طراحی کلاس‌ها، ماژول‌ها و میکروسرویس‌ها از SRP استفاده کنید. اگر برای توصیف کار یک کلاس مجبور به استفاده از کلمه "و" شدید (مثلاً "این کلاس مالیات را محاسبه می‌کند و در دیتابیس ذخیره می‌کند")، به احتمال زیاد اصل SRP نقض شده است.

## مثال‌ها

### زبان JavaScript

<div dir="ltr">

```javascript
// BAD: Class has multiple responsibilities (Logic + DB + Email)
class UserRegistration {
    registerUser(email, password) {
        // 1. Business Logic
        if (!email.includes('@')) throw new Error("Invalid email");
        
        // 2. Database interaction
        database.save({ email, password });
        
        // 3. Notification
        emailService.send(email, "Welcome!");
    }
}

// GOOD: Responsibilities are separated
class UserValidator {
    validate(email) {
        if (!email.includes('@')) throw new Error("Invalid email");
    }
}

class UserRepository {
    save(user) {
        database.save(user);
    }
}

class EmailSender {
    sendWelcomeEmail(email) {
        emailService.send(email, "Welcome!");
    }
}

class UserRegistration {
    constructor(validator, repository, emailSender) {
        this.validator = validator;
        this.repository = repository;
        this.emailSender = emailSender;
    }

    registerUser(email, password) {
        this.validator.validate(email);
        this.repository.save({ email, password });
        this.emailSender.sendWelcomeEmail(email);
    }
}
```

</div>

### زبان TypeScript

<div dir="ltr">

```typescript
class User {
    constructor(public email: string, public password: string) {}
}

// GOOD: Responsibilities are separated
class UserValidator {
    public validate(email: string): void {
        if (!email.includes('@')) throw new Error("Invalid email");
    }
}

class UserRepository {
    public save(user: User): void {
        console.log("Saved to DB", user);
    }
}

class EmailSender {
    public sendWelcomeEmail(email: string): void {
        console.log(`Sending welcome email to ${email}`);
    }
}

class UserRegistration {
    constructor(
        private validator: UserValidator,
        private repository: UserRepository,
        private emailSender: EmailSender
    ) {}

    public registerUser(email: string, password: string): void {
        this.validator.validate(email);
        this.repository.save(new User(email, password));
        this.emailSender.sendWelcomeEmail(email);
    }
}
```

</div>

### زبان C#

<div dir="ltr">

```csharp
// BAD: One class doing everything
public class InvoiceManager 
{
    public void AddInvoice(Invoice invoice) 
    {
        // 1. Business logic
        if (invoice.Amount < 0) throw new Exception("Invalid amount");

        // 2. Database access
        using (var connection = new SqlConnection("...")) 
        {
            // Insert into DB
        }

        // 3. File system access
        File.WriteAllText("log.txt", $"Invoice {invoice.Id} created");
    }
}

// GOOD: Separation of Concerns
public class InvoiceValidator 
{
    public bool Validate(Invoice invoice) => invoice.Amount >= 0;
}

public class InvoiceRepository 
{
    public void Save(Invoice invoice) 
    {
        using (var connection = new SqlConnection("...")) 
        {
            // Insert into DB
        }
    }
}

public class Logger 
{
    public void LogInfo(string message) 
    {
        File.AppendAllText("log.txt", message);
    }
}
```

</div>

</div>
