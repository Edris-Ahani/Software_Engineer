<div dir="rtl">

# الگوی مفسر (Interpreter Pattern)

## این الگو چیست؟
الگوی مفسر یک الگوی طراحی رفتاری است که برای یک زبان خاص یا مجموعه‌ای از قوانین، گرامری تعریف می‌کند و سپس از آن گرامر برای تفسیر و اجرای عبارات استفاده می‌کند.

## تاریخچه و دلیل پیدایش
این الگو توسط گروه GoF در سال ۱۹۹۴ معرفی شد. این الگو به طور خاص برای پردازش، تجزیه (Parsing) و ارزیابی عبارات، زبان‌های ساخت‌یافته و موتورهای قانون‌گذار (Rules Engines) طراحی شد.

## چه مشکلاتی را برطرف می‌کند؟
- **هاردکد کردن قوانین پیچیده**: هاردکد کردن منطق‌های پیچیده ارزیابی برای کوئری‌های جستجو، عبارات ریاضی یا زبان‌های دامنه-خاص (DSL) باعث ایجاد کدهایی می‌شود که قابل نگهداری نیستند. این الگو این عبارات را به ساختار درختی از اشیاء تبدیل می‌کند.

## کجا و چه زمانی باید از آن استفاده کرد؟
از این الگو زمانی استفاده کنید که یک زبان یا سینتکس ساده برای تجزیه و ارزیابی دارید (مانند موتورهای پردازش Regex، ساخت کوئری‌های SQL ساده، یا ماشین‌حساب‌های ریاضی). برای زبان‌های برنامه‌نویسی پیچیده از این الگو استفاده نکنید.

## مثال‌ها

### زبان JavaScript

<div dir="ltr">

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

</div>

### زبان TypeScript

<div dir="ltr">

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

</div>

### زبان C#

<div dir="ltr">

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

</div>

</div>
