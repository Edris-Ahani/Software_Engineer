# 008 - Structs, Enums, and Pattern Matching

[Persian version](008_models_patterns_Persian.md) · [Contents](../README_English.md) · [Previous](007_lifetimes_English.md) · [Next](009_collections_unicode_English.md)

A struct groups related fields. Private fields and constructors can enforce valid states. Methods live in an `impl`: `&self` observes, `&mut self` changes, and `self` consumes ownership. A function such as new without self is an associated function, called as `Type::new`.

```rust
#[derive(Debug)]
struct Customer {
    id: u64,
    name: String,
}
impl Customer {
    fn label(&self) -> String { format!("{}: {}", self.id, self.name) }
}
let customer = Customer { id: 1, name: "Alice".into() };
assert_eq!(customer.label(), "1: Alice");
```

Tuple structs, such as `struct UserId(u64);`, make useful newtypes. Unit structs, such as `struct Draft;`, have no fields and can represent typestate markers. `derive` generates implementations of known traits, provided the fields satisfy the necessary bounds.

## Data-carrying enums reduce invalid states

Instead of independent fields `is_paid` and `receipt: Option<String>` that can disagree, model the states:

```rust
enum Status {
    Pending,
    Paid { receipt: String },
    Cancelled,
}
```

Paid always has a receipt. In the [order example](../examples/src/bin/005_models.rs), pay only changes Pending to Paid; a second payment fails. Cancelled is a separate variant. At a library boundary, keep the status field private to enforce transitions.

```bat
cmd /c cargo run -p rust-lessons --bin 005_models
cmd /c cargo run -p rust-lessons --bin 006_patterns
```

The first prints `Order 42 paid: receipt-42`. The second prints `no response`, `client error`, and `success` in that order because it pops from the end of a Vec.

## Patterns

A match must cover every possible case. Patterns can destructure structs and tuples, use ranges, combine alternatives with `|`, add guards, ignore fields with `..`, or bind a matched value with `@`. Guards do not replace exhaustiveness checking.

```rust
let response = Some(503_u16);
let kind = match response {
    Some(code @ 500..=599) => format!("server error: {code}"),
    Some(200..=299) => String::from("success"),
    Some(_) => String::from("other"),
    None => String::from("no response"),
};
assert_eq!(kind, "server error: 503");
```

Use if let for one interesting case and while let for repetition. A let-else provides readable early exit; its else branch must diverge from that path. `match &value` can avoid moving non-Copy fields out of value.

**Exercise:** add cancel. Pending orders may be cancelled; paid orders may not. Test repeat payment and cancellation after payment. Compare the enum with several independent boolean fields.

Sources: [Structs](https://doc.rust-lang.org/book/ch05-00-structs.html), [Enums](https://doc.rust-lang.org/book/ch06-00-enums.html), [Patterns](https://doc.rust-lang.org/book/ch19-00-patterns.html).
