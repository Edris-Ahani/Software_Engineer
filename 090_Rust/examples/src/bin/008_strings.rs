fn main() {
    let name = String::from("caf\u{e9}");
    println!("Bytes: {}, scalar values: {}", name.len(), name.chars().count());
    assert_eq!(name.len(), 5);
    assert_eq!(name.chars().count(), 4);
    assert_eq!(name.get(3..4), None);
    assert_eq!(name.get(3..), Some("\u{e9}"));
    let combined = "e\u{301}";
    assert_eq!(combined.chars().count(), 2);
    println!("Uppercase: {}", name.to_uppercase());
    let joined = ["api", "v1", "users"].join("/");
    assert_eq!(joined, "api/v1/users");
}
