# Bridge Pattern

## What is it?
Bridge is a Structural Design Pattern that lets you split a large class or a set of closely related classes into two separate hierarchies—abstraction and implementation—which can be developed independently of each other.

## History and Origin
Introduced by the GoF (1994). It was created to prevent the explosion of subclasses that occurs when an entity has two independent dimensions of variation (e.g., Shape and Color).

## What Problems Does It Solve?
- **Class Explosion**: If you have a `Shape` class (Circle, Square) and you want to add `Color` (Red, Blue), you might end up creating `RedCircle`, `BlueCircle`, `RedSquare`, `BlueSquare`. Adding another shape or color multiplies the number of classes exponentially.
- **Tight Coupling**: Separates the high-level logic (Abstraction) from the platform-specific details (Implementation).

## When and Where to Use It?
Use the Bridge pattern when you want to divide and organize a monolithic class that has multiple variants of some functionality (like a UI component working with different operating systems, or rendering geometric shapes on different graphics APIs).

## Examples

### JavaScript

```javascript
// Implementation hierarchy
class VectorRenderer {
    renderCircle(radius) {
        console.log(`Drawing a vector circle of radius ${radius}`);
    }
}

class RasterRenderer {
    renderCircle(radius) {
        console.log(`Drawing pixels for a circle of radius ${radius}`);
    }
}

// Abstraction hierarchy
class Shape {
    constructor(renderer) {
        this.renderer = renderer;
    }
    draw() {}
}

class Circle extends Shape {
    constructor(renderer, radius) {
        super(renderer);
        this.radius = radius;
    }

    draw() {
        this.renderer.renderCircle(this.radius);
    }
}

// Usage
const raster = new RasterRenderer();
const circle = new Circle(raster, 5);
circle.draw();
```

### TypeScript

```typescript
// Implementation
interface Color {
    fill(): string;
}

class RedColor implements Color {
    fill(): string { return "Red"; }
}

class BlueColor implements Color {
    fill(): string { return "Blue"; }
}

// Abstraction
abstract class ColoredShape {
    protected color: Color;

    constructor(color: Color) {
        this.color = color;
    }

    abstract draw(): void;
}

class Square extends ColoredShape {
    draw(): void {
        console.log(`Drawing a ${this.color.fill()} square.`);
    }
}

// Usage
const red = new RedColor();
const redSquare = new Square(red);
redSquare.draw();
```

### C#

```csharp
// 1. Implementation
public interface IDevice 
{
    void TurnOn();
    void TurnOff();
    void SetChannel(int channel);
}

public class TvDevice : IDevice 
{
    public void TurnOn() => Console.WriteLine("TV turned on");
    public void TurnOff() => Console.WriteLine("TV turned off");
    public void SetChannel(int channel) => Console.WriteLine($"TV channel set to {channel}");
}

public class RadioDevice : IDevice 
{
    public void TurnOn() => Console.WriteLine("Radio turned on");
    public void TurnOff() => Console.WriteLine("Radio turned off");
    public void SetChannel(int channel) => Console.WriteLine($"Radio frequency set to {channel}");
}

// 2. Abstraction
public class RemoteControl 
{
    protected IDevice device;

    public RemoteControl(IDevice device) 
    {
        this.device = device;
    }

    public void TogglePower() 
    {
        Console.WriteLine("Remote: Power toggle");
        device.TurnOn();
    }
}

// Refined Abstraction
public class AdvancedRemoteControl : RemoteControl 
{
    public AdvancedRemoteControl(IDevice device) : base(device) { }

    public void Mute() 
    {
        Console.WriteLine("Remote: Muted");
    }
}

// 3. Client Usage
// IDevice tv = new TvDevice();
// RemoteControl remote = new RemoteControl(tv);
// remote.TogglePower();
```
