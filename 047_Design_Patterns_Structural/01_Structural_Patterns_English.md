# Structural Design Patterns

## What are they?
Structural design patterns explain how to assemble objects and classes into larger structures, while keeping these structures flexible and efficient.

## 1. Adapter (Wrapper)
- **Purpose**: Allows objects with incompatible interfaces to collaborate.
- **Use Case**: Your application uses an analytics library that expects data in XML format. The business decides to switch to a new, faster analytics library, but this new library only accepts JSON. Instead of rewriting your entire application to output JSON, you write an `Adapter` class. The application passes XML to the Adapter, the Adapter converts it to JSON, and passes it to the new library.

## 2. Decorator
- **Purpose**: Lets you attach new behaviors to objects by placing these objects inside special wrapper objects that contain the behaviors.
- **Use Case**: You have a `Notifier` class that sends notifications via Email. Later, you need to support SMS, Slack, and Push Notifications. Instead of creating massive subclasses like `EmailAndSMSNotifier`, you wrap the base `Notifier` in a `SMSDecorator` and a `SlackDecorator` dynamically at runtime.

## 3. Facade
- **Purpose**: Provides a simplified interface to a library, a framework, or any other complex set of classes.
- **Use Case**: Dealing with a complex third-party video conversion library. The library has dozens of classes for codecs, bitrates, audio tracks, and compression algorithms. Instead of letting this complexity leak into your business logic, you create a `VideoConverterFacade` class with a single, simple method: `convertVideo(filename, format)`. The Facade handles the messy details behind the scenes.
