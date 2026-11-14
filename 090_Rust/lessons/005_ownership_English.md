# 005 - Ownership, Move, Copy, and Drop

[Persian version](005_ownership_Persian.md) · [Contents](../README_English.md) · [Previous](004_basics_English.md) · [Next](006_borrowing_English.md)

In the ownership model, a value has an owner, and ownership can change during execution. When the owner leaves scope, the value is normally dropped. Together with borrowing, this prevents references from being used after their data becomes invalid.

`String` owns a text buffer. Assigning it to another variable does not automatically deep-copy the text; it transfers ownership. The physical storage location and compiler optimizations are distinct from ownership semantics.

```rust
let first = String::from("report");
let second = first;
println!("{second}");
```

After the second line, using `first` is no longer permitted. This intentionally invalid snippet demonstrates E0382; put it only in a practice project:

```compile_fail
let first = String::from("report");
let second = first;
println!("{first} {second}");
```

## When is a value copied?

Types implementing `Copy`, including many numeric types, remain usable after assignment. `String` and `Vec` are not Copy. For String, `clone()` creates another buffer; for Rc and Arc, it normally increments an ownership count. Clone cost depends on the type.

```rust
let original = String::from("invoice");
let duplicate = original.clone();
let count = 3_u32;
let copied = count;
assert_eq!(original, duplicate);
assert_eq!(count, copied);
```

A Copy type must also implement Clone. A type with a custom Drop implementation cannot be Copy: implicit copying would conflict with resource-release responsibility.

## Function boundaries

A String parameter takes ownership; an `&str` parameter borrows text. Returning String transfers ownership to the caller. In [example 002](../examples/src/bin/002_ownership.rs), `normalize_name` consumes its input and returns a new value. A clone preserves the original for display. If consumption is unnecessary in a real API, accept `&str` instead.

```bat
cmd /c cargo run -p rust-lessons --bin 002_ownership
```

Output includes `Normalized: alice` and two `5` values. Main does not use the `original` binding after its move.

## RAII and other resources

Drop is not only about heap memory: files, lock guards, and connection wrappers can release resources too. `drop(guard)` releases earlier; do not call `Drop::drop` directly. `mem::forget` deliberately skips destruction and is not a routine ownership workaround. Abrupt process termination or aborting panics do not guarantee destructor execution.

**Pitfall:** adding clone to silence every compiler error. First decide whether the caller should retain ownership, then choose borrowing or a deliberate move.

**Exercise:** change normalization to accept `&str`, and print the original without cloning it. Explain why the lowercase output can still allocate.

Sources: [Ownership](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html), [Drop](https://doc.rust-lang.org/std/ops/trait.Drop.html).
