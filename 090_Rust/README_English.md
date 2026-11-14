# A Comprehensive, Practical Rust Handbook

[Persian version](README_Persian.md) · [Choose a language](README.md)

This directory provides a learning path from your first Rust program to advanced topics. Read the lessons in order, run the corresponding examples, and solve the exercises before opening the solutions. All source code, sample data, projects, and resources for this course live here.

Prerequisites: a basic understanding of variables, functions, and the terminal. C/C++ experience is not required. Core examples use Edition 2024 and APIs available in Rust 1.85. Install the latest stable toolchain for the optional web project because its dependencies may require a newer compiler. An edition is not a compiler version.

## Quick start

Follow [installation on Windows, Linux, macOS, and WSL](lessons/002_installation_English.md), then open a terminal in this directory:

```bat
cmd /c rustc --version
cmd /c cargo --version
cmd /c cargo run -p rust-lessons --bin 001_basics
cmd /c cargo run -p inventory
cmd /c cargo run -p log-search -- ERROR projects/001_log_search/data/sample.log
cmd /c cargo test --workspace --offline
```

The first example starts with `Total: 600, shipping: 80`. The inventory demo reports `3500` cents and `3` remaining items. The search project returns error lines 2 and 4.

General commands use `cmd /c` for Windows. On Linux and macOS, run the same Cargo commands without that prefix. Platform-specific setup commands are labeled in the installation lesson. Unless stated otherwise, relative commands run from the `090_Rust` root.

## Learning path

| Lesson | Subject | Practical example or outcome |
| --- | --- | --- |
| [001](lessons/001_introduction_English.md) | What Rust is and where it fits | Choose a language for a requirement |
| [002](lessons/002_installation_English.md) | Installation and environment | Windows, Linux, macOS, WSL |
| [003](lessons/003_cargo_English.md) | rustc, Cargo, and tools | Build, run, test, and document |
| [004](lessons/004_basics_English.md) | Syntax, types, and control flow | [Shipping costs](examples/src/bin/001_basics.rs) |
| [005](lessons/005_ownership_English.md) | Ownership, Move, Copy, Drop | [Name normalization](examples/src/bin/002_ownership.rs) |
| [006](lessons/006_borrowing_English.md) | Borrowing, references, slices | [Discount prices](examples/src/bin/003_borrowing.rs) |
| [007](lessons/007_lifetimes_English.md) | Lifetimes and borrowed data | [Parse a header](examples/src/bin/004_lifetimes.rs) |
| [008](lessons/008_models_patterns_English.md) | Structs, enums, patterns | [Orders](examples/src/bin/005_models.rs), [HTTP status](examples/src/bin/006_patterns.rs) |
| [009](lessons/009_collections_unicode_English.md) | Collections and Unicode | [Word counts](examples/src/bin/007_collections.rs), [strings](examples/src/bin/008_strings.rs) |
| [010](lessons/010_errors_English.md) | Option, Result, errors | [Validate a port](examples/src/bin/009_errors.rs) |
| [011](lessons/011_traits_generics_English.md) | Generics, traits, polymorphism | [Notification channels](examples/src/bin/010_traits.rs) |
| [012](lessons/012_closures_iterators_English.md) | Closures and iterators | [Process prices](examples/src/bin/011_iterators.rs) |
| [013](lessons/013_modules_workspace_English.md) | Modules, crates, workspaces, features | Organization of this course |
| [014](lessons/014_testing_English.md) | Unit, integration, doc tests | Search and inventory tests |
| [015](lessons/015_smart_pointers_English.md) | Box, Rc, Arc, interior mutability | [A tree without ownership cycles](examples/src/bin/012_smart_pointers.rs) |
| [016](lessons/016_threads_English.md) | Threads, Mutex, Send/Sync | [Shared counter](examples/src/bin/013_threads.rs) |
| [017](lessons/017_channels_atomics_English.md) | Channels, backpressure, atomics | [Bounded queue](examples/src/bin/014_channels.rs), [atomic counter](examples/src/bin/020_atomics.rs) |
| [018](lessons/018_async_English.md) | Futures, async/await, Tokio, cancellation | [Future](examples/src/bin/019_futures.rs), web project |
| [019](lessons/019_macros_English.md) | macro_rules and procedural macros | [Build a list](examples/src/bin/015_macros.rs) |
| [020](lessons/020_advanced_types_English.md) | Typestate, Pin, GATs, advanced types | [Article states](examples/src/bin/016_advanced_types.rs), [conversions](examples/src/bin/021_conversions.rs) |
| [021](lessons/021_unsafe_ffi_English.md) | unsafe, FFI, layout | [Split a slice safely](examples/src/bin/017_unsafe.rs) |
| [022](lessons/022_io_networking_English.md) | Files, streams, CLI, networking | [Process logs](examples/src/bin/018_streaming_io.rs) |
| [023](lessons/023_serde_database_English.md) | JSON, APIs, databases | Axum project and SQLx extension path |
| [024](lessons/024_wasm_embedded_English.md) | WASM, embedded, no_std | Specialized lab plans |
| [025](lessons/025_performance_English.md) | Memory costs and optimization | Analyze the projects |
| [026](lessons/026_security_deployment_English.md) | Security, release, CI | Delivery checklist |
| [027](lessons/027_troubleshooting_English.md) | Common compiler errors | Diagnose and fix |
| [028](lessons/028_projects_English.md) | Build projects step by step | CLI, inventory, HTTP API |
| [029](lessons/029_exercises_English.md) | Progressive exercises | Verifiable acceptance criteria |
| [030](lessons/030_solutions_English.md) | Solutions and reasoning | Reference implementations |
| [031](lessons/031_glossary_resources_English.md) | Glossary, review, resources | Continue learning |

## Structure and dependencies

- `lessons/`: numbered lessons in separate `_English.md` and `_Persian.md` files, with examples, pitfalls, and exercises.
- `examples/`: one package containing 21 independent programs, selected using `--bin`.
- [Project 001: log search](projects/001_log_search/README_English.md): streaming I/O, errors, CLI, tests.
- [Project 002: inventory](projects/002_inventory/README_English.md): domain logic, overflow, preserving state on failure.
- [Project 003: async API](projects/003_async_api/README_English.md): Tokio, Axum, JSON, bounded queues, HTTP tests.
- [Validation guide](VALIDATION_English.md): commands and verification limits in the authoring environment.

The core workspace has no external dependencies and can build offline after the toolchain is installed. The web project has an independent workspace, so you can begin without downloading web libraries. Project data stays separate from other topics in this repository.

## Suggested study schedule

Week one: lessons 1-8 and their examples. Week two: lessons 9-15 and log search. Week three: lessons 16-23 and the inventory and API projects. Week four: specialized topics, exercises, and rewriting a small tool you actually use. Each day, predict an output, run the program, and add a boundary case to your tests.

This course covers the core and advanced subject areas, but does not replace documentation for every standard-library API, operating system, embedded platform, or database. Follow each lesson's official references for more depth. Installation and web API guidance were checked against [Rust installation](https://rust-lang.org/install/), [rustup](https://rust-lang.github.io/rustup/), [Tokio](https://tokio.rs/tokio/tutorial), and [Axum](https://docs.rs/axum/0.8/axum/).
