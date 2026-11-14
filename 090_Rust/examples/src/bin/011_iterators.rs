fn transform<F>(values: &[u32], operation: F) -> Vec<u32>
where F: Fn(u32) -> u32,
{
    values.iter().copied().map(operation).collect()
}

fn main() {
    let prices = [100_u32, 0, 250, 50];
    let total: u32 = prices.iter().copied().filter(|price| *price > 0).sum();
    assert_eq!(total, 400);
    assert_eq!(transform(&prices, |price| price / 2), [50, 0, 125, 25]);
    let mut calls = 0;
    let labels: Vec<_> = prices.iter().map(|price| {
        calls += 1;
        format!("USD {price}")
    }).collect();
    let owned = String::from("one-shot payload");
    let consume = move || owned;
    println!("{labels:?}, calls: {calls}, {}", consume());
}
