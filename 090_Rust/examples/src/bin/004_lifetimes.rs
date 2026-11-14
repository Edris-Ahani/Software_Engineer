#[derive(Debug)]
struct Header<'a> {
    key: &'a str,
    value: &'a str,
}

fn parse_header(line: &str) -> Option<Header<'_>> {
    let (key, value) = line.split_once(':')?;
    Some(Header { key: key.trim(), value: value.trim() })
}

fn longer<'a>(left: &'a str, right: &'a str) -> &'a str {
    if left.len() >= right.len() { left } else { right }
}

fn main() {
    let line = String::from("Content-Type: application/json");
    let header = parse_header(&line).expect("The sample header contains a colon");
    assert_eq!(header.key, "Content-Type");
    assert_eq!(header.value, "application/json");
    println!("{header:?}");
    println!("Longer: {}", longer("rust", "ownership"));
}
