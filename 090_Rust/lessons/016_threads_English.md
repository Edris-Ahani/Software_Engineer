# 016 - Threads, Mutex, Send, and Sync

[Persian version](016_threads_Persian.md) · [Contents](../README_English.md) · [Previous](015_smart_pointers_English.md) · [Next](017_channels_atomics_English.md)

Concurrency means advancing multiple tasks during overlapping periods. Parallelism means executing simultaneously, usually on multiple cores. OS threads can suit CPU work, but one thread per network request carries stack and scheduling costs.

thread::spawn creates independent work. Its closure often uses move to own what it needs. Check completion and panic through JoinHandle::join; dropping a handle does not wait for the thread.

```rust
let name = String::from("worker");
let handle = std::thread::spawn(move || format!("{name} finished"));
assert_eq!(handle.join().expect("The sample worker does not panic"), "worker finished");
```

## Shared ownership with controlled mutation

`Arc<Mutex<T>>` solves two different problems: Arc shares ownership and Mutex provides exclusive access to T. The lock guard holds the lock until dropped. Keep its scope short and avoid slow I/O while holding it.

[Example 013](../examples/src/bin/013_threads.rs) starts four threads, each incrementing 1,000 times. After joining, the counter is exactly 4000. A scoped thread also borrows an array and returns its sum, 6.

```bat
cmd /c cargo run -p rust-lessons --bin 013_threads
```

Expect `Counter: 4000, scoped sum: 6`. thread::scope ensures its threads join before the scope ends, allowing suitable borrows of local data. This differs from independently spawned threads with the usual static bound.

## Send and Sync

Send means ownership can be transferred between threads. Sync means sharing &T between threads is allowed; precisely, &T is Send. These are usually auto traits derived from a type's fields. Rc and RefCell alone do not offer the required multi-threaded sharing contract. Adding unsafe impl Send just to suppress an error can make a program unsound.

## What can still fail?

The compiler rejects many memory data races, but inconsistent ordering of two locks can deadlock. Establish one lock order when workers need multiple resources. Locking the same Mutex again is not a general reentrant solution.

A panic while holding a standard Mutex may poison it, which is why lock returns Result. Recovering via into_inner is appropriate only when you can restore the data invariants. Blindly unwrapping is not a reliable recovery policy.

**Exercise:** increment in batches of 100 under each lock and compare synchronization cost. Measure release builds over enough repetitions; one accidental timing is not evidence.

Sources: [Fearless Concurrency](https://doc.rust-lang.org/book/ch16-00-concurrency.html), [thread::scope](https://doc.rust-lang.org/std/thread/fn.scope.html).
