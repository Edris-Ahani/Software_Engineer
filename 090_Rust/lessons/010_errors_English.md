# 010 - Option, Result, and Error Design

[Persian version](010_errors_Persian.md) · [Contents](../README_English.md) · [Previous](009_collections_unicode_English.md) · [Next](011_traits_generics_English.md)

`Option<T>` represents absence with None and presence with Some(T). `Result<T,E>` represents success with Ok(T) and failure with Err(E). A missing map member usually fits Option; a failed file read needs error information and fits Result.

```rust
fn first_positive(values: &[i32]) -> Option<i32> {
    values.iter().copied().find(|value| *value > 0)
}
assert_eq!(first_positive(&[-1, 0, 2]), Some(2));
assert_eq!(first_positive(&[]), None);
```

## What the question mark does

For Result, `?` extracts Ok or returns early on Err. A suitable From implementation can convert the error type. For Option, it returns early on None. Conversion between Option and Result must be explicit; ok_or turns absence into a chosen error.

```rust
fn parse_nonzero(input: &str) -> Result<u16, &'static str> {
    let value = input.parse::<u16>().map_err(|_| "Invalid integer")?;
    if value == 0 { return Err("Value must not be zero"); }
    Ok(value)
}
assert!(parse_nonzero("0").is_err());
```

[Example 009](../examples/src/bin/009_errors.rs) defines typed port errors, retains the parsing error, provides readable Display output, and preserves the cause through Error::source. `From<ParseIntError>` lets the question mark perform conversion automatically.

```bat
cmd /c cargo run -p rust-lessons --bin 009_errors
```

Expect `Port: 8080`; zero and 65536 must return Err.

## Choosing an error contract

In a library, a public error enum lets callers decide by variant. Comparing error-message text is brittle. For a small binary, `Box<dyn Error>` conveniently collects different error types. Tools such as thiserror or anyhow can reduce boilerplate in larger applications, but cannot design the error boundary for you.

unwrap and expect can be justified in tests, controlled examples, or genuinely guaranteed states. User input, network operations, and files normally require handled errors. Panic generally represents an internal contract failure, not an ordinary invalid-input response. catch_unwind does not catch all failures or aborting panics.

map, and_then, unwrap_or_else, and transpose help transform combinations. Collecting an `Iterator<Item = Result<T,E>>` into `Result<Vec<T>,E>` stops at the first error.

**Exercise:** classify `abc`, `0`, `8080`, and `65536` as port inputs. Then verify that overflow in the inventory project leaves stock unchanged.

Sources: [Error Handling](https://doc.rust-lang.org/book/ch09-00-error-handling.html), [Result](https://doc.rust-lang.org/std/result/).
