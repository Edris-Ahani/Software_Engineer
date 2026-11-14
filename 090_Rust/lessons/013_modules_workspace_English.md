# 013 - Modules, Crates, Workspaces, and Features

[Persian version](013_modules_workspace_Persian.md) · [Contents](../README_English.md) · [Previous](012_closures_iterators_English.md) · [Next](014_testing_English.md)

A module provides namespacing and visibility, not a deployment boundary. mod pricing declares a module in the module tree; use shortens a path. pub exposes publicly, pub(crate) within the crate, and pub(super) to the parent module. Keep data private until access is needed.

```text
src/lib.rs             -> pub mod pricing;
src/pricing.rs         -> pub fn calculate(...)
src/main.rs            -> use my_package::pricing::calculate;
```

crate:: starts at the crate root, super:: at the parent, and self:: at the current module. pub use can expose a short, stable API while hiding internal paths. A separate file does not become a module until declared in the tree.

## Organization of this course

The [search library](../projects/001_log_search/src/lib.rs) processes text, while main handles arguments, files, and exit status. Tests can pass Cursor without real files or subprocesses. [Inventory](../projects/002_inventory/src/lib.rs) has no terminal or HTTP dependency.

The root workspace shares build output and a lockfile. resolver = "3" improves Rust-version-aware dependency resolution; it does not prove API compatibility or all dependency MSRVs. The async project is explicitly excluded and has its own workspace.

```bat
cmd /c cargo metadata --no-deps --format-version 1
cmd /c cargo check --workspace --offline
cmd /c cargo check --manifest-path projects/003_async_api/Cargo.toml
```

## Features and cfg

Cargo features activate optional capabilities and are generally unified additively across the dependency graph. Do not treat them as mutually exclusive incompatible modes without explicit design. cfg attributes conditionally compile code; cfg! only produces a boolean, so names and types in its branches still need to be valid.

```rust
#[cfg(target_os = "windows")]
fn platform_label() -> &'static str { "windows" }

#[cfg(not(target_os = "windows"))]
fn platform_label() -> &'static str { "other" }
```

cfg(test) limits unit-test-only code. Use PathBuf::join rather than hard-coding platform separators.

## build.rs and publishing

build.rs runs during a build and can generate bindings or native code. Dependencies and build scripts are executable code, not just data. Core examples do not need one. For a public library, visibility, SemVer, features, MSRV, licensing, and documentation form part of its public contract.

**Exercise:** extract SKU validation into an internal module without changing the inventory public API or integration tests. Split into multiple crates only when growth justifies it.

Sources: [Module System](https://doc.rust-lang.org/book/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html), [Cargo Features](https://doc.rust-lang.org/cargo/reference/features.html), [Workspaces](https://doc.rust-lang.org/cargo/reference/workspaces.html).
