# Facade Pattern

## What is it?
Facade is a Structural Design Pattern that provides a simplified, higher-level interface to a complex subsystem of classes, library, or framework.

## History and Origin
Introduced by the GoF (1994). Named after the facade (front exterior) of a building, which masks the complex wiring and plumbing inside. It helps organize large libraries by providing an easy entry point.

## What Problems Does It Solve?
- **High Complexity**: Working with a complex third-party library requires initializing many objects, keeping track of dependencies, and executing methods in the correct order.
- **Tight Coupling**: Code becomes tightly coupled to the implementation details of third-party classes, making it hard to maintain or replace the library.

## When and Where to Use It?
Use the Facade pattern when you want to provide a simple, easy-to-use interface to a complex subsystem. It's often used when integrating video/audio processing libraries, complex payment gateways, or wrapping legacy code APIs.

## Examples

### JavaScript (Node.js)

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

### TypeScript

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

### C#

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
