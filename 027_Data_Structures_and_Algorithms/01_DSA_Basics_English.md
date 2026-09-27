# Data Structures and Algorithms (DSA)

## What is it?
Data structures are specific ways of organizing and storing data in a computer so it can be accessed and modified efficiently. Algorithms are the step-by-step procedures used to perform calculations, data processing, and automated reasoning tasks. 

## Big O Notation
Big O notation is used in Computer Science to describe the performance or complexity of an algorithm.
- **O(1) [Constant]**: Execution time stays the same regardless of data size (e.g., getting an item from an array by index).
- **O(log n) [Logarithmic]**: Highly efficient. The data set is halved on each iteration (e.g., Binary Search).
- **O(n) [Linear]**: Execution time grows directly in proportion to the data size (e.g., a simple loop).
- **O(n^2) [Quadratic]**: Inefficient. Execution time grows exponentially (e.g., nested loops).

## Key Data Structures
1. **Arrays/Lists**: Storing items contiguously in memory. Good for quick read access.
2. **Hash Tables (Maps/Dictionaries)**: Key-value stores that offer O(1) average time complexity for lookups.
3. **Stacks & Queues**: 
   - Stack: LIFO (Last In, First Out) - like a stack of plates.
   - Queue: FIFO (First In, First Out) - like a line at a grocery store.
4. **Trees**: Hierarchical structures (e.g., Binary Search Trees). Used heavily in databases for indexing.
5. **Graphs**: Nodes connected by edges. Used for social networks, GPS mapping, and recommendation engines.

## Why is it important?
While you may not write a custom sorting algorithm from scratch in a typical backend job, understanding DSA helps you choose the right tools. For example, knowing that an Array lookup is slower than a Hash Map lookup can save your application from crashing under heavy load. Furthermore, it is a primary requirement for passing technical interviews at top tech companies.
