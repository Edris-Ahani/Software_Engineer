# 007 - Understanding Lifetimes

[Persian version](007_lifetimes_Persian.md) · [Contents](../README_English.md) · [Previous](006_borrowing_English.md) · [Next](008_models_patterns_English.md)

A lifetime describes reference validity. An annotation such as `'a` expresses a relationship between references; it does not extend the data's life or keep anything alive at runtime. Elision rules often let the compiler infer the relationship.

```rust
fn first_word(text: &str) -> &str {
    text.split_whitespace().next().unwrap_or("")
}
```

The single borrowed input makes the output relationship clear. With multiple inputs and an output that may come from either, write the contract explicitly:

```rust
fn longer<'a>(left: &'a str, right: &'a str) -> &'a str {
    if left.len() >= right.len() { left } else { right }
}
```

The caller must use the output where both borrows can be valid. The signature does not say the original owners were created or destroyed together; it asks for a common valid borrowing lifetime for this call.

## A struct containing references

[Example 004](../examples/src/bin/004_lifetimes.rs) parses a header without copying the source text:

```rust
struct Header<'a> {
    key: &'a str,
    value: &'a str,
}
```

`parse_header` uses `split_once(':')` to create two views. The struct is usable while the original text remains alive and accesses remain compatible. If a header must be stored independently of its input buffer, String fields offer a simpler design at the cost of copying.

```bat
cmd /c cargo run -p rust-lessons --bin 004_lifetimes
```

Output includes `Content-Type`, `application/json`, and `Longer: ownership`. Here longer means more bytes, not more visible characters.

## Why not return a reference to a local?

This intentionally fails to compile:

```compile_fail
fn invalid<'a>() -> &'a str {
    let text = String::from("temporary");
    &text
}
```

The local owner is destroyed on return; adding `'a` cannot save it. Usually return String, or let the caller supply the storage.

## What does static mean?

`&'static str`, such as a string literal, is valid throughout the program. The bound `T: 'static` means T contains no non-static borrowed references; it does not mean the T value itself must live until program exit. An owning String can meet this bound and still be dropped earlier. This distinction matters for threads and `tokio::spawn`.

For methods with `&self`, output reference elision normally ties the result to self. If the result actually comes from a different argument, explicit lifetimes may be needed. Do not start by annotating every variable; first draw the owners and views.

**Exercise:** split `name=value` into two borrowed references. Then implement an owned version with two Strings and explain which is suitable for caching independently of the input buffer.

Source: [Validating References with Lifetimes](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html).
