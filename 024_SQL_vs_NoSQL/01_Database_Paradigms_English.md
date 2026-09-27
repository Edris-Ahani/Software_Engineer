# Database Paradigms: SQL vs NoSQL

## What is it?
When designing a backend, choosing the right database is crucial. Databases are generally divided into two main categories: Relational (SQL) and Non-Relational (NoSQL).

## 1. SQL (Relational Databases)
- **Structure**: Data is stored in tables with strict schemas (rows and columns).
- **Relations**: Tables are linked to each other using Foreign Keys.
- **Properties (ACID)**:
  - *Atomicity*: A transaction is all-or-nothing.
  - *Consistency*: Data must always be valid according to defined rules.
  - *Isolation*: Concurrent transactions don't interfere with each other.
  - *Durability*: Once a transaction is committed, it remains saved even in a system failure.
- **Examples**: PostgreSQL, MySQL, Microsoft SQL Server, Oracle.
- **Best For**: Systems requiring complex queries, strict data integrity (like financial apps), and clear relationships.

## 2. NoSQL (Non-Relational Databases)
- **Structure**: Data can be stored in various ways without a fixed schema (e.g., JSON documents, Key-Value pairs, Graphs).
- **Properties (BASE)**:
  - *Basically Available*: The system guarantees availability.
  - *Soft state*: The state of the system could change without input (due to eventual consistency).
  - *Eventual consistency*: The system will eventually become consistent once it stops receiving input.
- **Types & Examples**:
  - *Document*: MongoDB, CouchDB.
  - *Key-Value*: Redis, DynamoDB.
  - *Column-Family*: Cassandra, HBase.
  - *Graph*: Neo4j.
- **Best For**: Rapid development with unstructured data, massive horizontal scalability, real-time analytics, and caching.

## The Choice
You don't always have to choose just one. Many modern systems use a **Polyglot Persistence** approach: using PostgreSQL for the main transactional data, Redis for caching, and MongoDB for unstructured product catalogs.
