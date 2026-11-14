# 012 - Closures, Iterators, and Data Transformation

[Persian version](012_closures_iterators_Persian.md) · [Contents](../README_English.md) · [Previous](011_traits_generics_English.md) · [Next](013_modules_workspace_English.md)

A closure can capture values from its environment. Depending on usage, the compiler captures by shared borrow, mutable borrow, or ownership. move forces ownership capture; it does not by itself mean the closure only implements FnOnce.

| Trait | Invocation capability | Example behavior |
| --- | --- | --- |
| Fn | Repeated calls through shared access | Read a captured value |
| FnMut | Repeated calls through mutable access | Increment a captured counter |
| FnOnce | At least one call consuming the closure | Move a captured String into the output |

Every closure implements FnOnce; FnMut and Fn express stronger capabilities. Choose bounds based on what the caller needs.

## Iterator ownership

iter usually yields &T, iter_mut yields &mut T, and into_iter on an owned collection can transfer T. Calling into_iter on a reference does not necessarily own the elements; the receiver matters.

```rust
let values = vec![1_u32, 2, 3, 4];
let doubled: Vec<_> = values.iter().copied().filter(|value| *value % 2 == 0)
    .map(|value| value * 2).collect();
assert_eq!(doubled, [4, 8]);
assert_eq!(values.len(), 4);
```

Adapters such as map, filter, take, zip, enumerate, and flat_map are generally lazy. They need a consumer such as collect, sum, find, for_each, or a loop. Collecting into Vec allocates output storage; sum normally needs no intermediate collection.

```rust
let result: Result<Vec<u32>, _> = ["1", "2", "bad"].into_iter()
    .map(str::parse::<u32>).collect();
assert!(result.is_err());
```

[Example 011](../examples/src/bin/011_iterators.rs) computes `400`, halves prices, uses a mutable captured counter, and demonstrates a closure that consumes a captured String.

```bat
cmd /c cargo run -p rust-lessons --bin 011_iterators
```

Output includes four price labels, `calls: 4`, and `one-shot payload`. Long pipelines are not always clearer than loops. Prefer an explicit loop for complicated state or early exits.

A custom Iterator needs `next(&mut self) -> Option<Self::Item>`. For a small iterator, consider std::iter::from_fn first. Reusing an exhausted or moved iterator is different from recreating its source collection.

**Exercise:** sum only valid positive textual prices. Then write a version that fails at the first invalid value. Explain filter_map versus collecting Results.

Sources: [Closures and Iterators](https://doc.rust-lang.org/book/ch13-00-functional-features.html), [Iterator](https://doc.rust-lang.org/std/iter/trait.Iterator.html).
