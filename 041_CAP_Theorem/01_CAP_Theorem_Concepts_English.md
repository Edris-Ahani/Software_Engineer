# CAP Theorem (Distributed Systems)

## What is it?
The CAP Theorem is a fundamental principle in computer science that states it is impossible for a distributed data store (like a modern clustered database) to simultaneously provide more than two out of the following three guarantees:

1. **Consistency (C)**: Every read receives the most recent write or an error. (If I update my password, and immediately try to log in, the system must know about the new password).
2. **Availability (A)**: Every request receives a (non-error) response, without the guarantee that it contains the most recent write. (The system never goes down, even if it sometimes returns slightly outdated data).
3. **Partition Tolerance (P)**: The system continues to operate despite an arbitrary number of messages being dropped or delayed by the network between nodes. (If the network cable between Server A and Server B gets cut, the database as a whole survives).

## How to choose?
In the real world of distributed systems (where data is spread across the internet), **network partitions (P) are unavoidable**. You cannot guarantee that the network will never fail. 
Therefore, you are forced to choose between **Consistency (C)** and **Availability (A)**:

- **CP (Consistency + Partition Tolerance)**: If the network fails, the database will refuse to answer requests rather than return stale data. 
  - *Example*: MongoDB, Redis, Traditional Bank Accounts (It's better to show an error than to let someone withdraw money using outdated balance info).
  
- **AP (Availability + Partition Tolerance)**: If the network fails, the database will return the best data it has, even if it might not be the most recently updated data.
  - *Example*: Cassandra, DynamoDB, Social Media Likes (If YouTube shows you 10,000 likes instead of the true 10,005 likes because a server is temporarily disconnected, nobody cares).

## Why is it important?
Understanding the CAP theorem is essential when architecting a backend. It helps you choose the right database for the right job by understanding the trade-offs between showing perfect data vs keeping the system online at all times.
