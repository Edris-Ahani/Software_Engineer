# 024 - WebAssembly, Embedded, and no_std

[Persian version](024_wasm_embedded_Persian.md) · [Contents](../README_English.md) · [Previous](023_serde_database_English.md) · [Next](025_performance_English.md)

These paths require different execution environments and tools. The core workspace targets your host OS. Do not run this lesson's target commands against the entire workspace or assume every standard crate builds for every target.

## WebAssembly

WASM is a portable execution format, not direct access to all browser APIs. JavaScript/DOM integration normally uses wasm-bindgen and web-sys. Server-side WASI uses different targets and host APIs.

Add the browser-oriented target:

```bat
cmd /c rustup target add wasm32-unknown-unknown
```

In a separate practice crate with crate-type = ["cdylib"], export a function:

```rust
#[unsafe(no_mangle)]
pub extern "C" fn square(value: u32) -> u32 {
    value.saturating_mul(value)
}
```

A host can load this simple numeric export. Strings, Vecs, and JavaScript objects need binding contracts. Build only that practice crate:

```bat
cmd /c cargo build --manifest-path scratch/wasm_demo/Cargo.toml --target wasm32-unknown-unknown --release
```

You must create this exercise manifest; it is not an included ready-made project. Producing a wasm file is only one step. Define loading, async initialization, buffer transfer, browser features, and packaging. Copying large amounts of data across JS/WASM can outweigh computational gains.

## Embedded

#![no_std] removes the automatic std dependency while retaining core. alloc can provide Box and Vec where an allocator exists. no_std does not necessarily mean no heap or no OS. Bare-metal programs must define entry, panic handling, memory layout, and board drivers.

A practical board-specific path:

1. Identify CPU architecture, board, debug probe, and supported target from that board's documentation.
2. Install its target with rustup. thumbv7em-none-eabihf fits some Cortex-M devices, not every board.
3. Start with a suitable template and HAL; linker scripts and flashing procedures depend on the hardware.
4. Run an LED or UART example, then add scheduling, interrupts, and shared data.

Hardware registers differ from ordinary memory. Volatile access is not a substitute for synchronization or atomicity. A safe HAL hides some raw-pointer obligations behind appropriate APIs.

## Cross-compilation

rustup target add installs target libraries; it does not automatically install every target's linker, SDK, C headers, or flashing tools. Successfully building for a target does not mean its tests execute on the host.

**Exercise:** compare a WASM image-processing module with sensor firmware: I/O, memory, and release tooling. Without hardware, test the pure algorithm on your host.

Sources: [wasm32-unknown-unknown](https://doc.rust-lang.org/rustc/platform-support/wasm32-unknown-unknown.html), [wasm-bindgen](https://wasm-bindgen.github.io/wasm-bindgen/), [Embedded Rust Book](https://docs.rust-embedded.org/book/).
