# Singleton Pattern

## What is it?
Singleton is a Creational Design Pattern that ensures a class has only one instance and provides a global point of access to it.

## History and Origin
Introduced in the seminal 1994 book "Design Patterns: Elements of Reusable Object-Oriented Software" by the Gang of Four (GoF).

## What Problems Does It Solve?
- **Shared Resource Management**: When you need exactly one instance of a class to coordinate actions across the system (e.g., a database connection pool, a logger, or a configuration manager).
- **Global State**: It provides a safer alternative to global variables by encapsulating the instance and controlling its creation.

## When and Where to Use It?
Use Singleton when a class in your program must have only a single instance available to all clients (like a central logging service or a hardware interface manager). Be careful, as overuse can lead to tight coupling and difficulties in unit testing (an anti-pattern).

## Examples

### JavaScript (Node.js)

```javascript
class DatabaseConnection {
    constructor() {
        if (DatabaseConnection.instance) {
            return DatabaseConnection.instance;
        }
        
        this.connectionString = "mongodb://localhost:27017";
        this.isConnected = true;
        
        // Cache the instance
        DatabaseConnection.instance = this;
        return this;
    }

    query(sql) {
        console.log(`Executing query: ${sql}`);
    }
}

// Usage:
const db1 = new DatabaseConnection();
const db2 = new DatabaseConnection();

console.log(db1 === db2); // true (Both are the exact same instance)
```

### TypeScript

```typescript
class Logger {
    private static instance: Logger;

    // Private constructor prevents instantiation from other classes
    private constructor() { }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    public log(message: string): void {
        console.log(`[LOG]: ${message}`);
    }
}

// Usage:
const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();

console.log(logger1 === logger2); // true
```

### C#

```csharp
public class Logger
{
    // 1. Private static instance
    private static Logger _instance;
    // Object for thread-safety lock
    private static readonly object _lock = new object();

    // 2. Private constructor prevents instantiation from other classes
    private Logger() { }

    // 3. Public static method to get the instance
    public static Logger Instance
    {
        get
        {
            // Double-check locking for thread safety
            if (_instance == null)
            {
                lock (_lock)
                {
                    if (_instance == null)
                    {
                        _instance = new Logger();
                    }
                }
            }
            return _instance;
        }
    }

    public void Log(string message)
    {
        Console.WriteLine($"[LOG]: {message}");
    }
}

// Usage:
// Logger.Instance.Log("System started.");
// Logger.Instance.Log("User logged in.");
```
