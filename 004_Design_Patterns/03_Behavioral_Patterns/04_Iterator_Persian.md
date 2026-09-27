<div dir="rtl">

# الگوی تکرارکننده (Iterator Pattern)

## این الگو چیست؟
الگوی تکرارکننده (Iterator) یک الگوی طراحی رفتاری است که به شما اجازه می‌دهد بدون افشای ساختار داخلی یک مجموعه (مانند لیست، پشته، درخت و ...)، عناصر آن را یکی یکی پیمایش کنید.

## تاریخچه و دلیل پیدایش
این الگو توسط گروه GoF در سال ۱۹۹۴ معرفی شد. پیمایش روی مجموعه‌ها یکی از رایج‌ترین کارهای برنامه‌نویسی است. این الگو مکانیزم پیمایش را از خود مجموعه (Collection) جدا کرده و انتزاعی می‌کند.

## چه مشکلاتی را برطرف می‌کند؟
- **افشای ساختار داخلی**: اگر یک مجموعه ساختار داخلی خود را تغییر دهد (مثلاً از آرایه به درخت)، تمام کدهای کلاینت که روی آن پیمایش می‌کردند می‌شکنند. این الگو این وابستگی را از بین می‌برد.
- **پیچیدگی منطق پیمایش**: قرار دادن منطق‌های مختلف پیمایش در داخل خود مجموعه، کلاس را متورم کرده و اصل مسئولیت واحد (SRP) را نقض می‌کند.

## کجا و چه زمانی باید از آن استفاده کرد؟
زمانی از این الگو استفاده کنید که مجموعه شما ساختار داده‌ای پیچیده‌ای در پس‌زمینه دارد، اما می‌خواهید این پیچیدگی را از دید کلاینت پنهان کنید. این الگو امروزه در تقریباً تمام زبان‌های مدرن به صورت استاندارد پیاده‌سازی شده است (مانند `IEnumerable` در سی‌شارپ و پروتکل‌های `Iterable` در جاوااسکریپت و تایپ‌اسکریپت).

## مثال‌ها

### زبان JavaScript

<div dir="ltr">

```javascript
// Iterable Collection
class NumberCollection {
    constructor() {
        this.items = [];
    }
    push(item) { this.items.push(item); }
    
    // JS native implementation of Iterator
    [Symbol.iterator]() {
        let index = 0;
        let items = this.items;
        return {
            next() {
                if (index < items.length) {
                    return { value: items[index++], done: false };
                }
                return { done: true };
            }
        };
    }
}

// Usage
const collection = new NumberCollection();
collection.push(10);
collection.push(20);
collection.push(30);

// Using standard language features
for (const num of collection) {
    console.log(num);
}
```

</div>

### زبان TypeScript

<div dir="ltr">

```typescript
interface IIterator<T> {
    next(): T;
    hasNext(): boolean;
}

interface IAggregator<T> {
    createIterator(): IIterator<T>;
}

class NameIterator implements IIterator<string> {
    private position = 0;

    constructor(private collection: string[]) {}

    public next(): string {
        return this.collection[this.position++];
    }

    public hasNext(): boolean {
        return this.position < this.collection.length;
    }
}

class NameCollection implements IAggregator<string> {
    private items: string[] = [];

    public addItem(item: string): void {
        this.items.push(item);
    }

    public createIterator(): IIterator<string> {
        return new NameIterator(this.items);
    }
}

// Usage
const names = new NameCollection();
names.addItem("Alice");
names.addItem("Bob");

const iterator = names.createIterator();
while (iterator.hasNext()) {
    console.log(iterator.next());
}
```

</div>

### زبان C#

<div dir="ltr">

```csharp
using System;
using System.Collections.Generic;

// Standard C# implementation uses IEnumerable and IEnumerator
public class CustomCollection : System.Collections.IEnumerable 
{
    private string[] _items = { "First", "Second", "Third" };

    // Factory method for iterator
    public System.Collections.IEnumerator GetEnumerator() 
    {
        return new CustomIterator(this);
    }

    // Custom Iterator
    private class CustomIterator : System.Collections.IEnumerator 
    {
        private CustomCollection _collection;
        private int _position = -1;

        public CustomIterator(CustomCollection collection) 
        {
            _collection = collection;
        }

        public object Current => _collection._items[_position];

        public bool MoveNext() 
        {
            _position++;
            return _position < _collection._items.Length;
        }

        public void Reset() 
        {
            _position = -1;
        }
    }
}

// Usage
// var collection = new CustomCollection();
// foreach (var item in collection) 
// {
//     Console.WriteLine(item);
// }
```

</div>

</div>
