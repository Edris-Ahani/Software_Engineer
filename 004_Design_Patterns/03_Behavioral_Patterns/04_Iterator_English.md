# Iterator Pattern

## What is it?
Iterator is a Behavioral Design Pattern that lets you traverse elements of a collection without exposing its underlying representation (list, stack, tree, etc.).

## History and Origin
Introduced by the GoF (1994). Traversing collections is one of the most common programming tasks. Iterator abstracts the traversal mechanism out of the collection.

## What Problems Does It Solve?
- **Exposing Internal Structure**: If a collection changes its internal structure from an Array to a Tree, all client code iterating over it would break.
- **Complex Traversal Logic**: Keeping traversal logic inside the collection bloats the collection class and violates the Single Responsibility Principle.

## When and Where to Use It?
Use the Iterator pattern when your collection has a complex data structure under the hood, but you want to hide its complexity from clients. It is standard in almost all modern programming languages (e.g., `IEnumerable` in C#, `Iterable` protocols in JS/TS).

## Examples

### JavaScript (Node.js)

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

### TypeScript

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

### C#

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
