<div dir="rtl">

# الگوی فاساد (Facade Pattern)

## این الگو چیست؟
الگوی فاساد (Facade به معنای نما یا ظاهر ساختمان) یک الگوی طراحی ساختاری است که یک اینترفیس ساده شده و سطح بالا برای یک زیرسیستم پیچیده، کتابخانه یا فریم‌ورک ارائه می‌دهد.

## تاریخچه و دلیل پیدایش
این الگو توسط گروه GoF در سال ۱۹۹۴ معرفی شد. نام آن از "نمای بیرونی" یک ساختمان گرفته شده است که سیم‌کشی‌ها و لوله‌کشی‌های پیچیده درون ساختمان را پنهان می‌کند. هدف این الگو این است که یک نقطه ورود آسان برای کتابخانه‌ها و زیرسیستم‌های بزرگ فراهم کند.

## چه مشکلاتی را برطرف می‌کند؟
- **پیچیدگی بالا**: کار با یک کتابخانه خارجی پیچیده نیازمند مقداردهی ده‌ها شیء، ردیابی وابستگی‌ها و اجرای متدها در ترتیب مشخصی است. فاساد همه این موارد را پنهان می‌کند.
- **وابستگی شدید (Tight Coupling)**: بدون این الگو، کدهای برنامه شما مستقیماً با جزئیات پیاده‌سازی کلاس‌های خارجی درگیر می‌شود، که تغییر و جایگزینی آن کتابخانه را در آینده دشوار می‌کند.

## کجا و چه زمانی باید از آن استفاده کرد؟
زمانی از الگوی فاساد استفاده کنید که می‌خواهید یک رابط (Interface) ساده و راحت برای یک زیرسیستم پیچیده ارائه دهید. این الگو به طور مکرر در یکپارچه‌سازی با کتابخانه‌های پردازش ویدیو/صدا، درگاه‌های پرداخت پیچیده، یا پنهان‌کردن کدهای قدیمی (Legacy) استفاده می‌شود.

## مثال‌ها

### زبان JavaScript

<div dir="ltr">

```javascript
// Complex Subsystem Parts
class VideoFile { constructor(name) { this.name = name; } }
class OggCompressionCodec { /* OGG Codec logic */ }
class MPEG4CompressionCodec { /* MP4 Codec logic */ }
class AudioMixer { fix(file) { console.log("Fixing audio..."); } }

// The Facade
class VideoConverterFacade {
    convert(filename, format) {
        const file = new VideoFile(filename);
        let codec;
        
        if (format === "mp4") codec = new MPEG4CompressionCodec();
        else codec = new OggCompressionCodec();
        
        console.log(`Converting ${file.name} to ${format} using Codec...`);
        new AudioMixer().fix(file);
        
        return "VideoFile(converted)";
    }
}

// Usage (Client only knows about the Facade)
const converter = new VideoConverterFacade();
converter.convert("funny-cats.mp4", "ogg");
```

</div>

### زبان TypeScript

<div dir="ltr">

```typescript
// Subsystems
class InventorySystem {
    public checkStock(itemId: string): boolean {
        console.log(`Checking stock for ${itemId}`);
        return true;
    }
}

class PaymentSystem {
    public processPayment(amount: number): boolean {
        console.log(`Processing payment of $${amount}`);
        return true;
    }
}

class ShippingSystem {
    public shipOrder(itemId: string): void {
        console.log(`Shipping item ${itemId} to customer.`);
    }
}

// Facade
class OrderFacade {
    private inventory = new InventorySystem();
    private payment = new PaymentSystem();
    private shipping = new ShippingSystem();

    public placeOrder(itemId: string, amount: number): void {
        if (this.inventory.checkStock(itemId)) {
            if (this.payment.processPayment(amount)) {
                this.shipping.shipOrder(itemId);
                console.log("Order placed successfully!");
            }
        }
    }
}

// Usage
const orderFacade = new OrderFacade();
orderFacade.placeOrder("LAPTOP-123", 1500);
```

</div>

### زبان C#

<div dir="ltr">

```csharp
using System;

// 1. Complex Subsystem
public class CPU 
{
    public void Freeze() { Console.WriteLine("CPU Freezing..."); }
    public void Jump(long position) { Console.WriteLine($"CPU Jumping to {position}..."); }
    public void Execute() { Console.WriteLine("CPU Executing..."); }
}

public class Memory 
{
    public void Load(long position, string data) { Console.WriteLine($"Memory loading data '{data}' to {position}..."); }
}

public class HardDrive 
{
    public string Read(long lba, int size) { return "HDD_DATA"; }
}

// 2. Facade
public class ComputerFacade 
{
    private CPU _cpu;
    private Memory _memory;
    private HardDrive _hardDrive;

    public ComputerFacade() 
    {
        _cpu = new CPU();
        _memory = new Memory();
        _hardDrive = new HardDrive();
    }

    public void Start() 
    {
        _cpu.Freeze();
        _memory.Load(0x00, _hardDrive.Read(0x00, 1024));
        _cpu.Jump(0x00);
        _cpu.Execute();
    }
}

// Usage
// ComputerFacade computer = new ComputerFacade();
// computer.Start();
```

</div>

</div>
