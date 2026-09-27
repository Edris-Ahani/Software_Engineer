# Interface Segregation Principle (ISP)

## What is it?
The Interface Segregation Principle (ISP) is the 'I' in SOLID. It states that no client should be forced to depend on methods it does not use. Large, bulky interfaces should be split into smaller, more specific ones.

## History and Origin
Robert C. Martin formulated this principle while consulting for Xerox in the 1990s. Xerox had a large software system for a new multi-function printer, and any change to the massive master class required recompiling the entire system. 

## What Problems Does It Solve?
- **Fat Interfaces**: Interfaces with dozens of methods that are not relevant to all implementing classes.
- **Unnecessary Dependencies**: Changing one part of a fat interface affects all classes that implement it, even if they don't use that specific part.
- **Empty Implementations**: Forcing developers to implement methods and throw `NotImplementedException` because their class doesn't support the feature.

## When and Where to Use It?
Use ISP when you notice that classes implementing your interface are leaving methods empty or throwing exceptions. Break the large interface down into smaller, role-based interfaces.

## Examples

### TypeScript
*Note: JavaScript does not have native interfaces, but this concept applies to base classes or TypeScript interfaces.*

```typescript
// BAD: Fat interface
interface Worker {
    work(): void;
    eat(): void;
    sleep(): void;
}

class HumanWorker implements Worker {
    work() { console.log("Working"); }
    eat() { console.log("Eating"); }
    sleep() { console.log("Sleeping"); }
}

class RobotWorker implements Worker {
    work() { console.log("Working"); }
    eat() { throw new Error("Robots do not eat"); } // ISP Violation!
    sleep() { throw new Error("Robots do not sleep"); } // ISP Violation!
}
```

```typescript
// GOOD: Segregated interfaces
interface Workable {
    work(): void;
}

interface Eatable {
    eat(): void;
}

interface Sleepable {
    sleep(): void;
}

class HumanWorker implements Workable, Eatable, Sleepable {
    work() { console.log("Working"); }
    eat() { console.log("Eating"); }
    sleep() { console.log("Sleeping"); }
}

class RobotWorker implements Workable {
    work() { console.log("Working"); }
    // No need to implement eat() or sleep()
}
```

### C#

```csharp
// BAD: Fat interface
public interface IPrinterTasks 
{
    void Print(string content);
    void Scan(string content);
    void Fax(string content);
}

// A simple printer doesn't have scan or fax features!
public class BasicPrinter : IPrinterTasks 
{
    public void Print(string content) => Console.WriteLine("Printing...");
    public void Scan(string content) => throw new NotImplementedException(); // ISP Violation!
    public void Fax(string content) => throw new NotImplementedException(); // ISP Violation!
}
```

```csharp
// GOOD: Segregated interfaces
public interface IPrinter 
{
    void Print(string content);
}

public interface IScanner 
{
    void Scan(string content);
}

public interface IFax 
{
    void Fax(string content);
}

public class BasicPrinter : IPrinter 
{
    public void Print(string content) => Console.WriteLine("Printing...");
}

public class AdvancedMultiFunctionPrinter : IPrinter, IScanner, IFax 
{
    public void Print(string content) => Console.WriteLine("Printing...");
    public void Scan(string content) => Console.WriteLine("Scanning...");
    public void Fax(string content) => Console.WriteLine("Faxing...");
}
```
