# 026 - Security, CI, and Delivery

[Persian version](026_security_deployment_Persian.md) · [Contents](../README_English.md) · [Previous](025_performance_English.md) · [Next](027_troubleshooting_English.md)

Memory safety matters, but does not replace authentication, authorization, validation, or resource limits. This localhost teaching API has no login, TLS, persistence, or multi-user access control. Those boundaries must be designed before practical deployment.

## Dependencies and data

Dependencies can execute build scripts or procedural macros. Minimize their count and features, review maintenance and licenses, and retain application lockfiles. Install cargo-audit and cargo-deny following official sources and inspect the dependency graph. An empty advisory report does not prove there are no vulnerabilities.

Validate input shape, domain, and size. HTTP needs body, concurrency, deadline, and rate policies. A log parser also needs a maximum line size: streaming alone does not prevent a multi-gigabyte line. The current CLI does not enforce that bound.

Do not log tokens, passwords, sensitive bodies, or secret-bearing URLs. Public errors should help callers without disclosing internals. Request IDs and operation durations are usually more useful than dumping complete payloads.

## Delivery checks

From the course root on Windows:

```bat
cmd /c cargo fmt --all -- --check
cmd /c cargo clippy --workspace --all-targets --offline -- -D warnings
cmd /c cargo test --workspace --offline
cmd /c cargo test --workspace --doc --offline
cmd /c cargo fmt --manifest-path projects/003_async_api/Cargo.toml -- --check
cmd /c cargo clippy --manifest-path projects/003_async_api/Cargo.toml --all-targets -- -D warnings
cmd /c cargo test --manifest-path projects/003_async_api/Cargo.toml
```

After generating and retaining both workspace lockfiles, use --locked in CI. Omit cmd /c on Linux/macOS. For cross-platform software, a real Windows/Linux/macOS matrix exposes linker, path, and line-ending differences.

## Delivering a binary

Build release for the intended target, smoke-test in an environment close to production, and check native shared-library/runtime requirements. A native executable is not automatically independent of the OS. Adding a rustup target does not install every linker or SDK.

Get secrets from deployment configuration or a secret manager. Run with limited privileges and define logging, health checks, and resource budgets. Shutdown should stop accepting work and collect active jobs within a deadline. In-memory data is lost on restart; persistence needs suitable storage.

## Record the build

Record compiler version, target, lockfile, features, and build command. Associate artifacts with their commit and pipeline. For public crates, review SemVer, licensing, documentation, and public API. These examples use publish = false to prevent accidental package publication.

**Exercise:** choose three current API risks and design a concrete response to each: data persistence, authorization, and rate limits. Changing the implementation language alone fixes none of them automatically.

Sources: [Cargo Lockfile](https://doc.rust-lang.org/cargo/guide/cargo-toml-vs-cargo-lock.html), [RustSec cargo-audit](https://github.com/rustsec/rustsec/tree/main/cargo-audit), [cargo-deny](https://embarkstudios.github.io/cargo-deny/).
