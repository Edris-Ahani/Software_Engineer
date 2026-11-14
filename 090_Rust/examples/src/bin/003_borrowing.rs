fn apply_discount(prices: &mut [u32], discount: u32) {
    for price in prices {
        *price = price.saturating_sub(discount);
    }
}

fn first_word(text: &str) -> &str {
    text.split_whitespace().next().unwrap_or("")
}

fn main() {
    let mut prices = vec![100, 20, 300];
    apply_discount(&mut prices, 30);
    assert_eq!(prices, [70, 0, 270]);
    let title = String::from("Rust handbook");
    println!("{}: {prices:?}", first_word(&title));
}
