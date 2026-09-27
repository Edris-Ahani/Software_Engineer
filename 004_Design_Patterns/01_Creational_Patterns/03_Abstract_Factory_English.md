# Abstract Factory Pattern

## What is it?
Abstract Factory is a Creational Design Pattern that lets you produce families of related or dependent objects without specifying their concrete classes.

## History and Origin
Introduced by the GoF (1994). It is an extension of the Factory Method pattern, created to handle situations where multiple, related factories are needed to guarantee that products from a specific family are used together.

## What Problems Does It Solve?
- **Incompatible Products**: Prevents a system from accidentally mixing objects from different themes or platforms (e.g., putting a Mac button inside a Windows UI window).
- **Hardcoded Dependencies**: Decouples the client code from concrete classes.

## When and Where to Use It?
Use Abstract Factory when your code needs to work with various families of related products, but you don't want it to depend on the concrete classes of those products (e.g., cross-platform UI components, supporting multiple SQL databases like MySQL, PostgreSQL, SQL Server using the same interfaces).

## Examples

### JavaScript (Node.js)

```javascript
// Abstract Products
class Button { render() {} }
class Checkbox { check() {} }

// Concrete Products for Mac
class MacButton extends Button {
    render() { console.log("Rendering Mac Button"); }
}
class MacCheckbox extends Checkbox {
    check() { console.log("Checking Mac Checkbox"); }
}

// Concrete Products for Win
class WinButton extends Button {
    render() { console.log("Rendering Win Button"); }
}
class WinCheckbox extends Checkbox {
    check() { console.log("Checking Win Checkbox"); }
}

// Abstract Factory
class GUIFactory {
    createButton() {}
    createCheckbox() {}
}

// Concrete Factories
class MacFactory extends GUIFactory {
    createButton() { return new MacButton(); }
    createCheckbox() { return new MacCheckbox(); }
}

class WinFactory extends GUIFactory {
    createButton() { return new WinButton(); }
    createCheckbox() { return new WinCheckbox(); }
}

// Client Code
function renderApp(factory) {
    const button = factory.createButton();
    const checkbox = factory.createCheckbox();
    button.render();
    checkbox.check();
}

renderApp(new MacFactory());
```

### TypeScript

```typescript
// Abstract Products
interface IButton { render(): void; }
interface ICheckbox { check(): void; }

// Concrete Products for Mac
class MacButton implements IButton {
    render(): void { console.log("Rendering Mac Button"); }
}
class MacCheckbox implements ICheckbox {
    check(): void { console.log("Checking Mac Checkbox"); }
}

// Concrete Products for Win
class WinButton implements IButton {
    render(): void { console.log("Rendering Win Button"); }
}
class WinCheckbox implements ICheckbox {
    check(): void { console.log("Checking Win Checkbox"); }
}

// Abstract Factory
interface IGUIFactory {
    createButton(): IButton;
    createCheckbox(): ICheckbox;
}

// Concrete Factories
class MacFactory implements IGUIFactory {
    createButton(): IButton { return new MacButton(); }
    createCheckbox(): ICheckbox { return new MacCheckbox(); }
}

class WinFactory implements IGUIFactory {
    createButton(): IButton { return new WinButton(); }
    createCheckbox(): ICheckbox { return new WinCheckbox(); }
}

// Client Code
function renderApp(factory: IGUIFactory) {
    const button = factory.createButton();
    const checkbox = factory.createCheckbox();
    button.render();
    checkbox.check();
}

renderApp(new MacFactory());
```

### C#

```csharp
// 1. Abstract Products
public interface IButton { void Paint(); }
public interface ICheckbox { void Paint(); }

// 2. Concrete Products
public class MacOSButton : IButton {
    public void Paint() => Console.WriteLine("Painting MacOS Button");
}
public class MacOSCheckbox : ICheckbox {
    public void Paint() => Console.WriteLine("Painting MacOS Checkbox");
}

public class WinButton : IButton {
    public void Paint() => Console.WriteLine("Painting Windows Button");
}
public class WinCheckbox : ICheckbox {
    public void Paint() => Console.WriteLine("Painting Windows Checkbox");
}

// 3. Abstract Factory
public interface IGUIFactory
{
    IButton CreateButton();
    ICheckbox CreateCheckbox();
}

// 4. Concrete Factories
public class MacOSFactory : IGUIFactory
{
    public IButton CreateButton() => new MacOSButton();
    public ICheckbox CreateCheckbox() => new MacOSCheckbox();
}

public class WinFactory : IGUIFactory
{
    public IButton CreateButton() => new WinButton();
    public ICheckbox CreateCheckbox() => new WinCheckbox();
}

// 5. Client
public class Application
{
    private IButton _button;
    private ICheckbox _checkbox;

    public Application(IGUIFactory factory)
    {
        _button = factory.CreateButton();
        _checkbox = factory.CreateCheckbox();
    }

    public void Render()
    {
        _button.Paint();
        _checkbox.Paint();
    }
}
```
