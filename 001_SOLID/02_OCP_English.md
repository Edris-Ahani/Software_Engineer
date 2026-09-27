# Open/Closed Principle (OCP)

## What is it?
The Open/Closed Principle (OCP) is the 'O' in SOLID. It states that software entities (classes, modules, functions, etc.) should be **open for extension, but closed for modification**. This means you should be able to add new functionality without changing existing code.

## History and Origin
Introduced by Bertrand Meyer in 1988 in his book "Object-Oriented Software Construction". The goal was to prevent introducing bugs into existing, tested, and working code when adding new features.

## What Problems Does It Solve?
- **Fragile Code**: Modifying existing code to add features often breaks existing functionality.
- **Extensive Rewriting**: Without OCP, adding a new type or behavior requires finding every `if` or `switch` statement in the codebase and modifying it.
- **Testing Overhead**: If you change an existing class, you have to re-test all its previous behaviors.

## When and Where to Use It?
Use OCP when you have business rules or algorithms that have multiple variations (e.g., payment methods, notification types, export formats). Use interfaces, abstract classes, or higher-order functions to allow injecting new behaviors.

## Examples

### JavaScript (Node.js)
```javascript
// BAD: Needs modification every time a new payment method is added
class PaymentProcessor {
    processPayment(paymentType, amount) {
        if (paymentType === 'creditCard') {
            console.log(`Processing credit card payment of $${amount}`);
        } else if (paymentType === 'paypal') {
            console.log(`Processing PayPal payment of $${amount}`);
        }
        // Changing this file for a new method violates OCP!
    }
}

// GOOD: Closed for modification, Open for extension
class CreditCardPayment {
    process(amount) {
        console.log(`Processing credit card payment of $${amount}`);
    }
}

class PayPalPayment {
    process(amount) {
        console.log(`Processing PayPal payment of $${amount}`);
    }
}

class PaymentProcessor {
    // We can pass any new payment class here without changing this method
    processPayment(paymentMethod, amount) {
        paymentMethod.process(amount);
    }
}
```

### TypeScript

```typescript
// GOOD: Closed for modification, Open for extension
interface IPaymentMethod {
    process(amount: number): void;
}

class CreditCardPayment implements IPaymentMethod {
    public process(amount: number): void {
        console.log(`Processing credit card payment of ${amount}`);
    }
}

class PayPalPayment implements IPaymentMethod {
    public process(amount: number): void {
        console.log(`Processing PayPal payment of ${amount}`);
    }
}

class PaymentProcessor {
    // We can pass any new payment class here without changing this method
    public processPayment(paymentMethod: IPaymentMethod, amount: number): void {
        paymentMethod.process(amount);
    }
}
```

### C#
```csharp
// BAD: Modifying the class for new shapes
public class AreaCalculator 
{
    public double CalculateArea(object[] shapes) 
    {
        double area = 0;
        foreach (var shape in shapes) 
        {
            if (shape is Rectangle r) 
                area += r.Width * r.Height;
            else if (shape is Circle c) 
                area += Math.PI * c.Radius * c.Radius;
            // Adding a Triangle requires changing this class
        }
        return area;
    }
}

// GOOD: Using Polymorphism to satisfy OCP
public abstract class Shape 
{
    public abstract double CalculateArea();
}

public class Rectangle : Shape 
{
    public double Width { get; set; }
    public double Height { get; set; }
    public override double CalculateArea() => Width * Height;
}

public class Circle : Shape 
{
    public double Radius { get; set; }
    public override double CalculateArea() => Math.PI * Radius * Radius;
}

public class AreaCalculator 
{
    public double CalculateArea(Shape[] shapes) 
    {
        double area = 0;
        // This code never changes, even if we add 100 new shapes
        foreach (var shape in shapes) 
        {
            area += shape.CalculateArea();
        }
        return area;
    }
}
```
