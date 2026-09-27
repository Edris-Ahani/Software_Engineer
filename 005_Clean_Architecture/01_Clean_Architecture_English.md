# Clean Architecture

## What is it?
Clean Architecture is a software design philosophy introduced by Robert C. Martin (Uncle Bob). It aims to separate the concerns of a software application by dividing it into layers. The core principle is the Dependency Rule: dependencies must point inward toward the business rules.

## History and Origin
Introduced in 2012 by Robert C. Martin. It synthesizes ideas from Hexagonal Architecture (Ports and Adapters), Onion Architecture, and others into a single, cohesive architecture.

## What Problems Does It Solve?
- **Framework Independence**: The architecture does not depend on the existence of some library of feature-laden software. This allows you to use frameworks as tools, rather than having to cram your system into their limited constraints.
- **Testability**: The business rules can be tested without the UI, Database, Web Server, or any other external element.
- **UI Independence**: The UI can change easily, without changing the rest of the system.
- **Database Independence**: You can swap out SQL for NoSQL, Mongo, BigTable, etc. Your business rules are not bound to the database.

## When and Where to Use It?
Use Clean Architecture for complex, long-lasting enterprise applications where maintainability, testability, and adaptability to new technologies (like changing the database or UI) are critical.

## Examples

### TypeScript / Node.js
```typescript
// 1. Domain Entities (Innermost layer)
class User {
    constructor(public id: string, public name: string, public email: string) {}
}

// 2. Use Cases (Application logic)
interface UserRepository {
    save(user: User): Promise<void>;
    findByEmail(email: string): Promise<User | null>;
}

class RegisterUserUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(name: string, email: string): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error("User already exists");
        }
        const user = new User(Date.now().toString(), name, email);
        await this.userRepository.save(user);
        return user;
    }
}

// 3. Interface Adapters (Controllers, Gateways)
class UserController {
    constructor(private registerUserUseCase: RegisterUserUseCase) {}

    async register(req: any, res: any) {
        try {
            const user = await this.registerUserUseCase.execute(req.body.name, req.body.email);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

// 4. Frameworks and Drivers (Outermost layer)
// e.g., Express.js setup, PostgreSQL implementation of UserRepository
```
