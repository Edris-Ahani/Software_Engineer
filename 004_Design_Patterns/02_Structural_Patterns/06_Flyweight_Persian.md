<div dir="rtl">

# الگوی مگس‌وزن (Flyweight Pattern)

## این الگو چیست؟
الگوی مگس‌وزن (Flyweight) یک الگوی طراحی ساختاری (Structural) است که به شما اجازه می‌دهد تعداد بسیار زیادی از اشیاء را در مقدار محدودی از حافظه RAM جای دهید. این کار با به اشتراک گذاشتن بخش‌های مشترک بین چندین شیء، به جای ذخیره همه داده‌ها در هر شیء به صورت جداگانه، انجام می‌شود.

## تاریخچه و دلیل پیدایش
توسط گروه GoF در سال ۱۹۹۴ معرفی شد. نام "مگس‌وزن" از رشته بوکس (کلاس وزنی بسیار سبک) گرفته شده است و نماد "سبک بودن" اشیایی است که این الگو سعی در ایجاد آن‌ها دارد.

## چه مشکلاتی را برطرف می‌کند؟
- **مصرف بالای حافظه (RAM)**: زمانی که شما هزاران یا میلیون‌ها شیء ایجاد می‌کنید (مانند درختان در یک جنگل در بازی، یا گلوله‌های شلیک شده)، برنامه ممکن است به دلیل کمبود حافظه کرش کند زیرا هر شیء داده‌های مشابهی (مانند بافت‌ها یا مدل‌های سه‌بعدی) را به صورت تکراری ذخیره می‌کند.

## کجا و چه زمانی باید از آن استفاده کرد؟
از این الگو فقط زمانی استفاده کنید که برنامه شما باید تعداد عظیمی از اشیاء را پشتیبانی کند که به سختی در RAM جا می‌شوند. این الگو وضعیت (State) یک شیء را به دو بخش تقسیم می‌کند: **وضعیت ذاتی یا Intrinsic** (داده‌های مشترک و غیرقابل تغییر) و **وضعیت بیرونی یا Extrinsic** (داده‌های متغیر و مختص به بستر که در زمان اجرا ارسال می‌شوند).

## مثال‌ها

### زبان JavaScript

<div dir="ltr">

```javascript
// Flyweight (Intrinsic State: shared data like texture and color)
class TreeType {
    constructor(name, color, texture) {
        this.name = name;
        this.color = color;
        this.texture = texture;
    }
    
    draw(canvas, x, y) {
        console.log(`Drawing ${this.name} tree of color ${this.color} at (${x}, ${y})`);
    }
}

// Flyweight Factory (Manages caching and sharing of TreeTypes)
class TreeFactory {
    static treeTypes = {};

    static getTreeType(name, color, texture) {
        const key = `${name}_${color}_${texture}`;
        if (!this.treeTypes[key]) {
            console.log(`Creating new TreeType: ${name}`);
            this.treeTypes[key] = new TreeType(name, color, texture);
        }
        return this.treeTypes[key];
    }
}

// Context (Extrinsic State: unique data like X and Y coordinates)
class Tree {
    constructor(x, y, treeType) {
        this.x = x;
        this.y = y;
        this.treeType = treeType;
    }

    draw(canvas) {
        this.treeType.draw(canvas, this.x, this.y);
    }
}

// Usage
const type1 = TreeFactory.getTreeType("Oak", "Green", "OakTexture.png");
const tree1 = new Tree(10, 20, type1);
tree1.draw("Canvas1");

const type2 = TreeFactory.getTreeType("Oak", "Green", "OakTexture.png"); // Reuses type1
const tree2 = new Tree(50, 60, type2);
tree2.draw("Canvas1");
```

</div>

### زبان TypeScript

<div dir="ltr">

```typescript
// Flyweight
class CharacterFormat {
    constructor(
        public readonly font: string, 
        public readonly size: number, 
        public readonly color: string
    ) {}
}

// Flyweight Factory
class CharacterFormatFactory {
    private formats: Map<string, CharacterFormat> = new Map();

    public getFormat(font: string, size: number, color: string): CharacterFormat {
        const key = `${font}_${size}_${color}`;
        if (!this.formats.has(key)) {
            console.log(`Caching new format: ${key}`);
            this.formats.set(key, new CharacterFormat(font, size, color));
        }
        return this.formats.get(key)!;
    }
}

// Context (Extrinsic)
class Character {
    constructor(
        public readonly char: string,
        public readonly format: CharacterFormat,
        public readonly x: number,
        public readonly y: number
    ) {}

    public render(): void {
        console.log(`Rendering '${this.char}' at (${this.x}, ${this.y}) with ${this.format.font}`);
    }
}

// Usage
const factory = new CharacterFormatFactory();
const format1 = factory.getFormat("Arial", 12, "Black");
const charA = new Character("A", format1, 0, 0);

const format2 = factory.getFormat("Arial", 12, "Black"); // Reuses format1
const charB = new Character("B", format2, 10, 0);

charA.render();
charB.render();
```

</div>

### زبان C#

<div dir="ltr">

```csharp
using System;
using System.Collections.Generic;

// 1. Flyweight
public class ParticleType 
{
    public string Color { get; }
    public string Sprite { get; }

    public ParticleType(string color, string sprite) 
    {
        Color = color;
        Sprite = sprite;
    }

    public void Draw(int x, int y) 
    {
        Console.WriteLine($"Drawing particle {Sprite} ({Color}) at {x}, {y}");
    }
}

// 2. Factory
public class ParticleFactory 
{
    private Dictionary<string, ParticleType> _particleTypes = new Dictionary<string, ParticleType>();

    public ParticleType GetParticleType(string color, string sprite) 
    {
        string key = color + "_" + sprite;
        if (!_particleTypes.ContainsKey(key)) 
        {
            Console.WriteLine($"[Factory] Creating new particle type: {key}");
            _particleTypes[key] = new ParticleType(color, sprite);
        }
        return _particleTypes[key];
    }
}

// 3. Context
public class Particle 
{
    public int X { get; set; }
    public int Y { get; set; }
    private ParticleType _type;

    public Particle(int x, int y, ParticleType type) 
    {
        X = x;
        Y = y;
        _type = type;
    }

    public void Draw() 
    {
        _type.Draw(X, Y);
    }
}

// Usage
// var factory = new ParticleFactory();
// var redType = factory.GetParticleType("Red", "Spark.png");
// var p1 = new Particle(10, 10, redType);
// var p2 = new Particle(20, 20, redType); // Uses the cached RedType
// p1.Draw();
// p2.Draw();
```

</div>

</div>
