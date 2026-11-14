# 019 - Declarative and Procedural Macros

[Persian version](019_macros_Persian.md) · [Contents](../README_English.md) · [Previous](018_async_English.md) · [Next](020_advanced_types_English.md)

A macro transforms tokens and generates code at compile time; a function operates on values at runtime. Prefer functions or generics when they solve the problem clearly. println! and vec! are familiar macros.

```rust
macro_rules! string_list {
    ($($value:expr),* $(,)?) => {
        vec![$(String::from($value)),*]
    };
}
let names = string_list!["api", "worker",];
assert_eq!(names.len(), 2);
```

expr matches an expression, repetition with * accepts zero or more inputs, and $(,)? accepts an optional trailing comma. Other fragments include ident, ty, path, and tt. macro_rules has hygiene rules; it is not merely pasted source text.

Run [example 015](../examples/src/bin/015_macros.rs):

```bat
cmd /c cargo run -p rust-lessons --bin 015_macros
```

Expect three Strings: api, worker, scheduler. Input expressions' evaluation order and count matter. A macro that inserts a side-effecting input multiple times can change behavior unexpectedly. Keep expansions small and understandable.

## Three procedural macro forms

| Form | Syntax | Use |
| --- | --- | --- |
| Derive | #[derive(Serialize)] | Generate trait implementations from structs/enums |
| Attribute | #[tokio::main] | Transform or extend an item |
| Function-like | custom!(...) | Custom token-to-token transformation |

Writing procedural macros normally requires a separate crate with proc-macro = true. Correct parsing and useful diagnostics are harder than text replacement; syn and quote can help. Procedural macros execute on the build host even when the output targets another platform.

In the API, Serialize and Deserialize implement data conversion. They do not enforce title semantics, capacity, or authorization. Those contracts belong in validation and handlers.

**Exercise:** try an empty list with an explicit `Vec<String>` annotation, one input, and a trailing comma. Explain how an iterator could solve the same problem and when a macro is clearer.

Sources: [Macros](https://doc.rust-lang.org/book/ch20-05-macros.html), [Procedural Macros](https://doc.rust-lang.org/reference/procedural-macros.html).
