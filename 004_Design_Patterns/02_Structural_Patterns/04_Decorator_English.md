# Decorator Pattern

## What is it?
Decorator is a Structural Design Pattern that lets you attach new behaviors to objects dynamically by placing these objects inside special wrapper objects that contain the behaviors.

## History and Origin
Introduced by the GoF (1994). It was created as an alternative to subclassing. Subclassing is static (done at compile time), whereas Decorator allows adding functionality at runtime dynamically.

## What Problems Does It Solve?
- **Subclass Explosion**: If you have a `Notifier` class and you want to add SMS, Facebook, and Slack notifications, creating subclasses like `SMSAndFacebookNotifier`, `SlackAndSMSNotifier` leads to hundreds of subclasses.
- **Static Inheritance Limitations**: Inheritance doesn't allow changing object behavior at runtime, and multiple inheritance is not supported in many languages.

## When and Where to Use It?
Use the Decorator pattern when you need to assign extra behaviors to objects at runtime without breaking the code that uses these objects. It's heavily used in streams (like Java/C# I/O Streams) and when applying middlewares/interceptors in web frameworks.

## Examples

### JavaScript (Node.js)

```javascript
// Component Interface
class Notifier {
    send(message) {}
}

// Concrete Component
class EmailNotifier extends Notifier {
    send(message) {
        console.log(`Sending Email: ${message}`);
    }
}

// Base Decorator
class NotifierDecorator extends Notifier {
    constructor(wrappee) {
        super();
        this.wrappee = wrappee;
    }
    send(message) {
        this.wrappee.send(message);
    }
}

// Concrete Decorator
class SMSDecorator extends NotifierDecorator {
    send(message) {
        super.send(message); // Call wrapped object
        console.log(`Sending SMS: ${message}`); // Add new behavior
    }
}

// Usage
const emailNotifier = new EmailNotifier();
const smsAndEmailNotifier = new SMSDecorator(emailNotifier);
smsAndEmailNotifier.send("Hello World!"); 
// Outputs: Sending Email: Hello World! \n Sending SMS: Hello World!
```

### TypeScript

```typescript
interface ICoffee {
    getCost(): number;
    getDescription(): string;
}

class SimpleCoffee implements ICoffee {
    public getCost(): number { return 10; }
    public getDescription(): string { return "Simple Coffee"; }
}

// Base Decorator
abstract class CoffeeDecorator implements ICoffee {
    protected decoratedCoffee: ICoffee;

    constructor(coffee: ICoffee) {
        this.decoratedCoffee = coffee;
    }

    public getCost(): number {
        return this.decoratedCoffee.getCost();
    }

    public getDescription(): string {
        return this.decoratedCoffee.getDescription();
    }
}

// Concrete Decorator
class MilkDecorator extends CoffeeDecorator {
    public getCost(): number {
        return super.getCost() + 2;
    }
    public getDescription(): string {
        return super.getDescription() + ", Milk";
    }
}

// Usage
let myCoffee: ICoffee = new SimpleCoffee();
myCoffee = new MilkDecorator(myCoffee);
console.log(`${myCoffee.getDescription()} costs $${myCoffee.getCost()}`);
```

### C#

```csharp
using System;

// 1. Component Interface
public interface IDataSource 
{
    void WriteData(string data);
}

// 2. Concrete Component
public class FileDataSource : IDataSource 
{
    public void WriteData(string data) 
    {
        Console.WriteLine($"Writing '{data}' to file.");
    }
}

// 3. Base Decorator
public abstract class DataSourceDecorator : IDataSource 
{
    protected IDataSource wrappee;
    
    public DataSourceDecorator(IDataSource source) 
    {
        wrappee = source;
    }
    
    public virtual void WriteData(string data) 
    {
        wrappee.WriteData(data);
    }
}

// 4. Concrete Decorators
public class EncryptionDecorator : DataSourceDecorator 
{
    public EncryptionDecorator(IDataSource source) : base(source) { }
    
    public override void WriteData(string data) 
    {
        string encryptedData = $"[Encrypted]{data}[/Encrypted]";
        base.WriteData(encryptedData);
    }
}

// Usage
// IDataSource source = new FileDataSource();
// source = new EncryptionDecorator(source);
// source.WriteData("Sensitive Data");
```
