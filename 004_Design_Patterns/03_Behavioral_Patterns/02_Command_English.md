# Command Pattern

## What is it?
Command is a Behavioral Design Pattern that turns a request into a stand-alone object that contains all information about the request. This transformation lets you pass requests as a method argument, delay or queue a request's execution, and support undoable operations.

## History and Origin
Introduced by the GoF (1994). It abstracts the action and the parameters needed to execute it.

## What Problems Does It Solve?
- **Hardcoded Requests**: Prevents tightly coupling the sender of a request to its receiver.
- **Lack of History**: Without objects representing actions, implementing features like "Undo/Redo", macro recording, or transaction logging is incredibly difficult.

## When and Where to Use It?
Use it when you want to parameterize objects with operations (like a UI button that needs to execute a command), queue operations, schedule their execution, or support undo capabilities.

## Examples

### JavaScript (Node.js)

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

### TypeScript

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

### C#

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
