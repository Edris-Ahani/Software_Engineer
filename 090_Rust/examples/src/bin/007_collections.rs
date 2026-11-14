use std::collections::{BTreeMap, HashMap, HashSet, VecDeque};

fn main() {
    let mut counts = HashMap::new();
    for word in "rust is fast rust is safe".split_whitespace() {
        *counts.entry(word).or_insert(0_u32) += 1;
    }
    let sorted: BTreeMap<_, _> = counts.into_iter().collect();
    println!("Word counts: {sorted:?}");
    let unique: HashSet<_> = ["api", "cli", "api"].into_iter().collect();
    let mut queue = VecDeque::from(["first", "second"]);
    queue.push_back("third");
    assert_eq!(queue.pop_front(), Some("first"));
    assert_eq!(unique.len(), 2);
    assert_eq!(sorted.get("rust"), Some(&2));
}
