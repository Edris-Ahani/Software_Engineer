# Composite Pattern

## What is it?
Composite is a Structural Design Pattern that lets you compose objects into tree structures to represent part-whole hierarchies. It allows clients to treat individual objects and compositions of objects uniformly.

## History and Origin
Introduced by the GoF (1994). It was designed to solve the problem of handling complex tree-like structures (such as file systems or UI components) where a container (folder) and its contents (files) share a common interface.

## What Problems Does It Solve?
- **Handling Tree Structures**: Instead of writing `if (isContainer) { ... } else { ... }`, the client code interacts with a single unified interface.
- **Complexity of recursive logic**: It delegates the recursive logic down the tree structure effortlessly.

## When and Where to Use It?
Use it when you need to represent a part-whole hierarchy (trees, folders/files, organizations/employees, UI widgets containing other widgets) and you want the client to treat both simple and complex elements exactly the same way.

## Examples

### JavaScript (Node.js)

```javascript
// Component Interface
class Graphic {
    draw() {}
}

// Leaf
class Dot extends Graphic {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }
    draw() {
        console.log(`Drawing a dot at (${this.x}, ${this.y})`);
    }
}

// Composite (Container)
class CompoundGraphic extends Graphic {
    constructor() {
        super();
        this.children = [];
    }

    add(child) {
        this.children.push(child);
    }

    remove(child) {
        this.children = this.children.filter(c => c !== child);
    }

    draw() {
        console.log("Drawing CompoundGraphic containing:");
        for (const child of this.children) {
            child.draw();
        }
    }
}

// Usage
const compound = new CompoundGraphic();
compound.add(new Dot(1, 2));
compound.add(new Dot(3, 6));

const mainComposite = new CompoundGraphic();
mainComposite.add(compound);
mainComposite.add(new Dot(10, 10));

mainComposite.draw();
```

### TypeScript

```typescript
// Component Interface
interface IGraphic {
    draw(): void;
}

// Leaf
class Circle implements IGraphic {
    constructor(private radius: number) {}

    public draw(): void {
        console.log(`Drawing a Circle with radius ${this.radius}`);
    }
}

// Composite
class GraphicGroup implements IGraphic {
    private graphics: IGraphic[] = [];

    public add(graphic: IGraphic): void {
        this.graphics.push(graphic);
    }

    public draw(): void {
        console.log("--- Group Start ---");
        for (const graphic of this.graphics) {
            graphic.draw(); // Recursive call
        }
        console.log("--- Group End ---");
    }
}

// Usage
const group1 = new GraphicGroup();
group1.add(new Circle(5));
group1.add(new Circle(10));

const mainGroup = new GraphicGroup();
mainGroup.add(group1);
mainGroup.add(new Circle(20));

mainGroup.draw();
```

### C#

```csharp
using System;
using System.Collections.Generic;

// 1. Component
public abstract class FileSystemItem 
{
    public string Name { get; set; }
    public FileSystemItem(string name) 
    {
        Name = name;
    }
    public abstract void Display(int depth);
}

// 2. Leaf
public class FileItem : FileSystemItem 
{
    public FileItem(string name) : base(name) { }
    
    public override void Display(int depth) 
    {
        Console.WriteLine(new String('-', depth) + Name);
    }
}

// 3. Composite
public class DirectoryItem : FileSystemItem 
{
    private List<FileSystemItem> _children = new List<FileSystemItem>();

    public DirectoryItem(string name) : base(name) { }

    public void Add(FileSystemItem component) 
    {
        _children.Add(component);
    }

    public override void Display(int depth) 
    {
        Console.WriteLine(new String('-', depth) + Name);
        foreach (var component in _children) 
        {
            component.Display(depth + 2);
        }
    }
}

// Usage
// DirectoryItem root = new DirectoryItem("root");
// root.Add(new FileItem("readme.txt"));
// DirectoryItem bin = new DirectoryItem("bin");
// bin.Add(new FileItem("app.exe"));
// root.Add(bin);
// root.Display(1);
```
