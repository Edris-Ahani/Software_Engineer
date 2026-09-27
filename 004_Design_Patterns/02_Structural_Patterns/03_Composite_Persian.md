<div dir="rtl">

# الگوی کامپوزیت (Composite Pattern)

## این الگو چیست؟
الگوی کامپوزیت (یا ترکیب) یک الگوی طراحی ساختاری (Structural) است که به شما اجازه می‌دهد اشیاء را در قالب ساختارهای درختی (Tree Structures) ترکیب کنید تا سلسله‌مراتب جزء-کل (Part-Whole) را به نمایش بگذارید. این الگو به کلاینت (کد مصرف‌کننده) اجازه می‌دهد با اشیاء فردی و ترکیبی از اشیاء به صورت کاملاً یکسان رفتار کند.

## تاریخچه و دلیل پیدایش
این الگو توسط گروه GoF در سال ۱۹۹۴ معرفی شد. هدف از طراحی آن حل مشکل پیچیدگی کار با ساختارهای درختی (مانند سیستم‌فایل‌ها یا کامپوننت‌های رابط کاربری) بود که در آن‌ها یک "محفظه" (Container/Folder) و "محتویات درون آن" (Leaf/Files) باید دارای یک اینترفیس مشترک باشند تا کار با آن‌ها آسان شود.

## چه مشکلاتی را برطرف می‌کند؟
- **مدیریت ساختارهای درختی**: به جای نوشتن شروط پیچیده مانند `if (isContainer) { ... } else { ... }`، کد مصرف‌کننده فقط یک اینترفیس واحد و یکپارچه را صدا می‌زند.
- **پیچیدگی منطق بازگشتی**: این الگو عملیات بازگشتی (Recursive) را در طول ساختار درختی به سادگی کنترل و هدایت می‌کند.

## کجا و چه زمانی باید از آن استفاده کرد؟
زمانی از این الگو استفاده کنید که نیاز دارید یک ساختار جزء-کل (درخت‌ها، پوشه‌ها/فایل‌ها، سازمان‌ها/کارمندان، ویجت‌های UI که حاوی ویجت‌های دیگر هستند) را پیاده‌سازی کنید و می‌خواهید کلاینت بدون نیاز به دانستن نوع دقیق شیء، با عناصر ساده و پیچیده دقیقاً به یک شکل کار کند.

## مثال‌ها

### زبان JavaScript

<div dir="ltr">

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

</div>

### زبان TypeScript

<div dir="ltr">

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

</div>

### زبان C#

<div dir="ltr">

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

</div>

</div>
