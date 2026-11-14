# 020 - Advanced Types, Typestate, and Pin

[Persian version](020_advanced_types_Persian.md) · [Contents](../README_English.md) · [Previous](019_macros_English.md) · [Next](021_unsafe_ffi_English.md)

This lesson maps advanced concepts. Start with the runnable typestate and conversion examples. Study GATs, HRTBs, and Pin deeply when an API actually needs them.

## Newtypes, aliases, and conversions

type UserId = u64 is another name for the same type and does not distinguish it from an OrderId alias. struct UserId(u64) creates a distinct type. Use From for infallible conversion and TryFrom for fallible conversion. Implementing From normally provides the corresponding Into automatically.

[Example 021](../examples/src/bin/021_conversions.rs) rejects zero UserIds and uses `Cow<'a, str>` to allocate lowercase text only when needed:

```bat
cmd /c cargo run -p rust-lessons --bin 021_conversions
```

Expect `Ok(UserId(42))`. Cow::Borrowed reuses the input; Cow::Owned contains independent data. This example only normalizes ASCII case.

## Const generics and typestate

```rust
fn total<const N: usize>(values: [u32; N]) -> u32 { values.iter().sum() }
assert_eq!(total([1, 2, 3]), 6);
```

N is part of the array type. Stable Rust does not permit arbitrary const-generic arithmetic in every location; consult the Reference for restrictions.

[Example 016](../examples/src/bin/016_advanced_types.rs) consumes `Article<Draft>` and returns `Article<Published>`. Only the published type has a url method. PhantomData carries state information in the type system without storing an actual State value.

```bat
cmd /c cargo run -p rust-lessons --bin 016_advanced_types
```

Expect `/articles/rust`. The URL builder is illustrative, not a valid arbitrary-text slug generator. Typestate prevents calling url on a draft. An enum may fit better for dynamic states loaded from a database.

## Associated types, GATs, and HRTBs

An associated type specifies a type chosen by an implementation. A generic associated type can itself accept lifetime or type parameters, enabling views tied to the container borrow:

```rust
trait Lending {
    type Item<'a> where Self: 'a;
    fn next<'a>(&'a mut self) -> Option<Self::Item<'a>>;
}
fn accepts_any_borrow<F>(operation: F)
where F: for<'a> Fn(&'a str) -> usize,
{
    assert_eq!(operation("rust"), 4);
}
```

for<'a> is a higher-ranked bound: the operation must accept every suitable borrow lifetime, not just one particular borrow. A trait with a GAT is not automatically usable as dyn Trait; check dyn compatibility separately.

## Sized, DSTs, and Pin

str, [T], and dyn Trait are dynamically sized types, normally used behind pointers. ?Sized relaxes the implicit Sized bound. Such pointers may carry metadata such as length or a vtable; do not assume internal layout is an FFI contract.

Some futures contain references related to their own storage after polling starts. `Pin<P>`, the pointer contract, and Unpin model address-sensitive data that must not move. Box::pin is a convenient way to pin on the heap. Pin does not mean immutable data or an immovable handle; the pointee's movement under the pinning contract is the issue.

Stable Rust supports async fn in traits, but dynamic dispatch and Send bounds for returned futures need separate design. Adding async does not automatically provide a generally usable `Box<dyn Trait>`.

**Exercise:** add preview only for Draft. Try calling it after publish and explain why compilation fails.

Sources: [Advanced Types](https://doc.rust-lang.org/book/ch20-03-advanced-types.html), [Pin](https://doc.rust-lang.org/std/pin/), [Associated Items](https://doc.rust-lang.org/reference/items/associated-items.html).
