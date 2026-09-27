# Prototype Pattern

## What is it?
Prototype is a Creational Design Pattern that lets you copy existing objects without making your code dependent on their classes.

## History and Origin
Introduced by the GoF (1994). It was created to address the cost and complexity of creating new objects from scratch when similar objects already exist in memory.

## What Problems Does It Solve?
- **High Instantiation Cost**: If an object takes a long time to create (e.g., requires database queries or network requests), cloning an existing cached object is much faster.
- **Dependency on Concrete Classes**: When you need to duplicate an object but its class is private or unknown (e.g., provided by a 3rd party API).

## When and Where to Use It?
Use Prototype when your code shouldn't depend on the concrete classes of objects that you need to copy. It's very common in JavaScript (since the language itself is Prototype-based) and in scenarios requiring configurations where a 'default' object is cloned and slightly modified.

## Examples

### JavaScript (Node.js)

```javascript
// In JavaScript, prototype cloning is natively supported
const vehiclePrototype = {
    wheels: 4,
    color: 'white',
    
    clone() {
        // Deep clone or shallow clone using Object.create or spread syntax
        return Object.create(this); 
    }
};

const car1 = vehiclePrototype.clone();
car1.color = 'red';

const car2 = vehiclePrototype.clone();
car2.color = 'blue';

console.log(car1.color); // red
console.log(car1.wheels); // 4 (inherited from prototype)
```

### TypeScript

```typescript
interface ICloneableShape {
    clone(): ICloneableShape;
}

class Rectangle implements ICloneableShape {
    constructor(public width: number, public height: number) {}

    public clone(): this {
        // Deep clone or shallow clone logic
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}

// Usage
const original = new Rectangle(10, 20);
const copy = original.clone();
copy.width = 50;

console.log(original.width); // 10
console.log(copy.width); // 50
```

### C#

```csharp
// The Prototype interface
public interface ICloneableShape
{
    ICloneableShape Clone();
}

public class Rectangle : ICloneableShape
{
    public int Width { get; set; }
    public int Height { get; set; }

    public Rectangle(int width, int height)
    {
        Width = width;
        Height = height;
    }

    // Implementing the Clone method
    public ICloneableShape Clone()
    {
        // MemberwiseClone creates a shallow copy. 
        // For deep copy, you would manually copy reference types.
        return (ICloneableShape)this.MemberwiseClone();
    }
}

// Usage
// Rectangle original = new Rectangle(10, 20);
// Rectangle copy = (Rectangle)original.Clone();
```
