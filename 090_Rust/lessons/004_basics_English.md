# 004 - Variables, Types, Functions, and Control Flow

[Persian version](004_basics_Persian.md) · [Contents](../README_English.md) · [Previous](003_cargo_English.md) · [Next](005_ownership_English.md)

A `let` binding is immutable by default. `mut` permits changing its value. Shadowing creates a new binding using `let`, and can even change the type. `const` declares a compile-time value with an explicit type. `static` provides storage with program-wide lifetime; it is not a replacement for ordinary variables.

```rust
const MAX_RETRIES: u8 = 3;
let mut retries = 0_u8;
retries += 1;
let input = "42";
let input: u32 = input.parse().expect("The sample contains a valid number");
assert_eq!(input, 42);
assert!(retries <= MAX_RETRIES);
```

## Choosing types

`i32` is signed; `u32` is unsigned. `usize` represents sizes and indices and depends on the target architecture; use fixed-width types for stable protocol identifiers. `f32` and `f64` are approximate floating-point values. Represent money with integer minor units or an appropriate decimal library. `bool` is logical, `char` is one Unicode scalar value, a tuple combines different types, and an array has a fixed length of one element type.

```rust
let point: (i32, i32) = (10, 20);
let (x, y) = point;
let values: [u32; 3] = [1, 2, 3];
let repeated = [0_u8; 16];
assert_eq!(x + y, 30);
assert_eq!(values.len() + repeated.len(), 19);
```

An `as` cast can discard information. Use `TryFrom` for untrusted values. For sensitive arithmetic, `checked_add`, `checked_mul`, and related methods expose overflow. Do not depend on differing debug/release overflow behavior.

## Expressions and statements

Rust is expression-oriented: `if` and blocks can produce values. A trailing semicolon turns the expression into a statement, usually making that block return `()`.

```rust
fn final_price(price: u32, discount: u32) -> u32 {
    price.saturating_sub(discount)
}
let label = if final_price(100, 20) > 0 { "paid" } else { "free" };
assert_eq!(label, "paid");
```

Functions have typed parameters and a return type following `->`. Use `return` for early exits; the final expression can return implicitly. An `if` condition must be a bool; numbers do not automatically become true.

## Loops

Use `for` to consume an iterator, `while` for a condition, and `loop` for repetition with explicit exit. `break` can return a value from a loop; labels can exit outer loops. `1..4` excludes 4, while `1..=4` includes it.

```rust
let mut remaining = 3;
let result = loop {
    remaining -= 1;
    if remaining == 0 { break "done"; }
};
assert_eq!(result, "done");
for value in 1..=3 { println!("{value}"); }
```

Run [example 001](../examples/src/bin/001_basics.rs) with `cmd /c cargo run -p rust-lessons --bin 001_basics`. The total is `600` and shipping is `80`.

**Pitfall:** out-of-bounds indexing panics. Use `get` for dynamic indices and inspect the Option. Do not handle ordinary user input with the examples' `expect` calls.

**Exercise:** predict shipping for an express parcel heavier than 1,000 grams. Write a sum function using `checked_add` that returns None on overflow.

Source: [Common Programming Concepts](https://doc.rust-lang.org/book/ch03-00-common-programming-concepts.html).
