# Project 001 - Streaming Log Search

[Persian version](README_Persian.md) · [Course](../../README_English.md) · [I/O lesson](../../lessons/022_io_networking_English.md)

Goal: process a text file without loading it entirely, find lines containing a query, and print their line numbers. The program never changes the input file and has no external dependencies.

Run all commands from the `090_Rust` root:

```bat
cmd /c cargo run -p log-search -- ERROR projects/001_log_search/data/sample.log
cmd /c cargo run -p log-search -- error projects/001_log_search/data/sample.log --ignore-ascii-case
cmd /c cargo test -p log-search --offline
```

Both run commands produce:

```text
2:ERROR payment declined
4:ERROR cache unavailable
```

## Input and output contract

Arguments are `log-search <query> <file> [--ignore-ascii-case]`. Empty queries and unknown options are rejected. Double-quote paths containing spaces. Queries must be UTF-8; paths use OsString/PathBuf. Input files must contain UTF-8 text.

Exit code 0 means a match, 1 means no match, and 2 means argument or I/O failure. Data goes to stdout; errors go to stderr. BrokenPipe is successful so a downstream consumer can close early naturally.

## Structure

- [lib.rs](src/lib.rs): SearchOptions and generic BufRead/Write processing.
- [main.rs](src/main.rs): parsing, file opening, buffers, exit status.
- [search.rs](tests/search.rs): matching, CRLF, no matches, malformed UTF-8, writer failure.
- [Sample data](data/sample.log): five-line smoke-check input.

## Limitations and extensions

Memory grows with the longest line rather than the full file; this version has no line-size limit. lines removes input newlines and output recreates them. This is not regex matching, binary search, or general Unicode normalization. Case-insensitive behavior is ASCII-only. Output already written before a later error cannot be rolled back.

Extend with count mode and a maximum line size while preserving error contracts. Start with the [project lesson](../../lessons/028_projects_English.md) to understand the design.
