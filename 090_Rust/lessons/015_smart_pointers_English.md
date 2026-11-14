# 015 - Smart Pointers and Interior Mutability

[Persian version](015_smart_pointers_Persian.md) · [Contents](../README_English.md) · [Previous](014_testing_English.md) · [Next](016_threads_English.md)

An ordinary reference does not own its data. A smart pointer may manage ownership, count owners, or control access in addition to pointing to data. Start by deciding the ownership model.

| Type | Role | Important limitation |
| --- | --- | --- |
| `Box<T>` | Single ownership with indirection | Does not provide shared ownership |
| `Rc<T>` | Shared single-threaded ownership | Non-atomic reference count; not Send |
| `Arc<T>` | Shared ownership with atomic counting | Does not automatically make T thread-safe |
| `Cell<T>` | Mutation through shared access by replacing values | No long-lived direct borrow of the inner value |
| `RefCell<T>` | Runtime-checked borrowing | Incompatible borrows can panic |
| `Mutex<T>` / `RwLock<T>` | Coordinated access across threads | Waiting and deadlocks remain possible |
| `Weak<T>` | Non-owning reference to Rc/Arc data | Upgrade can fail |

## Box and recursive types

```rust
enum List {
    Item(u32, Box<List>),
    End,
}
```

Without indirection, the size of List would depend recursively on itself. Box introduces a fixed-size pointer into the layout. For ordinary sequences, Vec often has better locality and simplicity than linked lists. This is a lesson about type size, not a default recommendation to build lists.

## RefCell keeps the borrowing rules

```rust
use std::cell::RefCell;
let count = RefCell::new(0_u32);
{
    let mut value = count.borrow_mut();
    *value += 1;
}
assert_eq!(*count.borrow(), 1);
```

Drop the guard before taking an incompatible borrow. try_borrow and try_borrow_mut return errors rather than panicking. RefCell is not a way to share mutable data across threads. UnsafeCell underlies interior mutability, but direct use requires a precise safety contract.

## Ownership cycles

A parent can own its children, but if a child also strongly owns its parent, neither count may reach zero. [Example 012](../examples/src/bin/012_smart_pointers.rs) stores children as `Rc<Node>` and parents as `Weak<Node>`. After drop(root), the surviving child can no longer upgrade its parent reference.

```bat
cmd /c cargo run -p rust-lessons --bin 012_smart_pointers
```

Output is `root -> child`; assertions check that the parent is gone. Deref provides pointer-like access, while Drop releases resources. Deref coercion also explains convenient conversions from &String to &str.

**Exercise:** calculate root and child strong counts at each step. Explain why changing Weak to Rc reintroduces a leak even when all application code is safe Rust.

Sources: [Smart Pointers](https://doc.rust-lang.org/book/ch15-00-smart-pointers.html), [Arc](https://doc.rust-lang.org/std/sync/struct.Arc.html).
