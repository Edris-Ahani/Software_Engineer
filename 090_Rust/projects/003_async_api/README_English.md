# Project 003 - Task API with Tokio and Axum

[Persian version](README_Persian.md) · [Course](../../README_English.md) · [Async lesson](../../lessons/018_async_English.md)

This independent workspace uses external dependencies: Axum 0.8, Tokio 1, and Serde 1. Install the latest stable Rust. Initial builds need internet access. Manifest ranges do not freeze patch releases; retain the resolved lockfile after successful verification.

## Test and run

Commands run from the `090_Rust` root:

```bat
cmd /c cargo test --manifest-path projects/003_async_api/Cargo.toml
cmd /c cargo run --manifest-path projects/003_async_api/Cargo.toml --bin 001_bounded_jobs
```

Tests call the router in memory without opening a server or port. The queue example should print `Processed total: 15`.

To use HTTP manually, open a separate terminal and run the server. This command stays active until you stop it:

```bat
cmd /c cargo run --manifest-path projects/003_async_api/Cargo.toml
```

After `Listening on http://127.0.0.1:3000`, run in another Windows terminal:

```bat
cmd /c curl.exe -i http://127.0.0.1:3000/health
cmd /c curl.exe -i -X POST http://127.0.0.1:3000/tasks -H "Content-Type: application/json" --data-binary @projects/003_async_api/data/001_create_task.json
cmd /c curl.exe -i http://127.0.0.1:3000/tasks
cmd /c curl.exe -i -X PATCH http://127.0.0.1:3000/tasks/1
cmd /c curl.exe -i http://127.0.0.1:3000/tasks/1
```

On Unix, use curl without .exe and omit cmd /c. The JSON file avoids shell-specific escaping. Press Ctrl+C in the server terminal to request shutdown.

## Route contract

| Route | Behavior | Typical response |
| --- | --- | --- |
| GET /health | Sample health check | 200 and ok |
| POST /tasks | Create with a trimmed title | 201 and task JSON |
| GET /tasks | List ordered by ID | 200 and an array |
| GET /tasks/{id} | Read one task | 200 or 404 |
| PATCH /tasks/{id} | Set completed to true, no request body | 200 or 404 |

With an empty store, the first creation returns:

```json
{"id":1,"title":"Read Rust","completed":false}
```

After PATCH, completed is true. Repeated PATCH preserves that state. Blank titles or titles exceeding 120 scalar values return 422. JSON body extraction rejects bodies over 8 KiB with 413. Reaching 1,000 tasks returns 503. Framework extractors handle malformed JSON and invalid path types.

## Design and limitations

[lib.rs](src/lib.rs) defines routes and handlers, [main.rs](src/main.rs) handles listening/shutdown, and [HTTP tests](tests/http.rs) exercise in-memory behavior. The standard mutex protects a small store and no guard crosses an await. The [bounded queue example](src/bin/001_bounded_jobs.rs) is independent of the server, not an endpoint-connected background worker.

Restart loses data. Login, TLS, authorization, pagination, rate limits, and a database are not implemented. This sample listens on localhost for learning. Task and body limits do not replace rate or connection limits. See [security](../../lessons/026_security_deployment_English.md) and [database design](../../lessons/023_serde_database_English.md) before extending it.

API sources: [Axum 0.8](https://docs.rs/axum/0.8/axum/), [Tokio](https://tokio.rs/tokio/tutorial), [Serde](https://serde.rs/).
