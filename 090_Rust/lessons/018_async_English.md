# 018 - Futures, async/await, and Tokio

[Persian version](018_async_Persian.md) · [Contents](../README_English.md) · [Previous](017_channels_atomics_English.md) · [Next](019_macros_English.md)

Calling an async fn creates a Future; its body does not advance until polled. Each poll returns Ready(value) or Pending. After Pending, a Waker tells the runtime when to try again. await yields control when necessary; it does not necessarily create a thread.

[Example 019](../examples/src/bin/019_futures.rs) contains only immediately ready futures and polls once:

```bat
cmd /c cargo run -p rust-lessons --bin 019_futures
```

Expect `Ready: 42`. The no-op waker is not a general executor and is unsuitable for sockets, timers, or pending work. Use a runtime for real asynchronous work.

## Real execution with Tokio

The optional [API project](../projects/003_async_api/README_English.md) uses Tokio and Axum. The tokio::main attribute prepares a runtime. The queue example has a producer, capacity-two queue, worker, and timeouts:

```bat
cmd /c cargo run --manifest-path projects/003_async_api/Cargo.toml --bin 001_bounded_jobs
```

After dependencies download, expect `Processed total: 15`. When the producer ends, its sender drops and the worker observes the end of the stream. Dropping JoinSet aborts remaining tasks, preventing abandoned tasks on this example's error paths.

## Sequence, concurrency, and task lifetime

Two consecutive awaits normally advance work sequentially. tokio::join! advances several futures in one task; tokio::spawn creates an independent task, usually requiring Send + static. A borrowed caller-local value may not satisfy that contract. Transfer ownership or design an appropriate scope and lifetime.

Await JoinHandles so errors and panics do not disappear. Dropping a spawned task's JoinHandle normally does not cancel the task. Dropping an operation's future may cancel that operation, but already-performed I/O and state changes are not rolled back.

## Timeout, select, and cancellation safety

A timeout can react promptly only if work gives the runtime an opportunity to run the timer. A CPU loop without yielding is not forcibly stopped just by wrapping its future in timeout. tokio::select! waits for multiple events and drops losing branches; check what dropping a partially completed operation means before using it there.

For shutdown, stop admitting work, close senders, collect active work with a deadline, then release resources. A Stream is an asynchronous sequence, analogous to an iterator waiting for input; its consumption also needs bounds and cancellation design.

## Blocking work

Do not directly run thread::sleep, blocking file I/O, or long CPU computation on runtime workers. Use spawn_blocking with a concurrency bound for blocking work, and an appropriate thread pool for parallel CPU computation. A running spawn_blocking operation generally cannot be stopped with a simple abort.

In the web project, a standard Mutex protects only short in-memory operations, and no guard crosses an await. Reconsider designs that hold locks across awaits; use an async mutex when actually required. Async locks still permit logical deadlocks.

**Exercise:** deliberately slow the queue worker and examine timeouts and sender closure. Compare five sequential jobs with five tasks limited by a capacity-two semaphore.

Sources: [Tokio Tutorial](https://tokio.rs/tokio/tutorial), [Cancellation](https://tokio.rs/tokio/tutorial/select), [Future](https://doc.rust-lang.org/std/future/trait.Future.html).
