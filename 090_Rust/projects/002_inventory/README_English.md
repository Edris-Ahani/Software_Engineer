# Project 002 - Inventory and Price Calculation

[Persian version](README_Persian.md) · [Course](../../README_English.md) · [Behavioral testing](../../lessons/014_testing_English.md)

Goal: model business logic independently of HTTP, files, or databases. SKUs must be unique and contain 1-40 ASCII letters, digits, or hyphens. Reservation quantity must be positive and total price must not overflow. Prices use integer minor units, here cents.

From the course root:

```bat
cmd /c cargo run -p inventory
cmd /c cargo test -p inventory --offline
```

Demo output:

```text
Reserved 2 books for 3500 cents
Remaining: 3
```

## Why operation order matters

reserve checks quantity, product existence, available stock, and checked multiplication before reducing stock. Reducing stock before calculating the price could leave a partial operation after overflow.

add uses BTreeMap's entry API so duplicates do not overwrite existing products. The getter only exposes a shared reference, preventing callers from directly modifying private stock fields.

The [domain implementation](src/lib.rs) has typed errors. [Tests](tests/reservations.rs) check state preservation for overselling, overflow, and duplicates, as well as exact stock depletion.

## Actual scope

Reservation immediately deducts stock; expiration, cancellation, payment, and events are not implemented. Zero prices are allowed for free products. Amounts use a single fixed unit; this is not a multi-currency model. Storage is in memory within one process; no database transactions or cross-replica consistency are provided.

For an extension, define all-or-nothing multi-item reservations first. Then add a storage adapter while keeping the domain API framework-independent. An error test should inspect state after failure, not only whether Err was returned.
