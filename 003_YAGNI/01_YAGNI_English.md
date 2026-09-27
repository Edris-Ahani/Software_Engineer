# You Aren't Gonna Need It (YAGNI)

## What is it?
YAGNI is a principle of Extreme Programming (XP) that states a programmer should not add functionality until deemed necessary. 

## History and Origin
YAGNI originated in the Extreme Programming (XP) methodology, pioneered by Ron Jeffries, Kent Beck, and Ward Cunningham in the late 1990s. It was created to combat the tendency of developers to over-engineer solutions by anticipating future requirements that often never materialize.

## What Problems Does It Solve?
- **Wasted Time**: Spending hours building a generic, highly configurable system for a feature that is never used.
- **Code Complexity**: Unused abstractions and features clutter the codebase, making it harder for new developers to understand the core logic.
- **Maintenance Cost**: Even if code is not used, it still needs to be compiled, tested, and maintained.

## When and Where to Use It?
Use YAGNI during the design and implementation phases. When you catch yourself thinking "We might need this in the future...", stop. Only write code that is required for the current requirements.

## Examples

### JavaScript (Node.js)
```javascript
// BAD: Over-engineered anticipating future needs
class UserService {
    // We only need to create a user, but the developer added caching, 
    // notifications, and audit logging "just in case".
    createUser(user) {
        this.cacheUser(user);
        this.notifyAdmin(user);
        this.auditLog('Create', user);
        return db.insert(user);
    }
    // ... many unused methods ...
}

// GOOD: Simple and minimal, matching current requirements
class UserService {
    createUser(user) {
        // Just insert the user to DB as currently requested
        return db.insert(user);
    }
}
```

### TypeScript

```typescript
interface User {
    id?: number;
    name: string;
}

// BAD: Over-engineered anticipating future needs
class UserServiceBad {
    public createUser(user: User): void {
        this.cacheUser(user);
        this.notifyAdmin(user);
        this.auditLog('Create', user);
        console.log("Inserted user to DB");
    }
    
    private cacheUser(user: User): void {}
    private notifyAdmin(user: User): void {}
    private auditLog(action: string, user: User): void {}
}

// GOOD: Simple and minimal, matching current requirements
class UserServiceGood {
    public createUser(user: User): void {
        // Just insert the user to DB as currently requested
        console.log("Inserted user to DB");
    }
}
```

### C#
```csharp
// BAD: Building a complex interface for a simple requirement
public interface IRepository<T> 
{
    void Add(T entity);
    void Delete(T entity);
    void Update(T entity);
    IEnumerable<T> GetAll();
    IEnumerable<T> Find(Predicate<T> predicate);
    // 10 other methods we don't need right now...
}

// GOOD: Implementing only what is required
public class UserRepository 
{
    // We only need to save a user right now.
    public void Add(User user) 
    {
        _dbContext.Users.Add(user);
        _dbContext.SaveChanges();
    }
}
```
