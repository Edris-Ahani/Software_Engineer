# Memory Management & Garbage Collection

## The Stack vs The Heap
Whenever a program runs, it uses RAM to store data. This memory is divided into two main areas:
1. **The Stack**: Fast, rigid, and organized. It stores local variables, function calls, and pointers. When a function finishes, its Stack frame is instantly and automatically destroyed. You don't have to manage it.
2. **The Heap**: Slower, vast, and disorganized. It stores dynamic, large objects (e.g., an array of 10,000 users or an instantiated Class object). Because these objects can live across multiple functions, they are not automatically deleted when a function ends.

## The Memory Leak Problem
If you create objects in the Heap and never delete them, your program will slowly consume all available RAM until the OS forcefully kills it (Out Of Memory Error / OOM). In languages like C or C++, the developer must manually free the memory (e.g., `free()` or `delete`). If they forget, it's a memory leak.

## Garbage Collection (GC)
Modern languages (Java, C#, JavaScript, Python, Go) handle this automatically via a **Garbage Collector**. 
- The GC is a background process that periodically scans the Heap. 
- It uses algorithms like **Mark-and-Sweep**: It starts from the "root" variables (currently active in the Stack) and "marks" every object in the Heap they point to. Any object in the Heap that is *not* marked is considered "unreachable" (garbage). The GC then "sweeps" (deletes) those objects to free up RAM.

## The Trade-off
While GC prevents memory leaks and makes programming easier, it introduces **"Stop-The-World" pauses**. When the GC runs a heavy sweep, it literally pauses the execution of your application for a few milliseconds (or longer in bad cases), which can cause latency spikes in real-time or high-frequency trading systems. This is why systems demanding ultra-low latency often use C, C++, or Rust (which uses a unique Ownership model instead of a GC).
