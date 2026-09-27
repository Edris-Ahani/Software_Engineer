# Concurrency vs Parallelism

## Concurrency (The Juggler)
**Concurrency is about *managing* multiple tasks at once.**
Imagine a juggler with one hand juggling 3 balls. The juggler is only touching one ball at any precise microsecond, but they switch between the balls so fast that it *looks* like they are handling all three simultaneously. 
- In programming, this is a **Single-Core CPU** quickly switching context between Task A, Task B, and Task C.
- When Task A is waiting for a database response (I/O wait), the CPU doesn't sit idle; it immediately pauses Task A and switches to work on Task B.
- **Example**: Node.js and its Event Loop. Node runs on a single thread but can handle 10,000 concurrent network requests perfectly by juggling them.

## Parallelism (The Team)
**Parallelism is about *executing* multiple tasks at the exact same time.**
Imagine having 3 jugglers, each juggling 1 ball. They are physically doing the work at the exact same time, completely independent of each other.
- In programming, this requires a **Multi-Core CPU**. Core 1 computes Task A, while Core 2 computes Task B simultaneously.
- **Example**: Video rendering or training AI models. You split the image into 4 pieces and 4 CPU cores process them at the exact same moment.

## Summary
- **Concurrency**: Juggling multiple things because some tasks involve waiting (Network, DB, Disk). Good for I/O-heavy applications (Web Servers).
- **Parallelism**: Doing multiple things physically at once. Good for CPU-heavy applications (Image Processing, Machine Learning).
