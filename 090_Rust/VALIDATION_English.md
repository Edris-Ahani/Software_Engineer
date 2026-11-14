# Validating the Handbook and Running Examples

[Persian version](VALIDATION_Persian.md) · [Course contents](README_English.md)

## Reproducible checks

With Node.js available, run content-only checks from the `090_Rust` root:

```bat
cmd /c node --check scripts/check.mjs
cmd /c node scripts/check.mjs --content-only
```

The script checks local links, balanced code fences, RTL wrappers in Persian documents, absence of Persian characters in source files and code blocks, complete English/Persian document pairs, identical code blocks across each pair, and the numbering of 31 lessons per language, 21 core examples, and 3 projects. These are not Rust compilation, full TOML parsing, formatting, live website checks, or a proof of program correctness.

After installing Rust, rustfmt, and clippy, run:

```bat
cmd /c node scripts/check.mjs
cmd /c node scripts/check.mjs --with-web
```

The first command runs core workspace check, fmt, clippy, tests, every one of the 21 example binaries, and both core demos. The second also checks the optional web project, HTTP tests, and async queue, and may download dependencies. It never starts the long-running HTTP server. Every command has a timeout; failures produce a nonzero final exit status. Missing Cargo is also an explicit failure.

Node is not required by the Rust projects themselves. You can run commands manually:

```bat
cmd /c cargo fmt --all
cmd /c cargo fmt --all -- --check
cmd /c cargo clippy --workspace --all-targets --offline -- -D warnings
cmd /c cargo test --workspace --offline
cmd /c cargo run -p rust-lessons --bin 001_basics
cmd /c cargo run -p inventory
cmd /c cargo run -p log-search -- ERROR projects/001_log_search/data/sample.log
cmd /c cargo fmt --manifest-path projects/003_async_api/Cargo.toml
cmd /c cargo test --manifest-path projects/003_async_api/Cargo.toml
```

The two fmt commands without `--check` change formatting. The other commands verify behavior or formatting. `cargo test` does not execute the main function of every example; use the script or run each binary individually. Compare results with the relevant lesson and project README.

## Authoring environment results

Neither `rustc` nor `cargo` was found in PATH or the usual user installation location. Rust compilation, rustfmt, clippy, Rust tests, and downloading/building web dependencies were therefore not performed. No tools were installed on the machine.

- `node --check` passed for the verification script.
- Content validation passed for 77 Markdown files: 36 complete language pairs and 5 short language selectors. The pairs include 31 lessons per language and the overview, validation report, and 3 project guides. Numbering, local links, identical code blocks, language conventions, and text direction were checked.
- The full runner passed content checks and then stopped with exit code 1 because Cargo was unavailable. No Rust tests ran; this is not recorded as a successful Rust test run.

Follow [installation](lessons/002_installation_English.md), then rerun the checks. The web manifest uses dependency ranges rather than exact patch versions; retain its lockfile after the first successful resolution and verification. The core workspace has no external dependencies.
