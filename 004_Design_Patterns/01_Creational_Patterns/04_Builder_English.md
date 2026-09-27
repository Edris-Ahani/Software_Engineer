# Builder Pattern

## What is it?
Builder is a Creational Design Pattern that lets you construct complex objects step by step. The pattern allows you to produce different types and representations of an object using the same construction code.

## History and Origin
Introduced by the GoF (1994). It was conceptualized to solve the problem of telescoping constructors (a constructor with a massive list of parameters).

## What Problems Does It Solve?
- **Telescoping Constructors**: Prevents creating classes with massive constructors containing dozens of parameters, most of which are optional or `null`.
- **Inconsistent Object State**: Ensures that an object is built completely in a specific sequence before it is returned, avoiding partially initialized objects.

## When and Where to Use It?
Use the Builder pattern when constructing a complex object involves many steps, or when you need different representations of the same object (e.g., building a SQL query, creating a complex HTML DOM tree, or configuring a highly customizable User profile).

## Examples

### JavaScript (Node.js)

```javascript
class User {
    constructor() {
        this.name = '';
        this.age = 0;
        this.email = '';
        this.phone = '';
        this.address = '';
    }
}

class UserBuilder {
    constructor(name) {
        this.user = new User();
        this.user.name = name;
    }

    setAge(age) {
        this.user.age = age;
        return this; // Return builder for chaining
    }

    setEmail(email) {
        this.user.email = email;
        return this;
    }

    setAddress(address) {
        this.user.address = address;
        return this;
    }

    build() {
        return this.user;
    }
}

// Usage with Method Chaining
const myUser = new UserBuilder("John Doe")
    .setAge(30)
    .setEmail("john@example.com")
    .setAddress("123 Main St")
    .build();

console.log(myUser);
```

### TypeScript

```typescript
class UserProfile {
    public name: string = '';
    public age: number = 0;
    public email: string = '';
}

interface IUserBuilder {
    setAge(age: number): this;
    setEmail(email: string): this;
    build(): UserProfile;
}

class UserProfileBuilder implements IUserBuilder {
    private user: UserProfile;

    constructor(name: string) {
        this.user = new UserProfile();
        this.user.name = name;
    }

    public setAge(age: number): this {
        this.user.age = age;
        return this; // Return builder for chaining
    }

    public setEmail(email: string): this {
        this.user.email = email;
        return this;
    }

    public build(): UserProfile {
        return this.user;
    }
}

// Usage with Method Chaining
const myUser: UserProfile = new UserProfileBuilder("John Doe")
    .setAge(30)
    .setEmail("john@example.com")
    .build();

console.log(myUser);
```

### C#

```csharp
public class Car 
{
    public string Engine { get; set; }
    public int Seats { get; set; }
    public bool HasGPS { get; set; }
    public bool HasTripComputer { get; set; }
}

public interface ICarBuilder 
{
    void Reset();
    void SetSeats(int seats);
    void SetEngine(string engine);
    void SetGPS(bool hasGPS);
    Car GetResult();
}

public class SportsCarBuilder : ICarBuilder 
{
    private Car _car = new Car();

    public void Reset() => _car = new Car();
    public void SetSeats(int seats) => _car.Seats = seats;
    public void SetEngine(string engine) => _car.Engine = engine;
    public void SetGPS(bool hasGPS) => _car.HasGPS = hasGPS;
    
    public Car GetResult() 
    {
        Car result = _car;
        Reset();
        return result;
    }
}

// Optional: Director class to dictate building steps
public class Director 
{
    public void ConstructSportsCar(ICarBuilder builder) 
    {
        builder.Reset();
        builder.SetSeats(2);
        builder.SetEngine("V8");
        builder.SetGPS(true);
    }
}
```
