<div dir="rtl">

# الگوی کارخانه انتزاعی (Abstract Factory Pattern)

## این الگو چیست؟
کارخانه انتزاعی (Abstract Factory) یک الگوی سازنده است که به شما اجازه می‌دهد خانواده‌هایی از اشیاء مرتبط یا وابسته را بدون مشخص کردن کلاس‌های دقیق (Concrete Classes) آن‌ها تولید کنید.

## تاریخچه و دلیل پیدایش
توسط GoF در سال ۱۹۹۴ معرفی شد. این الگو در واقع توسعه‌ای بر الگوی Factory Method است و برای مدیریت شرایطی ایجاد شد که سیستم نیاز به استفاده از خانواده‌ای از اشیاء دارد که باید حتماً با هم سازگار باشند.

## چه مشکلاتی را برطرف می‌کند؟
- **محصولات ناسازگار**: از ترکیب اشتباه اشیاء پلتفرم‌ها یا تم‌های مختلف جلوگیری می‌کند (مثلاً قرار دادن یک دکمه استایل مک داخل یک پنجره استایل ویندوز).
- **وابستگی‌های هاردکد شده**: کلاینت را از وابستگی به کلاس‌های دقیق و واقعی رها می‌کند.

## کجا و چه زمانی باید از آن استفاده کرد؟
زمانی از این الگو استفاده کنید که کُد شما قرار است با خانواده‌های مختلفی از محصولات مرتبط کار کند، اما نمی‌خواهید به کلاس‌های دقیق آن محصولات وابسته شوید (مثلاً ساخت اجزای رابط کاربری چندپلتفرمی، یا پشتیبانی همزمان از دیتابیس‌های MySQL، PostgreSQL و SQL Server با استفاده از یک اینترفیس مشترک).

## مثال‌ها

### زبان JavaScript

<div dir="ltr">

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

</div>

### زبان TypeScript

<div dir="ltr">

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

</div>

### زبان C#

<div dir="ltr">

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

</div>

</div>
