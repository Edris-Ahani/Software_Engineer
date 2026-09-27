# Dependency Inversion Principle (DIP)

## What is it?
The Dependency Inversion Principle (DIP) is the 'D' in SOLID. It states two things:
1. High-level modules should not depend on low-level modules. Both should depend on abstractions (interfaces).
2. Abstractions should not depend on details. Details (classes) should depend on abstractions.

## History and Origin
Formulated by Robert C. Martin. It flips the traditional dependency architecture, where high-level policy code typically depended directly on low-level implementation code.

## What Problems Does It Solve?
- **Tight Coupling**: If your core business logic directly instantiates database connections or API clients, you are tightly coupled to those specific technologies.
- **Difficulty in Testing**: You cannot easily swap out a real database for a mock database during unit testing if the dependency is hardcoded.

## When and Where to Use It?
Use DIP to decouple your core business logic from infrastructure (databases, file systems, external APIs). Inject dependencies via constructors (Dependency Injection) rather than creating them inside the class.

## Examples

### JavaScript (Node.js)

```javascript
// BAD: High-level logic depends directly on low-level implementation
class MySQLDatabase {
    save(data) {
        console.log("Saving to MySQL...");
    }
}

class UserService {
    constructor() {
        // Hardcoded dependency!
        this.database = new MySQLDatabase();
    }

    createUser(user) {
        this.database.save(user);
    }
}
```

```javascript
// GOOD: High-level logic depends on an abstraction (passed via constructor)
class MySQLDatabase {
    save(data) {
        console.log("Saving to MySQL...");
    }
}

class MongoDatabase {
    save(data) {
        console.log("Saving to MongoDB...");
    }
}

class UserService {
    // We inject the dependency. The service doesn't care which DB it is.
    constructor(database) {
        this.database = database;
    }

    createUser(user) {
        this.database.save(user);
    }
}

// Usage:
const service = new UserService(new MongoDatabase());
```

### TypeScript

```typescript
// GOOD: High-level logic depends on an abstraction (passed via constructor)
interface IDatabase {
    save(data: any): void;
}

class MySQLDatabase implements IDatabase {
    public save(data: any): void {
        console.log("Saving to MySQL...");
    }
}

class MongoDatabase implements IDatabase {
    public save(data: any): void {
        console.log("Saving to MongoDB...");
    }
}

class UserService {
    // We inject the dependency. The service doesn't care which DB it is.
    constructor(private database: IDatabase) {}

    public createUser(user: any): void {
        this.database.save(user);
    }
}

// Usage:
const service = new UserService(new MongoDatabase());
```

### C#

```csharp
// BAD: Tight coupling
public class FileLogger 
{
    public void Log(string message) => Console.WriteLine("File: " + message);
}

public class UserManager 
{
    private FileLogger _logger;

    public UserManager() 
    {
        _logger = new FileLogger(); // DIP Violation!
    }

    public void AddUser() 
    {
        _logger.Log("User added");
    }
}
```

```csharp
// GOOD: Dependency Inversion
public interface ILogger 
{
    void Log(string message);
}

public class FileLogger : ILogger 
{
    public void Log(string message) => Console.WriteLine("File: " + message);
}

public class DatabaseLogger : ILogger 
{
    public void Log(string message) => Console.WriteLine("DB: " + message);
}

public class UserManager 
{
    private readonly ILogger _logger;

    // Dependency is injected via constructor
    public UserManager(ILogger logger) 
    {
        _logger = logger;
    }

    public void AddUser() 
    {
        _logger.Log("User added");
    }
}

// Usage in Startup/Composition Root:
// var manager = new UserManager(new DatabaseLogger());
```
