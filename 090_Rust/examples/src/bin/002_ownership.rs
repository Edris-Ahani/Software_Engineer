fn normalize_name(name: String) -> String {
    name.trim().to_lowercase()
}

fn main() {
    let original = String::from("  ALICE  ");
    let backup = original.clone();
    let normalized = normalize_name(original);
    println!("Original copy: {backup:?}");
    println!("Normalized: {normalized}");
    let count = 5_u32;
    let copied_count = count;
    println!("Copy values: {count}, {copied_count}");
    assert_eq!(normalized, "alice");
}
