# 021 - unsafe, FFI, and Memory Contracts

[Persian version](021_unsafe_ffi_Persian.md) · [Contents](../README_English.md) · [Previous](020_advanced_types_English.md) · [Next](022_io_networking_English.md)

unsafe does not disable type checking or the borrow checker. It permits certain operations with manually upheld safety obligations, such as dereferencing raw pointers or calling unsafe functions. Violating those obligations can cause undefined behavior.

## A small wrapper with a clear contract

[Example 017](../examples/src/bin/017_unsafe.rs) demonstrates splitting a mutable byte slice. Use the standard split_at_mut in production. The wrapper checks middle, then constructs two in-bounds disjoint regions. A SAFETY comment records pointer validity, lengths, and non-overlap.

```bat
cmd /c cargo run -p rust-lessons --bin 017_unsafe
cmd /c cargo test -p rust-lessons --bin 017_unsafe --offline
```

Output is `[9, 2, 8, 4]`. Tests cover zero, the end boundary, and invalid indices. Passing tests does not establish every safety condition: alignment, provenance, initialization, and aliasing also need reasoning.

The workspace denies unsafe_op_in_unsafe_fn, requiring explicit blocks even inside unsafe functions. Small unsafe blocks are easier to review.

## FFI: crossing the Rust/C boundary

extern "C" defines an ABI, and repr(C) gives a struct a C-compatible layout contract. Neither makes String or Vec automatically interchangeable with C data. Usually pass a pointer and length, or an opaque handle, with explicit ownership and deallocation functions.

```rust
#[repr(C)]
pub struct ByteView {
    pub data: *const u8,
    pub length: usize,
}

#[unsafe(no_mangle)]
pub extern "C" fn add_saturating(left: u32, right: u32) -> u32 {
    left.saturating_add(right)
}
```

This illustrates layout and export syntax, not a complete linkable library and C header. A real build needs a crate type, header, target toolchain, and tests from C. Edition 2024 requires unsafe-attribute syntax for no_mangle; exported symbol uniqueness is part of the safety contract.

## Questions every FFI boundary must answer

- Who allocated the buffer, who releases it, and with which allocator?
- How long is the pointer valid, and what alignment and length are guaranteed?
- Is null allowed? Can callbacks run from another thread or after the call returns?
- Are errors returned through codes, handles, or buffers?
- Can a panic cross the ABI boundary? Prevent unwinding where the ABI disallows it.

For C strings, prefer CString and CStr over arbitrary NUL assumptions, and handle interior NULs. transmute is not a general-purpose conversion tool and is usually inappropriate for parsing or serialization. Unions and static mut have safety obligations too; prefer safe types and synchronization in ordinary code.

**Exercise:** describe five safety conditions from the example in your own words. Explain why a non-null pointer is not necessarily readable.

Sources: [Unsafe Rust](https://doc.rust-lang.org/book/ch20-01-unsafe-rust.html), [Rustonomicon FFI](https://doc.rust-lang.org/nomicon/ffi.html), [Edition 2024 Unsafe Attributes](https://doc.rust-lang.org/edition-guide/rust-2024/unsafe-attributes.html).
