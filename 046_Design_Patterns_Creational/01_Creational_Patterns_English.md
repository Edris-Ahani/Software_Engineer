# Creational Design Patterns

## What is a Design Pattern?
Design patterns are typical solutions to commonly occurring problems in software design. They are like pre-made blueprints that you can customize to solve a recurring design problem in your code. 

**Creational Patterns** provide various object creation mechanisms, which increase flexibility and reuse of existing code.

## 1. Singleton
- **Purpose**: Ensures that a class has only *one* instance, while providing a global access point to this instance.
- **Use Case**: A database connection pool or a global configuration object. You don't want 50 different instances of a database connection competing for resources; you want exactly one.
- **Warning**: Overusing Singletons can make your code hard to unit test because they introduce global state.

## 2. Factory Method
- **Purpose**: Provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.
- **Use Case**: Imagine a logistics app. Initially, it only handles truck transportation (`Truck` class). Later, you need to add sea logistics (`Ship` class). Instead of writing complex `if/else` logic every time you create a transport, you create a `TransportFactory` that outputs the correct vehicle based on the input.

## 3. Builder
- **Purpose**: Lets you construct complex objects step by step. The pattern allows you to produce different types and representations of an object using the same construction code.
- **Use Case**: Creating a complex SQL Query string, or building an HTTP Request object where some fields (like headers, body, query parameters) are optional and some are required. Instead of a constructor with 15 parameters `new Request(url, null, null, true, false, headers)`, you do `new RequestBuilder().setUrl(url).setHeaders(headers).build()`.
