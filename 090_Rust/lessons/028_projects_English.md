# 028 - Three Practical Projects, Step by Step

[Persian version](028_projects_Persian.md) · [Contents](../README_English.md) · [Previous](027_troubleshooting_English.md) · [Next](029_exercises_English.md)

The aim is not to memorize ready-made files. Write each project's contract, implement it with the guide, and compare your solution with the reference afterwards.

## Project 001: log search

Contract: a nonempty query and text file are inputs; matching lines with one-based numbers are output. No match is not an I/O failure and has its own exit status.

1. Accept BufRead and Write to make processing independently testable.
2. Read lines with enumerate and propagate read/write errors with the question mark.
3. Introduce SearchOptions and reject empty queries.
4. Add explicitly named ASCII case-insensitive behavior.
5. Keep main limited to argument parsing, file opening, and exit mapping.
6. Test empty input, CRLF, malformed UTF-8, and a failing writer.

```bat
cmd /c cargo run -p log-search -- ERROR projects/001_log_search/data/sample.log
cmd /c cargo test -p log-search --offline
```

See the [guide and expected output](../projects/001_log_search/README_English.md). Extend with line limits, --count, multiple files, or a standard argument parser. Every option needs an explicit contract and tests.

## Project 002: inventory without partial changes

Contract: unique SKUs, positive quantities, sufficient stock, and no price overflow. Failed reservations leave stock unchanged.

1. Define actionable InventoryError variants.
2. Keep Product fields private and expose only required getters.
3. Check quantity, stock, and checked_mul before reducing stock.
4. Reject duplicate SKUs without replacing the old product.
5. Test both the failure and the resulting state.

```bat
cmd /c cargo run -p inventory
cmd /c cargo test -p inventory --offline
```

See the [inventory guide](../projects/002_inventory/README_English.md). This is a single-process in-memory operation. Multiple replicas require database consistency and transactions. Here reserve means immediate stock deduction; expiration, payment, and rollback are not implemented.

## Project 003: HTTP API and async queue

Contract: health, task creation, listing, reading, and completion. Define title validity, capacity, JSON responses, and HTTP errors.

1. Separate input/output DTOs.
2. Build the router in lib for socket-free tests.
3. Keep memory lock sections short and never hold a guard across await.
4. Bound request bodies, title length, and stored task count.
5. Keep main responsible for listening and shutdown.
6. Test with oneshot first, then run the server manually as described.

```bat
cmd /c cargo test --manifest-path projects/003_async_api/Cargo.toml
cmd /c cargo run --manifest-path projects/003_async_api/Cargo.toml --bin 001_bounded_jobs
```

See the [API guide, curl requests, and limitations](../projects/003_async_api/README_English.md). Data is lost on restart; the teaching server is not ready for public production deployment.

## Readiness for a personal project

You should be able to identify owners, fix borrow errors without unnecessary cloning, represent invalid input through Result, test I/O boundaries, and explain concurrency limits. If those are unclear, rebuild log search by hand before starting a larger project.
