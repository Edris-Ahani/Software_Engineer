# Dependency Injection (DI) & Inversion of Control (IoC)

## The Bad Way (Hard Coupling)
Imagine you are building a `Car` class that needs an `Engine` to run.
```javascript
class Car {
  constructor() {
    // Bad: The Car builds its own engine!
    this.engine = new V8Engine(); 
  }
}
```
This is **Hard Coupling**. If you want to create an Electric Car tomorrow, you have to rewrite the `Car` class. You also cannot easily write unit tests for the `Car` without also testing the real `V8Engine` (because you can't mock it).

## Dependency Injection (DI)
Instead of a class building its own dependencies, we **inject** them from the outside (usually via the constructor).
```javascript
class Car {
  // Good: The Engine is handed to the Car
  constructor(engine) {
    this.engine = engine;
  }
}

const v8 = new V8Engine();
const myCar = new Car(v8);

const electric = new ElectricEngine();
const futureCar = new Car(electric); // Works perfectly without changing Car!
```
Now, the `Car` is loosely coupled. It doesn't care *how* the engine is built, it just uses whatever you pass to it. For Unit Testing, you can inject a `MockEngine` that does nothing.

## Inversion of Control (IoC) Containers
If your app has 100 classes, manually instantiating and passing dependencies around (`new Database()`, `new Logger()`, `new UserService(db, logger)`) becomes tedious.
An **IoC Container** (used in Spring Boot, .NET, Angular, NestJS) handles this automatically. You just declare: "I need a Database and a Logger", and the framework automatically figures out how to build them and injects them into your class for you. The control of building objects is "inverted" (given away) to the framework.
