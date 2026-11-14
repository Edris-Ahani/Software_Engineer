# 006 - References, Borrowing, and Slices

[Persian version](006_borrowing_Persian.md) · [Contents](../README_English.md) · [Previous](005_ownership_English.md) · [Next](007_lifetimes_English.md)

A function that only inspects data should usually borrow it. `&T` is a shared reference; `&mut T` is an exclusive reference. While references are in use, you can have multiple shared borrows or one exclusive borrow, but not incompatible overlapping access to the same data.

```rust
fn byte_length(text: &str) -> usize { text.len() }
fn append_suffix(text: &mut String) { text.push_str(".log"); }
let mut filename = String::from("application");
let length = byte_length(&filename);
append_suffix(&mut filename);
assert_eq!(length, 11);
assert_eq!(filename, "application.log");
```

Borrowing does not extend an owner's lifetime. A reference must not outlive its data. The compiler can often end a borrow at its last use rather than the end of the enclosing block.

```rust
let mut name = String::from("api");
let view = &name;
println!("{view}");
name.push_str("-v2");
```

Using view again after the mutation would overlap shared and mutable access. Usually shorten the view's use or reorder operations rather than adding unsafe.

## A slice does not own data

`&[T]` is a sequence view carrying a length. `&mut [T]` permits element changes but cannot increase a Vec's length. Similarly, `&str` views valid UTF-8, while String owns text. An `&str` parameter accepts string literals and borrowed String values.

```rust
fn sum(values: &[u32]) -> u32 { values.iter().sum() }
let values = vec![10, 20, 30];
assert_eq!(sum(&values), 60);
assert_eq!(sum(&values[1..]), 50);
```

`&Vec<T>` is usually a more restrictive API than `&[T]`. Prefer slices unless Vec-specific capabilities are needed. Deref coercions make compatible borrowed values convenient to pass.

## Independent mutable regions

The compiler cannot always prove that two dynamic indices are independent. `split_at_mut` provides the contract that its returned slices do not overlap:

```rust
let mut values = [1, 2, 3, 4];
let (left, right) = values.split_at_mut(2);
left[0] += 10;
right[0] += 20;
assert_eq!(values, [11, 2, 23, 4]);
```

In [example 003](../examples/src/bin/003_borrowing.rs), the discount function accepts `&mut [u32]` and uses saturating subtraction to avoid going below zero. `cmd /c cargo run -p rust-lessons --bin 003_borrowing` prints `Rust: [70, 0, 270]`. In real financial logic, clamping at zero must be an explicit domain decision.

**Exercise:** mutate two halves of a slice independently. Then deliberately use a shared reference after a conflicting mutation and explain the compiler error.

Sources: [References and Borrowing](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html), [Slices](https://doc.rust-lang.org/book/ch04-03-slices.html).
