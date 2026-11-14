# 003 - Cargo and the Development Cycle

[Persian version](003_cargo_Persian.md) · [Contents](../README_English.md) · [Previous](002_installation_English.md) · [Next](004_basics_English.md)

`rustc` compiles Rust; `rustup` manages versions and targets; Cargo coordinates packages, dependencies, builds, tests, and documentation. A package has a manifest and may contain one library and several binaries. A crate is a compilation unit. A workspace manages multiple packages together.

## Important files

| Path | Purpose |
| --- | --- |
| `Cargo.toml` | Package metadata, edition, dependencies |
| `Cargo.lock` | Resolved dependency versions; retain for applications |
| `src/main.rs` | Default binary entry point |
| `src/lib.rs` | Library API |
| `src/bin/001_example.rs` | Independent binary named `001_example` |
| `tests/` | Integration tests consuming the public API |
| `target/` | Disposable build output; keep out of Git |

The [root manifest](../Cargo.toml) has three members. Select the teaching package `rust-lessons` with `-p`. A package name need not equal its directory name. Hyphens become underscores in Rust library imports: package `log-search` is imported as `log_search`.

## Commands from the course root

```bat
cmd /c cargo check --workspace --offline
cmd /c cargo build --workspace --offline
cmd /c cargo run -p rust-lessons --bin 001_basics
cmd /c cargo test --workspace --offline
cmd /c cargo test --workspace --doc --offline
cmd /c cargo fmt --all -- --check
cmd /c cargo clippy --workspace --all-targets --offline -- -D warnings
cmd /c cargo doc --workspace --no-deps --open
cmd /c cargo build -p log-search --release --offline
```

`check` performs analysis and type checking without creating a complete executable. Use `build` or `run` to verify linker setup. `--` separates Cargo arguments from program or tool arguments. `--release` selects an optimized profile, generally increasing build time.

On Windows, the release CLI is `target/release/log-search.exe`. Linux/macOS omit `.exe`.

## Dependencies and versions

The optional API uses `tokio = "1"`, `serde = "1"`, and `axum = "0.8"`. These ranges do not pin exact patch versions; the lockfile records actual resolution. Dependencies need an initial download. `--offline` only uses cached dependencies and never downloads them. After generating and checking a lockfile, use `--locked` in CI.

```bat
cmd /c cargo tree --manifest-path projects/003_async_api/Cargo.toml
cmd /c cargo fetch --manifest-path projects/003_async_api/Cargo.toml
```

Compiler version, edition, and minimum supported Rust version (MSRV) are separate concepts. Edition 2024 first shipped in Rust 1.85, but a dependency can require a newer compiler. `rustup update stable` updates the toolchain, not your manifest's edition.

**Exercise:** create a program under `scratch/` without modifying the teaching files. Explain the differences between `cargo check`, `cargo run`, and `cargo test`. Move a function to `lib.rs` and call it from `main.rs`.

Sources: [The Cargo Book](https://doc.rust-lang.org/cargo/), [Edition 2024](https://doc.rust-lang.org/edition-guide/rust-2024/index.html).
