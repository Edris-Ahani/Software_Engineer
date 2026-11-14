# 031 - Glossary, Review, and Official Resources

[Persian version](031_glossary_resources_Persian.md) · [Contents](../README_English.md) · [Previous](030_solutions_English.md)

| Term | Practical meaning |
| --- | --- |
| Ownership | Responsibility for a value and its lifetime |
| Move | Ownership transfer, not necessarily a deep copy |
| Borrow | Access without acquiring ownership |
| Lifetime | Reference validity; annotations express relationships |
| Slice | A length-carrying view without independent ownership |
| RAII / Drop | Resource release when owner or guard ends |
| Trait | A type capability contract |
| Generic | A parameterized algorithm or type |
| Monomorphization | Generating code for concrete generic types |
| Dyn dispatch | Runtime implementation selection through trait objects |
| Interior mutability | Controlled mutation through shared references |
| Send / Sync | Safe transfer/sharing contracts between threads |
| Future / Poll | Async work and readiness state |
| Executor / Runtime | Task advancement and async execution facilities |
| Backpressure | Propagating consumer capacity constraints to producers |
| Pin / Unpin | Movement contracts for address-sensitive data |
| FFI / ABI | Cross-language calls and binary contracts |
| Crate / Package | Compilation unit / manifest-defined collection |
| Workspace | Shared management of multiple packages |
| MSRV | Minimum supported compiler version |

## Review questions

**Is Rust object-oriented?** Structs, impls, and traits provide encapsulation and polymorphism. Class inheritance is not its main model; enums and composition are important design tools.

**Is all data on the stack?** No. String, Vec, Box, and many other types can allocate on the heap. Ownership and storage location are separate concepts.

**Is Arc a Mutex?** No. Arc shares ownership; Mutex coordinates access. `Arc<RefCell<T>>` is not by itself a multi-threaded solution.

**Does async mean parallel?** No. Futures can advance on one thread. CPU parallelism requires separately considering execution and core counts.

**Is clone always expensive?** Cost depends on the type. String normally copies its buffer, while Arc changes an owner count.

**Can safe Rust leak or deadlock?** Yes. Memory guarantees do not replace logical correctness or resource bounds.

**When are explicit lifetimes needed?** When API reference relationships are not covered by elision, or a struct/view depends on borrowing; not for every variable.

## Further resources

- [The Rust Book](https://doc.rust-lang.org/book/): primary language instruction to complement each lesson.
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/): short, testable examples.
- [Standard Library](https://doc.rust-lang.org/std/): precise std API contracts, errors, and complexities.
- [Rust Reference](https://doc.rust-lang.org/reference/): detailed language syntax, types, and semantics.
- [Rust Edition Guide](https://doc.rust-lang.org/edition-guide/): edition differences and migration.
- [Cargo Book](https://doc.rust-lang.org/cargo/): features, workspaces, profiles, dependencies, publishing.
- [rustup Book](https://rust-lang.github.io/rustup/): toolchains, targets, installation requirements.
- [Rustlings](https://github.com/rust-lang/rustlings): small exercises with deliberate errors.
- [Tokio](https://tokio.rs/tokio/tutorial): runtime, channels, select, shutdown.
- [Serde](https://serde.rs/): serialization and data modeling.
- [Axum](https://docs.rs/axum/0.8/axum/): extractors, routing, state, responses.
- [Rustonomicon](https://doc.rust-lang.org/nomicon/): advanced unsafe contracts, after the fundamentals.
- [Embedded Rust](https://docs.rust-embedded.org/book/): hardware, no_std, bare-metal development.

Read documentation offline after installing with rustup:

```bat
cmd /c rustup doc --book
cmd /c rustup doc --std
cmd /c rustup doc --reference
```

After this course, build a small tool you actually use, document its API and errors, and measure its resources. Then deepen one path: backend, systems, WASM, or embedded, according to your project.
