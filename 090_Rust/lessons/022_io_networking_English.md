# 022 - Files, Streams, CLIs, and Networking

[Persian version](022_io_networking_Persian.md) · [Contents](../README_English.md) · [Previous](021_unsafe_ffi_English.md) · [Next](023_serde_database_English.md)

I/O boundaries produce real failures: files disappear, UTF-8 is malformed, output closes, and sockets stop responding. Depend on traits such as BufRead and Write so processing works with both real files and memory buffers.

```rust
use std::io::{BufRead, Write};
fn copy_lines(reader: impl BufRead, mut writer: impl Write) -> std::io::Result<()> {
    for line in reader.lines() { writeln!(writer, "{}", line?)?; }
    writer.flush()
}
```

read_to_string loads the whole file. BufReader reduces small syscalls, while line-by-line processing can limit memory to the longest line. lines allocates a String per line and strips its newline. This is not a byte-for-byte copy and is unsuitable for binary files.

[Example 018](../examples/src/bin/018_streaming_io.rs) reads a Cursor and prints only `ERROR database unavailable`:

```bat
cmd /c cargo run -p rust-lessons --bin 018_streaming_io
cmd /c cargo run -p log-search -- ERROR projects/001_log_search/data/sample.log
```

The second command produces:

```text
2:ERROR payment declined
4:ERROR cache unavailable
```

## A practical CLI

The [project main](../projects/001_log_search/src/main.rs) uses args_os so filenames need not be UTF-8, while validating the textual query separately. Data goes to stdout and diagnostics to stderr. Exit code 0 means matches, 1 means no match, and 2 means an error. BrokenPipe is treated as success for pipeline compatibility.

For a larger CLI, parsers such as clap provide help, subcommands, and completion; std is enough here. Do not replace normal returns with abrupt exit calls that bypass expected destruction or flushing.

## Networking contracts

TCP is a byte stream without message boundaries. One read may return only part of a message, and one write may not consume the entire buffer. Use read_exact or write_all where their contracts fit, with explicit framing, size limits, and deadlines. Reading zero bytes normally signals EOF.

Use established libraries for HTTP and JSON. Splitting on newlines does not make a reliable HTTP parser. The API project uses Axum for routing and extraction and listens only on localhost.

Writing to a buffer or calling flush does not necessarily make data durable on disk. Durable storage needs an appropriate sync_all, temporary-file, rename, and OS policy. Even an atomic rename within a filesystem is not a complete guarantee for every power-loss scenario.

**Exercise:** test a writer that fails on flush. For malformed UTF-8, decide whether to reject the input, read binary data, or show replacement characters; that is a product contract.

Sources: [std::io](https://doc.rust-lang.org/std/io/), [std::net](https://doc.rust-lang.org/std/net/), [CLI Project](https://doc.rust-lang.org/book/ch12-00-an-io-project.html).
