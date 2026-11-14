# 014 - Effective Testing in Rust

[Persian version](014_testing_Persian.md) · [Contents](../README_English.md) · [Previous](013_modules_workspace_English.md) · [Next](015_smart_pointers_English.md)

Tests should check observable behavior or important contracts. Inventory tests do not merely inspect an error: they verify stock afterwards, detecting hidden mutation on overflow or overselling.

| Test kind | Location | Scope |
| --- | --- | --- |
| Unit | A cfg(test) module | Internal functions or components |
| Integration | tests/*.rs | Public API as used by an outside consumer |
| Doc test | Code in documentation comments | Usability of documented examples |

```rust
fn discounted(price: u32, discount: u32) -> u32 {
    price.saturating_sub(discount)
}
#[cfg(test)]
mod tests {
    use super::discounted;
    #[test]
    fn clamps_discount_at_zero() {
        assert_eq!(discounted(20, 30), 0);
    }
}
```

## Run project tests from the course root

```bat
cmd /c cargo test --workspace --offline
cmd /c cargo test -p inventory --offline
cmd /c cargo test -p log-search --offline
cmd /c cargo test -p rust-lessons --bin 017_unsafe --offline
cmd /c cargo test --workspace --doc --offline
cmd /c cargo test --manifest-path projects/003_async_api/Cargo.toml
```

The last command needs external dependencies. API tests use Router::oneshot without opening a port and check HTTP status and response body. Search tests use Cursor instead of a real file and a failing writer to simulate BrokenPipe.

## Cases worth testing

- Empty input, zero, and valid boundary values.
- Invalid input, malformed UTF-8, and writer failures.
- Unchanged state when an operation fails.
- Repeated operations and idempotency, where promised.
- Failure paths independent of ordinary success.

should_panic fits an actual panic contract; it should not justify panicking on normal user input. Tests normally run in parallel, so environment variables, fixed filenames, and global state can cause flakiness. Use synchronization or runtime-controlled time rather than arbitrary sleeps.

Compiling tests does not execute every example main. Run binaries with assertions separately or use the course checker. Also, cargo test --all-targets does not replace explicit doc-test coverage when that is required.

For complex libraries, consider proptest for properties, cargo-fuzz for fuzzing, and Miri for some unsafe-related errors. These tools need separate installation and sometimes nightly. Passing them is not a complete correctness proof.

**Exercise:** read tests for exact stock depletion, a second reservation, and arithmetic overflow. Add a writer that fails on flush and verify the library propagates the failure.

Sources: [Testing](https://doc.rust-lang.org/book/ch11-00-testing.html), [cargo test](https://doc.rust-lang.org/cargo/commands/cargo-test.html).
