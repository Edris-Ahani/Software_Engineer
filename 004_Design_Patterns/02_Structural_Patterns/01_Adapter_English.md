# Adapter Pattern

## What is it?
Adapter is a Structural Design Pattern that allows objects with incompatible interfaces to collaborate. It acts as a wrapper between two objects, catching calls for one object and transforming them to format and interface recognizable by the second object.

## History and Origin
Introduced by the GoF (1994). It mirrors real-world adapters (like a power plug adapter) that allow you to connect a device to a power outlet of a different standard.

## What Problems Does It Solve?
- **Incompatible Interfaces**: When you want to use an existing class, but its interface doesn't match the one you need.
- **Legacy Code Integration**: When introducing a new 3rd-party library or refactoring a modern system, but you still need to communicate with a legacy system that has an outdated interface.

## When and Where to Use It?
Use the Adapter class when you want to use an existing class, but its interface isn't compatible with the rest of your code. It's extremely common when working with external APIs, SDKs, or legacy systems.

## Examples

### JavaScript

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

### TypeScript

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

### C#

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
