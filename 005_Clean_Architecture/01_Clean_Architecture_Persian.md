<div dir="rtl">

# معماری تمیز (Clean Architecture)

## چیست؟
معماری تمیز یک فلسفه طراحی نرم‌افزار است که توسط رابرت سی. مارتین (عمو باب) معرفی شده است. هدف آن جداسازی دغدغه‌های یک برنامه نرم‌افزاری با تقسیم آن به لایه‌های مختلف است. اصل کلیدی آن «قانون وابستگی» (Dependency Rule) است: وابستگی‌ها باید به سمت داخل و به سوی قوانین تجاری (Business Rules) اشاره کنند.

## تاریخچه و منشأ
در سال ۲۰۱۲ توسط رابرت سی. مارتین معرفی شد. این معماری ایده‌هایی از معماری شش‌ضلعی (Hexagonal Architecture)، معماری پیازی (Onion Architecture) و دیگر معماری‌ها را در یک ساختار منسجم ترکیب می‌کند.

## چه مشکلاتی را حل می‌کند؟
- **استقلال از فریم‌ورک**: این معماری به وجود کتابخانه‌ها یا فریم‌ورک‌ها وابسته نیست. این ویژگی به شما اجازه می‌دهد از فریم‌ورک‌ها به عنوان ابزار استفاده کنید، نه اینکه سیستم خود را در محدودیت‌های آن‌ها گرفتار کنید.
- **قابلیت تست (Testability)**: قوانین تجاری می‌توانند بدون نیاز به رابط کاربری، پایگاه داده، سرور وب یا هر عنصر خارجی دیگری تست شوند.
- **استقلال رابط کاربری (UI)**: رابط کاربری می‌تواند به راحتی و بدون تغییر بقیه سیستم تغییر کند.
- **استقلال پایگاه داده**: شما می‌توانید پایگاه داده SQL را با NoSQL، Mongo و غیره جایگزین کنید. قوانین تجاری شما به پایگاه داده محدود نمی‌شوند.

## چه زمانی و کجا از آن استفاده کنیم؟
از معماری تمیز برای برنامه‌های سازمانی پیچیده و با طول عمر بالا استفاده کنید، جایی که قابلیت نگهداری، قابلیت تست و انعطاف‌پذیری در برابر فناوری‌های جدید (مانند تغییر پایگاه داده یا رابط کاربری) حیاتی است.

## مثال‌ها

### TypeScript / Node.js
```typescript
// 1. Domain Entities (Innermost layer)
class User {
    constructor(public id: string, public name: string, public email: string) {}
}

// 2. Use Cases (Application logic)
interface UserRepository {
    save(user: User): Promise<void>;
    findByEmail(email: string): Promise<User | null>;
}

class RegisterUserUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(name: string, email: string): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error("User already exists");
        }
        const user = new User(Date.now().toString(), name, email);
        await this.userRepository.save(user);
        return user;
    }
}

// 3. Interface Adapters (Controllers, Gateways)
class UserController {
    constructor(private registerUserUseCase: RegisterUserUseCase) {}

    async register(req: any, res: any) {
        try {
            const user = await this.registerUserUseCase.execute(req.body.name, req.body.email);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

// 4. Frameworks and Drivers (Outermost layer)
// e.g., Express.js setup, PostgreSQL implementation of UserRepository
```
</div>
