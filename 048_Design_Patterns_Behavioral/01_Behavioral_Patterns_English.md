# Behavioral Design Patterns

## What are they?
Behavioral design patterns are concerned with algorithms and the assignment of responsibilities between objects. They help manage complex control flows and communication between distinct objects in a system.

## 1. Observer (Pub/Sub)
- **Purpose**: Lets you define a subscription mechanism to notify multiple objects about any events that happen to the object they're observing.
- **Use Case**: A user follows a product on an e-commerce store to get notified when the price drops. The Product is the *Subject*, and the users are the *Observers*. When the price changes, the Subject loops through its list of Observers and calls an `update()` method on them. This is the exact pattern behind React's `useEffect` or frontend Event Listeners.

## 2. Strategy
- **Purpose**: Lets you define a family of algorithms, put each of them into a separate class, and make their objects interchangeable.
- **Use Case**: A navigation app. Originally, it only calculates routes for cars. Later, you add walking, public transport, and cycling routes. Instead of one massive `if/else` block inside the `calculateRoute()` method, you create a `RouteStrategy` interface. You implement `CarStrategy`, `WalkingStrategy`, etc. The main context simply calls `strategy.buildRoute(A, B)`.

## 3. Command
- **Purpose**: Turns a request into a stand-alone object that contains all information about the request. This transformation lets you pass requests as a method arguments, delay or queue a request's execution, and support undoable operations.
- **Use Case**: A smart home remote control. You have a button that turns on a light. Instead of the button knowing *how* to turn on the light (hard-coding the logic), the button holds a `TurnOnLightCommand` object. This makes it easy to queue up commands, log a history of actions, or build an `undo()` functionality (since every command can have a reverse `undo()` method).
