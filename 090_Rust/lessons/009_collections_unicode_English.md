# 009 - Collections, Strings, and Unicode

[Persian version](009_collections_unicode_Persian.md) · [Contents](../README_English.md) · [Previous](008_models_patterns_English.md) · [Next](010_errors_English.md)

Choose a data structure from its access pattern. The word-count example uses entry to express finding a value or inserting its initial value through one clear path.

| Type | Use | Typical cost |
| --- | --- | --- |
| `Vec<T>` | Contiguous sequence, traversal, indexing | O(1) index, amortized O(1) push, O(n) middle removal |
| `VecDeque<T>` | Double-ended queue | Usually amortized O(1) insertion/removal at either end |
| `HashMap<K,V>` | Lookup without stable ordering | Expected average O(1), depending on hashing and data |
| `BTreeMap<K,V>` | Sorted keys and range queries | O(log n) lookup and insertion |
| `HashSet<T>` | Uniqueness and membership | Expected average O(1) |
| `BinaryHeap<T>` | Max-priority queue | O(1) peek, O(log n) pop |

```rust
use std::collections::HashMap;
let mut counts = HashMap::new();
for word in "rust rust api".split_whitespace() {
    *counts.entry(word).or_insert(0_u32) += 1;
}
assert_eq!(counts.get("rust"), Some(&2));
```

[Example 007](../examples/src/bin/007_collections.rs) converts the HashMap into a BTreeMap for sorted display. HashMap iteration order is not a stable snapshot or API contract. Finish borrowed map accesses before incompatible mutation.

## Bytes, scalar values, and graphemes

String owns UTF-8 text and str borrows valid UTF-8. `len()` counts bytes. `chars().count()` counts Unicode scalar values, not necessarily visible characters or graphemes. A letter followed by a combining mark can contain two scalar values.

```rust
let text = "caf\u{e9}";
assert_eq!(text.len(), 5);
assert_eq!(text.chars().count(), 4);
assert_eq!(text.get(3..4), None);
assert_eq!(text.get(3..), Some("\u{e9}"));
```

Direct indexing such as `text[0]` is unavailable because the intended unit is ambiguous. Slicing at an invalid UTF-8 boundary panics; get(range) is safer. Full grapheme segmentation and normalization need specialized tools such as [unicode-segmentation](https://docs.rs/unicode-segmentation/) and [unicode-normalization](https://docs.rs/unicode-normalization/), selected for the actual requirements and version.

In Persian text, variant letter forms, zero-width non-joiners, and diacritics complicate equality and search. `to_ascii_lowercase` only changes ASCII letters; it is not general Unicode case folding or normalization. The log-search flag explicitly advertises that limitation.

```bat
cmd /c cargo run -p rust-lessons --bin 007_collections
cmd /c cargo run -p rust-lessons --bin 008_strings
```

The second starts with `Bytes: 5, scalar values: 4`. Use Path/PathBuf for filesystem paths and OsStr/OsString for operating-system strings; not every path is UTF-8.

**Exercise:** implement sorted word counts. Predict byte and scalar-value counts for text with a combining mark. Define what character count means for your product.

Sources: [Collections](https://doc.rust-lang.org/std/collections/), [String](https://doc.rust-lang.org/std/string/struct.String.html).
