# 030 - Solutions and Reasoning

[Persian version](030_solutions_Persian.md) · [Contents](../README_English.md) · [Previous: exercises](029_exercises_English.md) · [Next](031_glossary_resources_English.md)

The linked files are runnable reference solutions for the core exercises. Change inputs and explain results to confirm you understand more than how to execute the supplied programs.

| Exercise | Reference | Main idea |
| --- | --- | --- |
| 001 | [Shipping](../examples/src/bin/001_basics.rs) | if is an expression with compatible branch types |
| 002 | Snippet below | Borrow input, own output |
| 003 | [Discount](../examples/src/bin/003_borrowing.rs) | Mutable slice and saturating subtraction |
| 004 | [Header](../examples/src/bin/004_lifetimes.rs) | Output depends on the caller's buffer |
| 005 | [Order](../examples/src/bin/005_models.rs) | Data-carrying enum and validation before mutation |
| 006 | [Collections](../examples/src/bin/007_collections.rs) | entry and sorted BTreeMap display |
| 007 | [Strings](../examples/src/bin/008_strings.rs) | Bytes differ from scalar values |
| 008 | [Ports](../examples/src/bin/009_errors.rs) | Result, From, and source chains |
| 009 | [Notifier](../examples/src/bin/010_traits.rs) | Trait objects for heterogeneous collections |
| 010 | [Iterators](../examples/src/bin/011_iterators.rs) | iter and copied without consuming Vec |
| 011 | [Tree](../examples/src/bin/012_smart_pointers.rs) | Weak reverse ownership links |
| 012 | [Threads](../examples/src/bin/013_threads.rs) | Join and protected updates |
| 013 | [Channels](../examples/src/bin/014_channels.rs) | Concurrent consumption and sender closure |
| 014 | [Typestate](../examples/src/bin/016_advanced_types.rs) | publish consumes Draft ownership |
| 015 | [Unsafe wrapper](../examples/src/bin/017_unsafe.rs) | Preconditions, proof, boundary tests |
| 016 | [Inventory](../projects/002_inventory/src/lib.rs), [tests](../projects/002_inventory/tests/reservations.rs) | Validate every error before mutation |
| 017 | [Search](../projects/001_log_search/src/lib.rs), [tests](../projects/001_log_search/tests/search.rs) | I/O traits and propagated failures |
| 018 | [API](../projects/003_async_api/src/lib.rs), [tests](../projects/003_async_api/tests/http.rs) | Router tests without a port |
| 019 | [Async queue](../projects/003_async_api/src/bin/001_bounded_jobs.rs) | Capacity, timeout, JoinSet |
| 020 | [Conversions and Cow](../examples/src/bin/021_conversions.rs) | Allocate only when changing text |

## Exercise 002

```rust
fn normalize_name(name: &str) -> String {
    name.trim().to_lowercase()
}
let original = String::from("  ALICE  ");
let normalized = normalize_name(&original);
assert_eq!(normalized, "alice");
assert_eq!(original, "  ALICE  ");
```

Input is not consumed; lowercase creates owned output. If trimming alone is needed, returning &str can borrow the same buffer without allocation. Not every function needs a String result.

## Extension reasoning

**Count:** represent output mode with an enum such as Lines/Count. Processing can return a count and use the writer according to the mode. Test both output contracts and propagate flush failures.

**Multi-item reservation:** first aggregate duplicate SKUs with checked quantity addition. Without mutation, validate all products and construct a reservation plan, checking total-price addition too. Apply it only after the entire plan succeeds. External storage requires a valid transaction or appropriate atomic operations; local validation does not prevent concurrent database changes.

**Line limits:** use a bounded buffer and incremental reading. Decide whether excessive input aborts the operation or discards the remaining line. Enforce limits before unbounded allocation and test an oversized final line without a newline.

**Persistence:** isolate handlers from repositories and map domain results to status codes. Use constraints, transactions, and conditional updates. Race tests should assert no negative stock or overselling, not a particular accidental request order.

**Async:** future timeouts cannot forcibly preempt a thread occupied by a non-yielding CPU loop. Dropping a JoinHandle usually detaches the task; dropping JoinSet aborts its tasks. Aborting does not reverse completed side effects, and running spawn_blocking work has a different cancellation contract.

Valid improvements preserve outputs and error behavior. Do not claim speed without measurement or complete safety merely because a few tests pass.
