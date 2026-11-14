# 025 - Performance, Memory, and Measurement

[Persian version](025_performance_Persian.md) · [Contents](../README_English.md) · [Previous](024_wasm_embedded_English.md) · [Next](026_security_deployment_English.md)

Rust gives control over costs but does not fix a poor algorithm. Establish metrics first: latency, throughput, peak memory, allocations, and binary size. Inputs must represent real data and comparisons must use equivalent build profiles.

## Analyzing the examples

| Example | Time | Extra memory and notes |
| --- | --- | --- |
| Slice discount | O(n) | O(1), in place |
| Word count | Proportional to text with expected-average hash lookups | O(k) distinct words; output ordering is a separate step |
| Log search | Line traversal; contains cost depends on line and query lengths | O(L) longest line, independent of total file size |
| BTreeMap inventory | O(log p) lookup/insertion for p products | O(p), plus key storage |
| API listing | O(t) tasks and their title lengths | O(t) output cloning, with a task-count bound |

Ignore-ASCII-case search allocates a lowercase version of each line. It is simple but may create extra allocation. Benchmark before changing it; general Unicode normalization is a different problem.

## Optimization process

1. Establish correctness and boundary behavior.
2. Build release and measure fixed inputs.
3. Profile time or allocation to locate the cost.
4. Make one change, remeasure, and rerun tests.

```bat
cmd /c cargo build -p log-search --release --offline
cmd /c cargo run -p log-search --release -- ERROR projects/001_log_search/data/sample.log
```

The five-line sample is a smoke check, not a meaningful benchmark. Exclude compilation from runtime measurement. Warm-up, filesystem caches, and sample count affect results.

## Common hidden costs

- Cloning Strings or Vecs in hot loops.
- Building a collection only to sum it once.
- Contended locks or guards held during I/O.
- Unbounded tasks and queues that grow memory.
- Recreating network/database connections per operation.
- Choosing linked lists over Vec without an access-pattern reason.

Vec::with_capacity can reduce reallocations when size is predictable, but excessive capacity retains memory. Iterators often compile to efficient loops. Zero-cost abstraction does not mean every allocation or dynamic dispatch is free.

Consider [Criterion](https://docs.rs/criterion/) for benchmarks and std::hint::black_box to prevent elimination of benchmark work. Profiling tools depend on your OS. Change LTO, codegen units, or panic strategy only after measurement and examining build-time and behavioral effects; more flags do not guarantee speed.

**Exercise:** generate a large log with a fixed seed, send results to an appropriate sink, and compare read_to_string memory use with streaming. Verify equivalent output and I/O error behavior too.

Sources: [Cargo Profiles](https://doc.rust-lang.org/cargo/reference/profiles.html), [black_box](https://doc.rust-lang.org/std/hint/fn.black_box.html).
