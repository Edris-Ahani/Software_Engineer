fn shipping_cost(weight_grams: u32, express: bool) -> u32 {
    let base_cost = if weight_grams <= 1_000 { 50 } else { 80 };
    if express { base_cost + 30 } else { base_cost }
}

fn main() {
    let prices = [100_u32, 200, 300];
    let total: u32 = prices.iter().sum();
    let shipping = shipping_cost(750, true);
    println!("Total: {total}, shipping: {shipping}");
    for (index, price) in prices.iter().enumerate() {
        println!("Item {}: {price}", index + 1);
    }
    assert_eq!(shipping, 80);
}
