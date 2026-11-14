# 002 - Installing Rust on Different Operating Systems

[Persian version](002_installation_Persian.md) · [Contents](../README_English.md) · [Previous](001_introduction_English.md) · [Next](003_cargo_English.md)

Goal: install a toolchain, linker, and quality tools, then build a program. Seeing a `rustc` version alone is insufficient; a successful `cargo run` also checks the linker. These are installation instructions. Creating this handbook does not install anything on your machine.

## Native Windows: MSVC

1. Download `rustup-init.exe` for x64 or ARM64 from the [official Rust installation page](https://rust-lang.org/install/). Check your architecture under Settings > System > About.
2. Install MSVC prerequisites using the [official rustup guide](https://rust-lang.github.io/rustup/installation/windows-msvc.html). In Visual Studio Installer, select **Build Tools for Visual Studio**, the **Desktop development with C++** workload, the MSVC tools for your architecture, and a Windows SDK. VS Code alone does not install a linker.
3. Run `rustup-init.exe` and select the default stable installation with the MSVC ABI. An x64 machine normally uses `x86_64-pc-windows-msvc`. GNU is a separate route for particular MinGW/MSYS2 requirements; avoid mixing the two environments without a reason.
4. Close and reopen the terminal, then run in Command Prompt or PowerShell:

```bat
cmd /c rustup show
cmd /c rustc --version
cmd /c cargo --version
cmd /c where rustc
cmd /c where cargo
```

Tools normally live in `%USERPROFILE%\.cargo\bin`. If commands are not found, check the user PATH and open a new terminal. For `link.exe not found`, verify the C++ workload and SDK; if necessary, use the Visual Studio Developer Command Prompt.

## Linux

On Debian/Ubuntu, install build tools first. System packages may require administrator privileges:

```bash
sudo apt update
sudo apt install build-essential curl ca-certificates
```

On Fedora:

```bash
sudo dnf install gcc gcc-c++ make curl ca-certificates
```

Install rustup using your ordinary account:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. "$HOME/.cargo/env"
rustup show
rustc --version
cargo --version
```

This downloads and executes the official script. If your environment does not allow directly executing downloaded scripts, save and inspect it first. Mixing a distribution-managed Rust installation with rustup can select the wrong version; check `command -v rustc`.

## macOS: Intel and Apple Silicon

Install Command Line Tools, then rustup:

```bash
xcode-select --install
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. "$HOME/.cargo/env"
rustup show
rustc --version
cargo --version
```

Apple Silicon normally uses `aarch64-apple-darwin`; Intel uses `x86_64-apple-darwin`. A terminal running under Rosetta may detect a different architecture. Check native terminal execution and `uname -m` before installing. Xcode tools provide native compiler/linker support.

## Windows with WSL

WSL is a separate Linux environment. Install Rust inside the distribution using the Linux steps. Windows `cargo.exe` does not replace Linux Cargo. WSL is optional for this course. If you choose it, prefer keeping your checkout and build output in the Linux filesystem and install native dependencies there. The [Microsoft guide](https://learn.microsoft.com/en-us/windows/dev-environment/rust/setup) explains native Windows and WSL setup.

## Verify a complete installation

In a practice location that does not already contain `hello_rust`, run on Windows:

```bat
cmd /c cargo new hello_rust --edition 2024
cmd /c cargo run --manifest-path hello_rust/Cargo.toml
```

Expect `Hello, world!`. On Unix, omit `cmd /c`. This creates your own practice project; use a location under `scratch/` to keep exercises within this course directory.

## Daily tools and version management

```bat
cmd /c rustup component add rustfmt clippy
cmd /c rustup update stable
cmd /c rustup doc --book
cmd /c rustup target list --installed
```

In VS Code, install the official **rust-analyzer** extension and open a folder containing `Cargo.toml`. Debugging also requires an extension and debugger appropriate to your OS. Stable is sufficient; use nightly only for a specific feature or tool.

For team reproducibility, record an exact tested version in `rust-toolchain.toml` after a successful build. The moving name `stable` does not freeze future results. Allow disk space for the compiler, libraries, and `target` build directory.

**Final check:** run `cmd /c cargo run -p rust-lessons --bin 001_basics` from the course root. If it fails, see [troubleshooting](027_troubleshooting_English.md).

Sources: [Rust installation](https://rust-lang.org/install/), [Windows MSVC prerequisites](https://rust-lang.github.io/rustup/installation/windows-msvc.html), [installation in the Rust Book](https://doc.rust-lang.org/book/ch01-01-installation.html).
