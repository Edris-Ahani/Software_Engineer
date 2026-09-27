# Proxy Pattern

## What is it?
Proxy is a Structural Design Pattern that lets you provide a substitute or placeholder for another object. A proxy controls access to the original object, allowing you to perform something either before or after the request gets through to the original object.

## History and Origin
Introduced by the GoF (1994). It was created to delay the cost of creating expensive objects (Virtual Proxy), manage access control (Protection Proxy), or represent objects in a different address space (Remote Proxy).

## What Problems Does It Solve?
- **Resource Management**: Loading a heavy object (like a massive database connection or high-res image) at application startup slows things down, even if the object is never used.
- **Access Control and Logging**: You might need to check permissions, authenticate requests, or log interactions before allowing access to a core service.

## When and Where to Use It?
Use the Proxy pattern when you need to add a layer of control over how and when an object is accessed. It is commonly used for lazy initialization (Virtual Proxy), caching requests (Caching Proxy), or security checks (Protection Proxy).

## Examples

### JavaScript (Node.js)

```javascript
// The Real Subject
class RealDatabase {
    query(sql) {
        console.log(`Executing query on DB: ${sql}`);
        return ["row1", "row2"];
    }
}

// The Proxy
class DatabaseProxy {
    constructor(userRole) {
        this.userRole = userRole;
        this.realDatabase = null; // Lazy load
    }

    query(sql) {
        // Protection Proxy behavior
        if (this.userRole !== 'ADMIN') {
            console.log("Access Denied: Only ADMIN can query DB.");
            return [];
        }

        // Virtual Proxy behavior (Lazy Initialization)
        if (!this.realDatabase) {
            console.log("Initializing heavy RealDatabase connection...");
            this.realDatabase = new RealDatabase();
        }

        console.log(`[LOG]: Query requested at ${new Date().toISOString()}`);
        return this.realDatabase.query(sql);
    }
}

// Usage
const guestDb = new DatabaseProxy("GUEST");
guestDb.query("SELECT * FROM users"); // Denied

const adminDb = new DatabaseProxy("ADMIN");
adminDb.query("SELECT * FROM users"); // Allowed, DB initialized
adminDb.query("SELECT * FROM posts"); // Allowed, DB already initialized
```

### TypeScript

```typescript
interface IServer {
    handleRequest(url: string): void;
}

class RealServer implements IServer {
    public handleRequest(url: string): void {
        console.log(`[RealServer]: Serving content for ${url}`);
    }
}

class CacheProxyServer implements IServer {
    private realServer: RealServer;
    private cache: Map<string, string> = new Map();

    constructor() {
        this.realServer = new RealServer();
    }

    public handleRequest(url: string): void {
        if (this.cache.has(url)) {
            console.log(`[CacheProxy]: Serving ${url} from CACHE`);
        } else {
            console.log(`[CacheProxy]: Cache miss. Forwarding to RealServer.`);
            this.realServer.handleRequest(url);
            this.cache.set(url, "Cached Content");
        }
    }
}

// Usage
const proxy: IServer = new CacheProxyServer();
proxy.handleRequest("/home"); // Miss, forwards to RealServer
proxy.handleRequest("/home"); // Hit, serves from Cache
```

### C#

```csharp
using System;

// 1. Subject Interface
public interface IDocument 
{
    void Display();
}

// 2. Real Subject
public class HighResImage : IDocument 
{
    private string _filename;

    public HighResImage(string filename) 
    {
        _filename = filename;
        LoadFromDisk(); // Expensive operation
    }

    private void LoadFromDisk() 
    {
        Console.WriteLine($"Loading massive image {_filename} from disk...");
    }

    public void Display() 
    {
        Console.WriteLine($"Displaying image {_filename}");
    }
}

// 3. Proxy
public class ImageProxy : IDocument 
{
    private HighResImage _realImage;
    private string _filename;

    public ImageProxy(string filename) 
    {
        _filename = filename;
    }

    public void Display() 
    {
        // Lazy Initialization
        if (_realImage == null) 
        {
            _realImage = new HighResImage(_filename);
        }
        _realImage.Display();
    }
}

// Usage
// IDocument image = new ImageProxy("test_10GB_image.png");
// Console.WriteLine("ImageProxy object created. (Image is NOT loaded yet)");
// image.Display(); // Now it loads and displays
// image.Display(); // Does not load again, just displays
```
