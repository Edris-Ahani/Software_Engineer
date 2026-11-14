fn classify(status: Option<u16>) -> &'static str {
    match status {
        Some(200..=299) => "success",
        Some(400 | 404) => "client error",
        Some(code) if code >= 500 => "server error",
        Some(_) => "other",
        None => "no response",
    }
}

fn main() {
    let mut queue = vec![Some(200), Some(404), None];
    while let Some(status) = queue.pop() {
        println!("{}", classify(status));
    }
    let Some(first) = [10, 20].first().copied() else { return };
    assert_eq!(first, 10);
    assert_eq!(classify(Some(503)), "server error");
}
