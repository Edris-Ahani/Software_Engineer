# Database Sharding and Partitioning

## What is it?
When a database table grows to billions of rows (like a `users` or `tweets` table), a single database server will eventually run out of CPU, RAM, or Disk Space. **Scaling Vertically** (buying a bigger server) has physical and financial limits. The ultimate solution is **Scaling Horizontally** through Database Sharding.

## What is Sharding?
Sharding is the process of breaking up a massive database table into smaller chunks, called "shards", and spreading those chunks across multiple independent database servers.

## How it works (The Shard Key)
To shard a database, you must pick a **Shard Key** (a specific column to divide the data by).
- **Example**: Sharding by `country`. 
  - Shard 1 (Server A) stores users from the US.
  - Shard 2 (Server B) stores users from Europe.
- **Example**: Sharding by `user_id` (Hashing).
  - You run `user_id % 3`. If the result is 0, they go to Server A. If 1, Server B. If 2, Server C. This ensures a balanced distribution of data.

## The Downside of Sharding
- **Complex Queries**: If you want to run a query like `SELECT * FROM users ORDER BY age DESC LIMIT 10`, your application now has to query *every single shard*, merge the results in memory, sort them, and then pick the top 10.
- **No Joins Across Shards**: You generally cannot execute an SQL `JOIN` between a table on Server A and a table on Server B.

## Partitioning vs Sharding
- **Partitioning**: Splitting a large table into smaller tables on the *same* physical server (e.g., partitioning a `logs` table by month).
- **Sharding**: Splitting a large table across *multiple* physical servers.
