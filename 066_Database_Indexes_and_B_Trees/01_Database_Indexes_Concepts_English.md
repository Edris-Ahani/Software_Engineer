# Database Indexes & B-Trees

## What is an Index?
If you read a 1000-page book to find every mention of the word "Apple", you have to read every single page (a Table Scan). If the book has an **Index** at the back, you look up "Apple", see it's on pages 45 and 90, and jump straight there. A database index does exactly the same thing.

## How do they work? (The B-Tree)
Most relational databases (like PostgreSQL and MySQL) use a **B-Tree** (Balanced Tree) data structure for their indexes. 
- A B-Tree keeps data sorted and allows searches, sequential access, insertions, and deletions in logarithmic time `O(log N)`.
- When you query `SELECT * FROM users WHERE age = 30`, the database traverses the B-Tree index. Because it is a balanced tree, finding the exact row out of a billion records takes only a few hops (often just 3 or 4 disk reads), rather than scanning a billion rows.

## The Trade-offs
Indexes are not free:
1. **Slower Writes**: Every time you `INSERT`, `UPDATE`, or `DELETE` a row, the database must also update the B-Tree index. Too many indexes will make your write operations incredibly slow.
2. **Storage Space**: Indexes are copies of data organized as trees. They consume additional disk space and RAM.
- **Rule of Thumb**: Only index columns that are frequently used in `WHERE`, `JOIN`, or `ORDER BY` clauses.
