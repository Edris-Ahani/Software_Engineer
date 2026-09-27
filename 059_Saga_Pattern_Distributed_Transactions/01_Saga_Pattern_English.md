# The SAGA Pattern (Distributed Transactions)

## The Problem
In a Monolithic application with a single relational database, ACID transactions are easy (e.g., `BEGIN TRANSACTION; UPDATE inventory... UPDATE orders... COMMIT;`). 
In a **Microservices Architecture**, each service has its own independent database (Database-per-Service pattern). If a customer places an order, you have to update the Order Service (DB 1), reduce stock in the Inventory Service (DB 2), and charge the user in the Payment Service (DB 3). There is no "global database" to handle an ACID transaction across three servers.

## The Solution: The SAGA Pattern
The Saga pattern manages distributed transactions by breaking them down into a sequence of smaller, local transactions. Each local transaction updates its own database and publishes a message (event) to trigger the next transaction in the Saga.

## Compensating Transactions (The Rollback)
If step 1 (Order) and step 2 (Payment) succeed, but step 3 (Inventory) fails because the item is out of stock, how do we roll back the entire system?
We can't just run SQL `ROLLBACK` because the databases are separate and the payment has already been committed. 
Instead, we execute **Compensating Transactions**: The system fires a reverse event to the Payment service saying "Refund the user", and then an event to the Order service saying "Cancel the Order".

## Choreography vs Orchestration
- **Choreography**: Like dancers knowing their own moves. Service A finishes its job and yells "I'm done!". Service B hears it, does its job, and yells "I'm done!". There is no central brain.
- **Orchestration**: Like an orchestra conductor. A central "Saga Orchestrator" service acts as a brain. It explicitly commands Service A to act, waits for the result, then commands Service B to act. If something fails, the Orchestrator explicitly commands the specific services to run their compensating (refund) transactions.
