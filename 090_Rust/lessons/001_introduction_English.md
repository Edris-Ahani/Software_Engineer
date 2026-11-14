# 001 - What Is Rust, and Where Is It Useful?

[Persian version](001_introduction_Persian.md) · [Contents](../README_English.md) · [Next: installation](002_installation_English.md)

Rust is a compiled language with a static type system. Before execution, source becomes a program for a particular target. Its defining feature is ownership and borrowing: in safe code, the compiler checks that references do not outlive their data and that incompatible concurrent memory access cannot occur. This does not require a mandatory, general-purpose garbage collector.

No GC does not mean no allocation. `String`, `Vec`, and `Box` can allocate on the heap. Scope exit and `Drop` release resources. `Rc` and `Arc` use reference counting; cycles of strong references can still leak memory.

## Problems Rust can address

| Domain | Practical problem | Why Rust fits | Cost or limitation |
| --- | --- | --- | --- |
| Command-line tools | Log search or large-file conversion | Native executable and memory control | Build for each target |
| Network services | Many connections waiting for I/O | Async and allocation control | Runtime and cancellation complexity |
| Infrastructure and systems | Storage engines, agents, parsers | Resource costs and layout control | Operating-system knowledge needed |
| WebAssembly | Heavy computation in a browser | WASM output and JavaScript integration | Data transfer across the JS/WASM boundary |
| Embedded | Microcontroller firmware | `no_std` and hardware control | Board-specific targets and tooling |
| Shared libraries | Move a hot path into native code | C ABI and explicit error handling | Precise ownership contracts at the FFI boundary |

The three projects in this course demonstrate a CLI, business logic, and an HTTP service. See the [Rust website](https://rust-lang.org/) and [application areas](https://www.rust-lang.org/what) for official context.

## Choosing a language

Python and JavaScript often make prototyping faster. Rust detects more issues before execution, but ownership takes time to learn. Go offers a simpler model for many services, with GC as part of execution. C/C++ offer low-level control; Rust expresses many memory-use contracts in its type system. Choose based on the team, libraries, resource requirements, and integration with existing code.

Rust does not guarantee freedom from deadlocks, logic errors, SQL injection, unbounded memory use, or business-level races. `unsafe` and FFI dependencies are important boundaries of its safety guarantees.

## How the first program runs

```text
Source files -> rustc checks types and borrowing -> native executable -> OS
Cargo -> dependency resolution + build orchestration + tests + docs
rustup -> toolchains + targets + components
```

These tools have different jobs. Most everyday development uses Cargo. After installation, run the shipping-cost example from the course root:

```bat
cmd /c cargo run -p rust-lessons --bin 001_basics
```

The first line is `Total: 600, shipping: 80`. The calculation has typed inputs and a numeric output. Later lessons show how to represent invalid states and errors through types.

**Exercise:** choose a tool from your daily work. Describe its input, output, memory constraints, and library needs. Explain why Rust fits, or why its learning cost is not justified yet.
