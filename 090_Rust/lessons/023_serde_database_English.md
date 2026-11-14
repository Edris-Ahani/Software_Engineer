# 023 - JSON, Web APIs, and Databases

[Persian version](023_serde_database_Persian.md) · [Contents](../README_English.md) · [Previous](022_io_networking_English.md) · [Next](024_wasm_embedded_English.md)

Separate HTTP transport, domain rules, and storage. A public DTO need not be the internal model or database row. This separation lets you preserve an API while replacing persistence details.

## Serde and validation

Serialize exposes Rust values to serializers; Deserialize constructs values from data. JSON is one possible format, not the definition of Serde. In this project, Axum's `Json<T>` extractor handles the HTTP/JSON boundary.

```rust
use serde::{Deserialize, Serialize};
#[derive(Deserialize)]
struct CreateTask { title: String }
#[derive(Serialize)]
struct TaskView { id: u64, title: String, completed: bool }
```

This snippet requires Serde dependencies and belongs in the web project. Successful deserialization establishes shape, not semantic validity: blank titles, sales capacity, authorization, and permitted values need additional validation.

## API flow

```text
POST /tasks -> Json<CreateTask> -> validate title -> lock short-lived store
            -> allocate checked ID -> insert -> 201 + Json<Task>
PATCH /tasks/{id} -> lookup -> completed = true -> 200
```

The [implementation](../projects/003_async_api/src/lib.rs) trims titles, limits scalar-value count, caps bodies at 8 KiB, and limits storage to 1,000 tasks. Internal errors do not expose lock details or internal state. HTTP tests run without a network port.

```bat
cmd /c cargo test --manifest-path projects/003_async_api/Cargo.toml
```

Storage is in memory and disappears on restart. A local Mutex does not establish database transactions or consistency across replicas.

## Extending to PostgreSQL or SQLite

Choose SQLx runtime, TLS, and backend features using its [official documentation](https://docs.rs/sqlx/). Bind query parameters; concatenating user input into SQL risks injection. A PostgreSQL pattern is:

```sql
UPDATE products
SET available = available - $1
WHERE sku = $2 AND available >= $1
RETURNING available;
```

Validate that quantity is positive and representable by the column type. If no row returns, decide how the API distinguishes missing products from insufficient stock. Use transactions and database constraints for multi-table invariants. A separate SELECT followed by an UPDATE can oversell under concurrency.

Create a pool once for the application, not per request. Design connection limits, timeouts, migrations, indexes, N+1 behavior, bounded retries, and idempotency together. Never put connection secrets in repository files or logs. SQLx query macros may require an online schema or offline metadata. Database integration is an extension plan, not part of the runnable in-memory project.

**Exercise:** design a storage adapter that reports a missing task without depending on StatusCode. Map that result to 404 in the handler, and test domain behavior without HTTP.

Sources: [Serde](https://serde.rs/), [Axum](https://docs.rs/axum/0.8/axum/), [SQLx](https://docs.rs/sqlx/). The database extension requires a separately configured database.
