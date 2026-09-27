# Concurrency vs Parallelism

## What is it?
As applications scale, they need to handle multiple tasks at the same time. Understanding how modern backend languages handle multitasking is crucial. There is a strict difference between Concurrency and Parallelism.

## 1. Concurrency (Dealing with many things at once)
- **Concept**: Two or more tasks start, run, and complete in overlapping time periods. They don't necessarily run at the *exact same microsecond*. 
- **Analogy**: One cook making a salad and baking a cake. The cook chops veggies, puts the cake in the oven, and while the cake is baking, finishes the salad. Only one cook, but two tasks are progressing.
- **Tools**: `async/await` in JavaScript/Python, the Node.js Event Loop. 
- **Best For**: I/O Bound tasks (waiting for a database query to return, waiting for an API response, reading a file). 

## 2. Parallelism (Doing many things at once)
- **Concept**: Two or more tasks execute at the exact same physical time on multiple CPU cores.
- **Analogy**: Two cooks in the kitchen. One chops veggies while the other mixes the cake batter simultaneously.
- **Tools**: Multi-threading (Java, C#), Multiprocessing (Python).
- **Best For**: CPU Bound tasks (image processing, video encoding, complex mathematical calculations).

## 3. Goroutines (Go Language)
- Go (Golang) revolutionized concurrency with **Goroutines**. Instead of mapping every task to a heavy Operating System Thread (which takes a lot of memory), Go uses "lightweight threads" managed by the Go runtime. 
- You can spin up 100,000 goroutines on a basic laptop without crashing it, making Go incredibly powerful for highly concurrent backend systems like web servers and network proxies.
