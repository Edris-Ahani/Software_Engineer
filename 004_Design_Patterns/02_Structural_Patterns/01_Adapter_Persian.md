<div dir="rtl">

# الگوی آداپتور (Adapter Pattern)

## این الگو چیست؟
الگوی آداپتور (یا مبدل) یک الگوی طراحی ساختاری (Structural) است که به اشیاء با اینترفیس‌های ناسازگار اجازه می‌دهد با یکدیگر همکاری کنند. این الگو به عنوان یک لایه میانی (Wrapper) عمل می‌کند، تماس‌های یک شیء را دریافت کرده و آن‌ها را به فرمت و اینترفیس قابل درک برای شیء دوم تبدیل می‌کند.

## تاریخچه و دلیل پیدایش
توسط GoF در سال ۱۹۹۴ معرفی شد. ایده آن دقیقاً مشابه آداپتورهای دنیای واقعی (مثل مبدل دوشاخه برق) است که به شما اجازه می‌دهد دستگاهی را به پریز برقی با استاندارد متفاوت متصل کنید.

## چه مشکلاتی را برطرف می‌کند؟
- **اینترفیس‌های ناسازگار**: زمانی که می‌خواهید از یک کلاس موجود استفاده کنید اما اینترفیس آن با چیزی که نیاز دارید مطابقت ندارد.
- **ادغام کدهای قدیمی (Legacy Code)**: هنگام اضافه کردن یک کتابخانه جدید یا بازنویسی یک سیستم مدرن که همچنان باید با یک سیستم قدیمی با اینترفیس منسوخ ارتباط برقرار کند.

## کجا و چه زمانی باید از آن استفاده کرد؟
زمانی از این الگو استفاده کنید که کلاسی دارید که می‌خواهید از آن استفاده کنید اما رابط (Interface) آن با بقیه کدهای شما سازگار نیست. استفاده از این الگو در هنگام کار با APIهای خارجی، SDKها و سیستم‌های قدیمی بسیار رایج است.

## مثال‌ها

### زبان JavaScript

<div dir="ltr">

```javascript
// Legacy System
class OldCalculator {
    operations(t1, t2, operation) {
        switch (operation) {
            case 'add': return t1 + t2;
            case 'sub': return t1 - t2;
            default: return NaN;
        }
    }
}

// Modern System Interface (What the client expects)
class NewCalculator {
    add(t1, t2) {}
    sub(t1, t2) {}
}

// The Adapter
class CalculatorAdapter extends NewCalculator {
    constructor() {
        super();
        this.oldCalc = new OldCalculator();
    }

    add(t1, t2) {
        return this.oldCalc.operations(t1, t2, 'add');
    }

    sub(t1, t2) {
        return this.oldCalc.operations(t1, t2, 'sub');
    }
}

// Client
const calculator = new CalculatorAdapter();
console.log(calculator.add(10, 5)); // 15
```

</div>

### زبان TypeScript

<div dir="ltr">

```typescript
// Legacy Interface
class OldPaymentGateway {
    public processOldPayment(amount: number, currency: string): void {
        console.log(`Processing ${amount} ${currency} using old gateway.`);
    }
}

// Modern Expected Interface
interface INewPaymentProcessor {
    pay(dollars: number): void;
}

// Adapter
class PaymentAdapter implements INewPaymentProcessor {
    private legacyGateway: OldPaymentGateway;

    constructor(legacyGateway: OldPaymentGateway) {
        this.legacyGateway = legacyGateway;
    }

    public pay(dollars: number): void {
        // Adapting the interface
        this.legacyGateway.processOldPayment(dollars, "USD");
    }
}

// Client
const oldGateway = new OldPaymentGateway();
const processor: INewPaymentProcessor = new PaymentAdapter(oldGateway);
processor.pay(100);
```

</div>

### زبان C#

<div dir="ltr">

```csharp
// 1. Existing Incompatible Class (Adaptee)
public class LegacyPrinter 
{
    public void PrintDocumentInUppercase(string text) 
    {
        Console.WriteLine(text.ToUpper());
    }
}

// 2. Expected Interface (Target)
public interface IModernPrinter 
{
    void Print(string text);
}

// 3. Adapter
public class PrinterAdapter : IModernPrinter 
{
    private readonly LegacyPrinter _legacyPrinter;

    public PrinterAdapter(LegacyPrinter legacyPrinter) 
    {
        _legacyPrinter = legacyPrinter;
    }

    public void Print(string text) 
    {
        // Adapting the call
        _legacyPrinter.PrintDocumentInUppercase(text);
    }
}

// 4. Client Usage
// LegacyPrinter oldPrinter = new LegacyPrinter();
// IModernPrinter printer = new PrinterAdapter(oldPrinter);
// printer.Print("Hello World"); // Outputs: HELLO WORLD
```

</div>

</div>
