# 017 - Channels, Backpressure, and Atomics

[Persian version](017_channels_atomics_Persian.md) · [Contents](../README_English.md) · [Previous](016_threads_English.md) · [Next](018_async_English.md)

Instead of sharing data, transfer message ownership. mpsc means multiple producers and one consumer. channel has no explicit queue bound, so memory can grow if consumption is slow. sync_channel(capacity) bounds the queue and blocks the producer when full.

[Example 014](../examples/src/bin/014_channels.rs) sends five messages through capacity two. Main consumes while the producer runs. Joining the producer before consuming could make the producer wait for queue space while main waits for the producer.

```bat
cmd /c cargo run -p rust-lessons --bin 014_channels
```

Expect jobs `job-1` through `job-5` in order. Iteration finishes after every sender is dropped. A forgotten sender clone can prevent completion. send and recv also report failure when the opposite end closes.

## Backpressure is a product decision

When full, a queue can wait, reject work, or deliberately drop it under an explicit contract. More capacity does not fix a slow consumer; it delays the symptom. Budget active tasks, message sizes, and timeouts together with queue capacity.

Tokio's mpsc::channel uses send().await so waiting for capacity need not block an OS thread. The [async queue example](../projects/003_async_api/src/bin/001_bounded_jobs.rs) sums five jobs to 15 with timeouts.

## Atomicity and ordering

An atomic operation avoids partial observations or lost updates for that operation. It does not turn a multi-field business operation into a transaction. A stock-and-price invariant needs a mutex or an appropriate transactional contract.

[Example 020](../examples/src/bin/020_atomics.rs) uses fetch_add for an independent counter:

```bat
cmd /c cargo run -p rust-lessons --bin 020_atomics
```

Expect `Completed: 4000`. Relaxed is appropriate here because the counter does not publish other data, and main reads after joining the workers.

| Ordering | Educational meaning |
| --- | --- |
| Relaxed | Atomic value access without general ordering of other data |
| Release / Acquire | Appropriate observation of a release can establish ordering and visibility of related data |
| AcqRel | Combined acquire/release roles for suitable operations |
| SeqCst | Stronger global ordering for SeqCst operations; does not fix a wrong algorithm |

Lock-free compare_exchange can use different success and failure orderings. Do not introduce such an algorithm without a proof and suitable verification tools. A Mutex is often clearer and more reliable initially.

**Exercise:** compare queue capacities zero, one, and two. Explain why a single AtomicBool cannot replace a multi-step state machine by itself.

Sources: [std::sync::mpsc](https://doc.rust-lang.org/std/sync/mpsc/), [Atomic Ordering](https://doc.rust-lang.org/std/sync/atomic/enum.Ordering.html), [Tokio Channels](https://tokio.rs/tokio/tutorial/channels).
