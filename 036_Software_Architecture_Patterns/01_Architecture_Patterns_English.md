# Advanced Software Architecture Patterns

## What is it?
Beyond basic MVC (Model-View-Controller) and Microservices, senior backend engineers use specific architectural patterns to solve complex problems related to scalability, data consistency, and system coupling.

## 1. Event-Driven Architecture (EDA)
- **Concept**: Instead of services calling each other directly (e.g., Service A calls Service B's REST API), services communicate by emitting and listening to **Events**. 
- **How it works**: When a user registers, the Auth Service emits a `UserCreated` event to a Message Broker (like Kafka). The Email Service and Analytics Service, which are listening for that event, pick it up and do their jobs asynchronously.
- **Benefits**: Extremely loose coupling. The Auth Service doesn't need to know that the Email Service even exists, and if the Email Service goes down, the Auth Service isn't affected.

## 2. CQRS (Command Query Responsibility Segregation)
- **Concept**: The pattern of separating the operations that read data (Queries) from the operations that update data (Commands).
- **How it works**: In a traditional CRUD system, the same database model is used for both reading and writing. In CQRS, you have a completely separate model (and often a separate physical database) for reading than for writing.
- **Example**: The application writes user updates (Commands) to a heavily normalized PostgreSQL database. In the background, those updates are flattened and synced to an Elasticsearch index (Queries) so users can perform lightning-fast searches without hitting the main write-database.
- **Benefits**: Massive performance gains for read-heavy applications.

## 3. Event Sourcing
- **Concept**: Instead of storing the *current state* of a record in a database, you store a sequence of *every event* that led to the current state.
- **Analogy**: A bank account. You don't just store "Balance: $100" (Current state). You store "Deposited $50, Deposited $100, Withdrew $50" (Event Sourcing).
- **Benefits**: 
  - Perfect audit trail (you know exactly *why* a record looks the way it does).
  - Time travel: You can reconstruct the state of the system at any point in the past.
- **Drawbacks**: High complexity and steep learning curve.

## 4. Serverless Architecture
- **Concept**: Building and running applications without managing infrastructure. It goes beyond just FaaS (Functions as a Service like AWS Lambda) and includes using fully managed third-party services for databases (like DynamoDB or Fauna), authentication (Auth0 or Firebase), and storage (S3).
- **Benefits**: Near-infinite automatic scaling, zero server maintenance, and you only pay for exactly what you use.
