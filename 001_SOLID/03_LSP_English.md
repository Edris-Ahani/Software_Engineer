# Liskov Substitution Principle (LSP)

## What is it?
The Liskov Substitution Principle (LSP) is the 'L' in SOLID. It states that objects of a superclass should be replaceable with objects of its subclasses without breaking the application.

## History and Origin
Introduced by Barbara Liskov in a 1987 conference keynote address titled "Data abstraction and hierarchy".

## What Problems Does It Solve?
- **Unexpected Bugs**: When a subclass changes the fundamental behavior of the parent class, it leads to bugs in systems that rely on the parent class contract.
- **Type Checking Overhead**: Code that uses `typeof` or `instanceof` excessively to check which subclass it is dealing with usually violates LSP.

## When and Where to Use It?
Use LSP when designing class hierarchies and inheritance. If you create a subclass, make sure it strictly follows the contract of its parent. If a subclass cannot logically perform all actions of its parent, inheritance might be the wrong choice (consider Composition instead).

## Examples

### JavaScript (Node.js)

```javascript
// BAD: Penguin inherits from Bird but breaks the contract
class Bird {
    fly() {
        console.log("Flying in the sky");
    }
}

class Eagle extends Bird {}

class Penguin extends Bird {
    fly() {
        throw new Error("Penguins cannot fly!"); // Violates LSP!
    }
}

function letBirdFly(bird) {
    bird.fly();
}

letBirdFly(new Eagle()); // Works
letBirdFly(new Penguin()); // Crashes!
```

```javascript
// GOOD: Refactored to separate flying and non-flying birds
class Bird {
    // General bird properties
}

class FlyingBird extends Bird {
    fly() {
        console.log("Flying in the sky");
    }
}

class SwimmingBird extends Bird {
    swim() {
        console.log("Swimming in the water");
    }
}

class Eagle extends FlyingBird {}
class Penguin extends SwimmingBird {}

function letBirdFly(bird) {
    bird.fly();
}

letBirdFly(new Eagle()); // Works
// letBirdFly(new Penguin()); // Type error (or ignored), but doesn't crash unexpectedly
```

### TypeScript

```typescript
// GOOD: Refactored to separate flying and non-flying birds
class Bird {
    // General bird properties
}

interface IFlyable {
    fly(): void;
}

class FlyingBird extends Bird implements IFlyable {
    public fly(): void {
        console.log("Flying in the sky");
    }
}

class SwimmingBird extends Bird {
    public swim(): void {
        console.log("Swimming in the water");
    }
}

class Eagle extends FlyingBird {}
class Penguin extends SwimmingBird {}

function letBirdFly(bird: IFlyable): void {
    bird.fly();
}

letBirdFly(new Eagle()); // Works
// letBirdFly(new Penguin()); // Compile-time error, preventing unexpected crashes!
```

### C#

```csharp
// BAD: Square inherits from Rectangle but breaks mathematical properties
public class Rectangle 
{
    public virtual int Width { get; set; }
    public virtual int Height { get; set; }
    public int Area => Width * Height;
}

public class Square : Rectangle 
{
    public override int Width 
    {
        set { base.Width = value; base.Height = value; }
    }
    public override int Height 
    {
        set { base.Height = value; base.Width = value; }
    }
}

public class AreaTest 
{
    public void TestArea(Rectangle rect) 
    {
        rect.Width = 5;
        rect.Height = 10;
        // For a normal rectangle, Area should be 50. 
        // But if rect is a Square, changing Height to 10 also changes Width to 10. Area becomes 100!
        if (rect.Area != 50) throw new Exception("Bad Area!"); // Violates LSP!
    }
}
```

```csharp
// GOOD: Do not use inheritance when mathematical contracts are broken.
public abstract class Shape 
{
    public abstract int Area { get; }
}

public class Rectangle : Shape 
{
    public int Width { get; set; }
    public int Height { get; set; }
    public override int Area => Width * Height;
}

public class Square : Shape 
{
    public int Side { get; set; }
    public override int Area => Side * Side;
}
```
