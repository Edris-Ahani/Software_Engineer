# 027 - Common Errors and How to Fix Them

[Persian version](027_troubleshooting_Persian.md) · [Contents](../README_English.md) · [Previous](026_security_deployment_English.md) · [Next](028_projects_English.md)

Read the first compiler error from the top; later errors may follow from it. Build a minimal reproducer and identify the owner, the borrow's last use, and the expected type.

| Symptom | Likely cause | Action |
| --- | --- | --- |
| rustc/cargo not recognized | PATH or incomplete installation | New terminal, where cargo, check .cargo/bin |
| link.exe not found | MSVC tools or SDK absent | Install C++ workload; check Developer Command Prompt |
| cc not found on Unix | Native linker/toolchain absent | Install OS development tools |
| Dependency requires newer Rust | Higher dependency MSRV | Update stable or deliberately select compatible versions |
| E0382 | Use after move | Borrow, reorder, or clone for a reason |
| E0502 | Shared and mutable borrow overlap | Finish reference use before mutation |
| E0499 | Incompatible mutable borrows | Shorten scope or use split_at_mut |
| E0597 / E0515 | Reference outlives owner | Return owned data or caller-owned storage |
| E0308 | Type mismatch | Inspect expressions, Option/Result, trailing semicolons |
| Future is not Send | Guard or Rc crosses await | Shorter scope, correct ownership and synchronization |
| Channel program never finishes | Another sender remains alive | Inspect all sender owners and join order |
| API cannot bind port | Port busy or invalid address | Inspect bind address and port ownership |

## Diagnostic tools

```bat
cmd /c rustc --explain E0382
cmd /c rustc --explain E0502
cmd /c rustup show
cmd /c cargo check --workspace --offline
cmd /c cargo tree --manifest-path projects/003_async_api/Cargo.toml
```

If the dependency-free core unexpectedly needs downloads in offline mode, check whether you selected the web manifest instead. If the compiler itself is missing, rustup may need network access to install it; Cargo offline mode only concerns dependency resolution.

## Overlapping borrow example

This intentionally fails:

```compile_fail
let mut values = vec![1, 2];
let first = &values[0];
values.push(3);
println!("{first}");
```

push may relocate storage. If you only need the numeric value, let first = values[0] makes an independent Copy. If you need a view, finish using it before push. Reserving capacity does not remove the borrowing contract.

## Panic and backtrace

For one diagnostic run on Windows:

```bat
cmd /c "set RUST_BACKTRACE=1&& cargo run -p rust-lessons --bin 001_basics"
```

No panic is expected in this normal example; the command shows how to enable a backtrace for that child process. Unix uses RUST_BACKTRACE=1 cargo run ... instead. Avoid publicly disclosing backtraces containing sensitive paths or data.

**Exercise:** reproduce the invalid example under scratch and fix it in two ways: copy the number, or reorder operations. Explain why cloning the whole Vec is unnecessary.

Sources: [Rust Error Index](https://doc.rust-lang.org/error_codes/error-index.html), [Windows MSVC](https://rust-lang.github.io/rustup/installation/windows-msvc.html).
