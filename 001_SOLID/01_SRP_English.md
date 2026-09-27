# Single Responsibility Principle (SRP)

## What is it?
The Single Responsibility Principle (SRP) is the 'S' in the SOLID acronym. It states that a class, module, or function should have one, and only one, reason to change. This means it should only have one job or responsibility.

## History and Origin
Introduced by Robert C. Martin (Uncle Bob) in his 2003 book "Agile Software Development, Principles, Patterns, and Practices". It builds upon the concept of cohesion introduced by Tom DeMarco.

## What Problems Does It Solve?
- **High Coupling**: When a class does too many things, changing one part might unexpectedly break another part.
- **Testing Difficulty**: God classes (classes that do everything) are extremely hard to unit test because they have too many dependencies.
- **Merge Conflicts**: If a class handles UI formatting, business logic, and database access, multiple developers will constantly edit the same file, causing conflicts.

## When and Where to Use It?
Use SRP when you are designing classes, modules, or microservices. If you can describe what a class does using the word "and" (e.g., "It calculates taxes AND saves to the database"), it likely violates SRP.

## Examples

### JavaScript (Node.js)
```javascript
// BAD: Class has multiple responsibilities (Logic + DB + Email)
class UserRegistration {
    registerUser(email, password) {
        // 1. Business Logic
        if (!email.includes('@')) throw new Error("Invalid email");
        
        // 2. Database interaction
        database.save({ email, password });
        
        // 3. Notification
        emailService.send(email, "Welcome!");
    }
}

// GOOD: Responsibilities are separated
class UserValidator {
    validate(email) {
        if (!email.includes('@')) throw new Error("Invalid email");
    }
}

class UserRepository {
    save(user) {
        database.save(user);
    }
}

class EmailSender {
    sendWelcomeEmail(email) {
        emailService.send(email, "Welcome!");
    }
}

class UserRegistration {
    constructor(validator, repository, emailSender) {
        this.validator = validator;
        this.repository = repository;
        this.emailSender = emailSender;
    }

    registerUser(email, password) {
        this.validator.validate(email);
        this.repository.save({ email, password });
        this.emailSender.sendWelcomeEmail(email);
    }
}
```

### TypeScript

```typescript
class User {
    constructor(public email: string, public password: string) {}
}

// GOOD: Responsibilities are separated
class UserValidator {
    public validate(email: string): void {
        if (!email.includes('@')) throw new Error("Invalid email");
    }
}

class UserRepository {
    public save(user: User): void {
        console.log("Saved to DB", user);
    }
}

class EmailSender {
    public sendWelcomeEmail(email: string): void {
        console.log(`Sending welcome email to ${email}`);
    }
}

class UserRegistration {
    constructor(
        private validator: UserValidator,
        private repository: UserRepository,
        private emailSender: EmailSender
    ) {}

    public registerUser(email: string, password: string): void {
        this.validator.validate(email);
        this.repository.save(new User(email, password));
        this.emailSender.sendWelcomeEmail(email);
    }
}
```

### C#
```csharp
// BAD: One class doing everything
public class InvoiceManager 
{
    public void AddInvoice(Invoice invoice) 
    {
        // 1. Business logic
        if (invoice.Amount < 0) throw new Exception("Invalid amount");

        // 2. Database access
        using (var connection = new SqlConnection("...")) 
        {
            // Insert into DB
        }

        // 3. File system access
        File.WriteAllText("log.txt", $"Invoice {invoice.Id} created");
    }
}

// GOOD: Separation of Concerns
public class InvoiceValidator 
{
    public bool Validate(Invoice invoice) => invoice.Amount >= 0;
}

public class InvoiceRepository 
{
    public void Save(Invoice invoice) 
    {
        using (var connection = new SqlConnection("...")) 
        {
            // Insert into DB
        }
    }
}

public class Logger 
{
    public void LogInfo(string message) 
    {
        File.AppendAllText("log.txt", message);
    }
}
```
