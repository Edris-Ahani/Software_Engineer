# Database Transactions & ACID Properties

## What is a Transaction?
A transaction is a sequence of database operations (inserts, updates, deletes) treated as a single logical unit of work. If a transaction succeeds, all changes are saved (Committed). If any part of it fails, the entire transaction is rolled back as if nothing ever happened.

## The ACID Properties
For a database to reliably handle transactions (like a financial ledger), it must guarantee four properties, known as ACID:

1. **Atomicity ("All or Nothing")**: A transaction cannot be partially completed. If a bank transfer involves deducting $100 from Account A and adding $100 to Account B, and the server crashes after the deduction but before the addition, Atomicity guarantees the deduction will be rolled back.
2. **Consistency**: The database must go from one valid state to another. If there is a rule (constraint) that an account balance cannot drop below zero, a transaction attempting to do so will be aborted.
3. **Isolation**: Concurrent transactions running at the same time must not interfere with each other. If two people try to withdraw the last $100 from an account at the exact same millisecond, Isolation ensures they are processed sequentially, preventing a double-withdrawal.
4. **Durability**: Once a transaction is successfully committed, the changes are permanent and will survive a catastrophic system failure (like a power outage). The data is safely written to non-volatile storage (disk/SSD).
