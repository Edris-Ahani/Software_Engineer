<div dir="rtl">

# الگوی فرمان (Command Pattern)

## این الگو چیست؟
الگوی فرمان یک الگوی طراحی رفتاری است که یک درخواست را به یک شیء مستقل (شامل تمام اطلاعات مربوط به آن درخواست) تبدیل می‌کند. این تبدیل به شما اجازه می‌دهد درخواست‌ها را به عنوان پارامتر به متدها ارسال کنید، اجرای آن‌ها را به تأخیر بیندازید یا در صف قرار دهید، و قابلیت لغو (Undo) را پیاده‌سازی کنید.

## تاریخچه و دلیل پیدایش
این الگو توسط گروه GoF در سال ۱۹۹۴ معرفی شد. هدف آن انتزاعی کردن یک عمل و پارامترهای لازم برای اجرای آن است تا فرستنده درخواست کاملاً از دریافت‌کننده و نحوه اجرای آن مستقل شود.

## چه مشکلاتی را برطرف می‌کند؟
- **هاردکد شدن درخواست‌ها**: از وابستگی شدید بین رابط کاربری (فرستنده) و منطق تجاری (دریافت‌کننده) جلوگیری می‌کند.
- **فقدان تاریخچه عملیات**: بدون تبدیل اعمال به اشیاء، پیاده‌سازی ویژگی‌هایی مانند "Undo/Redo" (لغو/تکرار)، ضبط ماکرو یا ثبت تراکنش‌ها بسیار دشوار و کثیف خواهد بود.

## کجا و چه زمانی باید از آن استفاده کرد؟
زمانی از این الگو استفاده کنید که می‌خواهید اشیاء را با عملیات‌ها پارامتری کنید (مانند دکمه‌ای در UI که باید یک فرمان خاص را اجرا کند)، عملیات‌ها را در صف قرار دهید، اجرای آن‌ها را زمان‌بندی کنید یا از قابلیت Undo پشتیبانی کنید.

## مثال‌ها

### زبان JavaScript

<div dir="ltr">

```javascript
// Receiver
class Light {
    turnOn() { console.log("Light is ON"); }
    turnOff() { console.log("Light is OFF"); }
}

// Command Interface equivalent
class Command {
    execute() {}
    undo() {}
}

// Concrete Commands
class TurnOnCommand extends Command {
    constructor(light) {
        super();
        this.light = light;
    }
    execute() { this.light.turnOn(); }
    undo() { this.light.turnOff(); }
}

class TurnOffCommand extends Command {
    constructor(light) {
        super();
        this.light = light;
    }
    execute() { this.light.turnOff(); }
    undo() { this.light.turnOn(); }
}

// Invoker
class RemoteControl {
    submit(command) {
        command.execute();
    }
}

// Usage
const light = new Light();
const turnOn = new TurnOnCommand(light);
const turnOff = new TurnOffCommand(light);

const remote = new RemoteControl();
remote.submit(turnOn);
remote.submit(turnOff);
```

</div>

### زبان TypeScript

<div dir="ltr">

```typescript
// Receiver
class TextEditor {
    private text = "";

    public addText(newText: string) {
        this.text += newText;
        console.log(`Current Text: ${this.text}`);
    }

    public removeText(length: number) {
        this.text = this.text.slice(0, -length);
        console.log(`Current Text: ${this.text}`);
    }
}

// Command Interface
interface ICommand {
    execute(): void;
    undo(): void;
}

// Concrete Command
class AddTextCommand implements ICommand {
    constructor(private editor: TextEditor, private textToAdd: string) {}

    public execute(): void {
        this.editor.addText(this.textToAdd);
    }

    public undo(): void {
        this.editor.removeText(this.textToAdd.length);
    }
}

// Invoker (with Undo history)
class CommandHistory {
    private history: ICommand[] = [];

    public executeCommand(command: ICommand): void {
        command.execute();
        this.history.push(command);
    }

    public undo(): void {
        const command = this.history.pop();
        if (command) command.undo();
    }
}

// Usage
const editor = new TextEditor();
const history = new CommandHistory();

history.executeCommand(new AddTextCommand(editor, "Hello "));
history.executeCommand(new AddTextCommand(editor, "World"));
history.undo(); // Undoes "World"
```

</div>

### زبان C#

<div dir="ltr">

```csharp
using System;
using System.Collections.Generic;

// 1. Receiver
public class Calculator 
{
    public int Value { get; set; } = 0;

    public void Add(int amount) { Value += amount; }
    public void Subtract(int amount) { Value -= amount; }
}

// 2. Command Interface
public interface ICommand 
{
    void Execute();
    void Undo();
}

// 3. Concrete Command
public class AddCommand : ICommand 
{
    private Calculator _calculator;
    private int _amount;

    public AddCommand(Calculator calculator, int amount) 
    {
        _calculator = calculator;
        _amount = amount;
    }

    public void Execute() { _calculator.Add(_amount); }
    public void Undo() { _calculator.Subtract(_amount); }
}

// Usage
// var calc = new Calculator();
// ICommand add5 = new AddCommand(calc, 5);
// add5.Execute();
// Console.WriteLine(calc.Value); // 5
// add5.Undo();
// Console.WriteLine(calc.Value); // 0
```

</div>

</div>
