# Factory Method Pattern

## What is it?
Factory Method is a Creational Design Pattern that provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.

## History and Origin
Introduced by the GoF in 1994. It emerged from the need to decouple the framework/library code from the actual business objects it needs to instantiate.

## What Problems Does It Solve?
- **Tight Coupling to Concrete Classes**: Using the `new` keyword hardcodes the exact class being instantiated. Factory Method decouples object creation from object usage.
- **Single Responsibility Principle Violation**: If a class does its main job AND contains complex logic to instantiate other objects, it does too much. Factory method delegates this creation.

## When and Where to Use It?
Use the Factory Method when you don't know beforehand the exact types and dependencies of the objects your code should work with. It's heavily used in UI frameworks (e.g., creating cross-platform buttons) and data access layers.

## Examples

### JavaScript (Node.js)

```javascript
// Product Interface (Conceptual)
class Transport {
    deliver() {}
}

class Truck extends Transport {
    deliver() {
        console.log("Delivering cargo by land in a box.");
    }
}

class Ship extends Transport {
    deliver() {
        console.log("Delivering cargo by sea in a container.");
    }
}

// Factory (Creator)
class Logistics {
    // The Factory Method
    createTransport() {
        throw new Error("This method must be overridden!");
    }

    planDelivery() {
        const transport = this.createTransport();
        transport.deliver();
    }
}

class RoadLogistics extends Logistics {
    createTransport() {
        return new Truck();
    }
}

class SeaLogistics extends Logistics {
    createTransport() {
        return new Ship();
    }
}

// Usage
const logistics = new RoadLogistics();
logistics.planDelivery(); // Delivering cargo by land...
```

### TypeScript

```typescript
// Product Interface
interface ITransport {
    deliver(): void;
}

class Truck implements ITransport {
    public deliver(): void {
        console.log("Delivering cargo by land in a box.");
    }
}

class Ship implements ITransport {
    public deliver(): void {
        console.log("Delivering cargo by sea in a container.");
    }
}

// Factory (Creator)
abstract class Logistics {
    // The Factory Method
    public abstract createTransport(): ITransport;

    public planDelivery(): void {
        const transport = this.createTransport();
        transport.deliver();
    }
}

class RoadLogistics extends Logistics {
    public createTransport(): ITransport {
        return new Truck();
    }
}

class SeaLogistics extends Logistics {
    public createTransport(): ITransport {
        return new Ship();
    }
}

// Usage
const logistics: Logistics = new RoadLogistics();
logistics.planDelivery(); // Delivering cargo by land...
```

### C#

```csharp
// 1. The Product Interface
public interface IButton
{
    void Render();
    void OnClick();
}

// 2. Concrete Products
public class WindowsButton : IButton
{
    public void Render() => Console.WriteLine("Rendering Windows Button");
    public void OnClick() => Console.WriteLine("Windows Button Clicked");
}

public class HtmlButton : IButton
{
    public void Render() => Console.WriteLine("Rendering HTML Button");
    public void OnClick() => Console.WriteLine("HTML Button Clicked");
}

// 3. The Creator
public abstract class Dialog
{
    // The Factory Method
    public abstract IButton CreateButton();

    public void RenderWindow()
    {
        IButton okButton = CreateButton();
        okButton.Render();
    }
}

// 4. Concrete Creators
public class WindowsDialog : Dialog
{
    public override IButton CreateButton() => new WindowsButton();
}

public class WebDialog : Dialog
{
    public override IButton CreateButton() => new HtmlButton();
}
```
