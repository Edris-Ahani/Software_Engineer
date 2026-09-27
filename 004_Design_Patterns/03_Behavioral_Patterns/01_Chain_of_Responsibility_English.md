# Chain of Responsibility Pattern

## What is it?
Chain of Responsibility is a Behavioral Design Pattern that lets you pass requests along a chain of handlers. Upon receiving a request, each handler decides either to process the request or to pass it to the next handler in the chain.

## History and Origin
Introduced by the GoF (1994). It is analogous to a chain of command in an organization or a tech support call center, where a level-1 agent handles simple issues and escalates complex ones to level-2.

## What Problems Does It Solve?
- **Tight Coupling between Sender and Receiver**: Decouples the sender of a request from its receivers.
- **Dynamic Request Handling**: When the exact handler isn't known in advance and depends on runtime conditions.

## When and Where to Use It?
Use it when your program expects to process different kinds of requests in various ways, but the exact types of requests and their sequences are unknown beforehand. Common in middleware (like Express.js in Node), event bubbling in UI frameworks, and logging frameworks.

## Examples

### JavaScript (Node.js)

```javascript
// Handler
class SupportHandler {
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }

    handle(request) {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }
        return null;
    }
}

// Concrete Handlers
class Level1Support extends SupportHandler {
    handle(request) {
        if (request === "password_reset") {
            return "Level 1: I can reset your password.";
        }
        return super.handle(request);
    }
}

class Level2Support extends SupportHandler {
    handle(request) {
        if (request === "bug_report") {
            return "Level 2: I will log this bug for developers.";
        }
        return super.handle(request);
    }
}

class ManagerSupport extends SupportHandler {
    handle(request) {
        if (request === "refund") {
            return "Manager: I will process your refund.";
        }
        return super.handle(request);
    }
}

// Usage
const level1 = new Level1Support();
const level2 = new Level2Support();
const manager = new ManagerSupport();

level1.setNext(level2).setNext(manager);

console.log(level1.handle("bug_report")); // Level 2 handles it
console.log(level1.handle("refund")); // Manager handles it
```

### TypeScript

```typescript
interface IHandler {
    setNext(handler: IHandler): IHandler;
    handle(request: string): string | null;
}

abstract class AbstractHandler implements IHandler {
    private nextHandler: IHandler | null = null;

    public setNext(handler: IHandler): IHandler {
        this.nextHandler = handler;
        return handler;
    }

    public handle(request: string): string | null {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }
        return null;
    }
}

class AuthMiddleware extends AbstractHandler {
    public handle(request: string): string | null {
        if (request === "NoAuth") return "Auth Failed";
        return super.handle(request); // Pass to next
    }
}

class DataValidationMiddleware extends AbstractHandler {
    public handle(request: string): string | null {
        if (request === "BadData") return "Validation Failed";
        return super.handle(request); // Pass to next
    }
}

// Usage
const auth = new AuthMiddleware();
const validation = new DataValidationMiddleware();
auth.setNext(validation);

console.log(auth.handle("NoAuth")); // Auth Failed
console.log(auth.handle("BadData")); // Validation Failed
```

### C#

```csharp
using System;

// 1. Handler Interface
public interface IHandler 
{
    IHandler SetNext(IHandler handler);
    object Handle(object request);
}

// 2. Base Handler
public abstract class AbstractHandler : IHandler 
{
    private IHandler _nextHandler;

    public IHandler SetNext(IHandler handler) 
    {
        _nextHandler = handler;
        return handler;
    }

    public virtual object Handle(object request) 
    {
        if (_nextHandler != null) 
        {
            return _nextHandler.Handle(request);
        }
        return null;
    }
}

// 3. Concrete Handlers
public class MonkeyHandler : AbstractHandler 
{
    public override object Handle(object request) 
    {
        if ((request as string) == "Banana") 
            return $"Monkey: I'll eat the {request}.";
        return base.Handle(request);
    }
}

public class SquirrelHandler : AbstractHandler 
{
    public override object Handle(object request) 
    {
        if ((request as string) == "Nut") 
            return $"Squirrel: I'll eat the {request}.";
        return base.Handle(request);
    }
}

// Usage
// var monkey = new MonkeyHandler();
// var squirrel = new SquirrelHandler();
// monkey.SetNext(squirrel);
// Console.WriteLine(monkey.Handle("Nut")); // Handled by Squirrel
```
