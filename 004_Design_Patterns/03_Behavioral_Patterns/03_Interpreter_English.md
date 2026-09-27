# Interpreter Pattern

## What is it?
Interpreter is a Behavioral Design Pattern that defines a grammatical representation for a language and provides an interpreter to deal with this grammar.

## History and Origin
Introduced by the GoF (1994). It was designed specifically for parsing and evaluating expressions, languages, or rules engines.

## What Problems Does It Solve?
- **Hardcoding Rules**: Hardcoding complex evaluation logic for search queries, mathematical expressions, or domain-specific languages leads to unmaintainable code.

## When and Where to Use It?
Use it when you have a simple language or syntax to parse and evaluate (e.g., regex engines, SQL query builders, or simple mathematical calculators). Do not use it for complex languages; use a parser generator instead.

## Examples

### JavaScript (Node.js)

```javascript
// Abstract Expression
class Expression {
    interpret(context) {}
}

// Terminal Expression
class NumberExpression extends Expression {
    constructor(number) {
        super();
        this.number = number;
    }
    interpret() {
        return this.number;
    }
}

// Non-Terminal Expression
class AddExpression extends Expression {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
    interpret() {
        return this.left.interpret() + this.right.interpret();
    }
}

// Usage
// Expression: 5 + 10
const five = new NumberExpression(5);
const ten = new NumberExpression(10);
const add = new AddExpression(five, ten);

console.log(add.interpret()); // 15
```

### TypeScript

```typescript
interface IExpression {
    interpret(context: Map<string, boolean>): boolean;
}

class TerminalExpression implements IExpression {
    constructor(private data: string) {}

    public interpret(context: Map<string, boolean>): boolean {
        return context.get(this.data) || false;
    }
}

class OrExpression implements IExpression {
    constructor(private expr1: IExpression, private expr2: IExpression) {}

    public interpret(context: Map<string, boolean>): boolean {
        return this.expr1.interpret(context) || this.expr2.interpret(context);
    }
}

// Usage
const context = new Map<string, boolean>();
context.set("John", true);
context.set("Doe", false);

const isJohn = new TerminalExpression("John");
const isDoe = new TerminalExpression("Doe");
const isJohnOrDoe = new OrExpression(isJohn, isDoe);

console.log(isJohnOrDoe.interpret(context)); // true
```

### C#

```csharp
using System;
using System.Collections.Generic;

// Abstract Expression
public interface IExpression 
{
    int Interpret(Dictionary<string, int> context);
}

// Terminal
public class VariableExpression : IExpression 
{
    private string _name;
    public VariableExpression(string name) { _name = name; }
    
    public int Interpret(Dictionary<string, int> context) 
    {
        return context[_name];
    }
}

// Non-Terminal
public class SubtractExpression : IExpression 
{
    private IExpression _left, _right;
    public SubtractExpression(IExpression left, IExpression right) 
    {
        _left = left;
        _right = right;
    }

    public int Interpret(Dictionary<string, int> context) 
    {
        return _left.Interpret(context) - _right.Interpret(context);
    }
}

// Usage
// var context = new Dictionary<string, int> { { "x", 10 }, { "y", 4 } };
// var exp = new SubtractExpression(new VariableExpression("x"), new VariableExpression("y"));
// Console.WriteLine(exp.Interpret(context)); // 6
```
