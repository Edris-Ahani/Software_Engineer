# 011 - Generics, Traits, and Polymorphism

[Persian version](011_traits_generics_Persian.md) · [Contents](../README_English.md) · [Previous](010_errors_English.md) · [Next](012_closures_iterators_English.md)

Generics describe algorithms without fixing a particular type; traits describe required capabilities. Without a bound, the compiler cannot assume T supports comparison or display.

```rust
fn larger<T: Ord>(left: T, right: T) -> T {
    if left >= right { left } else { right }
}
assert_eq!(larger(10, 20), 20);
```

Use where clauses for multiple bounds. A trait can have default method implementations, associated types, and associated constants. Iterator's associated type Item specifies its element type for each implementation.

## Static or dynamic dispatch?

[Example 010](../examples/src/bin/010_traits.rs) defines a notifier trait with email and SMS adapters. The generic `notify<N: Notifier>` is monomorphized for concrete types. `Vec<Box<dyn Notifier>>` holds different implementations in one collection and dispatches through a vtable.

| Choice | Suitable for | Consequence |
| --- | --- | --- |
| Generic or input impl Trait | Types known at compile time | Inlining opportunities; possible code-size growth |
| `&dyn Trait` | Borrowing different implementations | Dynamic dispatch without requiring Box |
| `Box<dyn Trait>` | Owning a hidden implementation | Usually allocation and dynamic dispatch |
| Return-position impl Trait | Hiding one concrete return type | Branches must return the same concrete type |

Returning impl Trait does not allow an arbitrary different concrete type in every branch. Use an enum or trait object for that requirement.

```bat
cmd /c cargo run -p rust-lessons --bin 010_traits
```

Output includes `Email: Order confirmed` and `Service restored` for both channels. The adapters only build text; they do not send real email or SMS.

## Constraints and contracts

Not all traits are dyn-compatible. Generic methods or certain direct Self return signatures require different design or a Self: Sized restriction. Clone is not generally a directly usable trait object. This subject was formerly called object safety.

Coherence and orphan rules restrict implementing an external trait for an external type: usually your crate must own the trait or an appropriate type, and coverage rules still apply. A newtype such as UserId(u64) both marks a domain boundary and provides a local type for implementations.

Traits are not class inheritance. Supertraits require capabilities, while composition often gives a clearer design. A small trait can isolate I/O for service tests; do not introduce an interface for every simple struct without a need.

**Exercise:** add a file notifier, initially just producing text. Then make a mock that records messages for tests. Explain why cloning String and Arc have different costs.

Sources: [Generics and Traits](https://doc.rust-lang.org/book/ch10-00-generics.html), [Dyn Compatibility](https://doc.rust-lang.org/reference/items/traits.html#dyn-compatibility).
