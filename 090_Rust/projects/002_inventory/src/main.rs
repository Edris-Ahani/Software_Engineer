use inventory::Inventory;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut inventory = Inventory::default();
    inventory.add(String::from("BOOK-RUST"), 5, 1_750)?;
    let total_cents = inventory.reserve("BOOK-RUST", 2)?;
    println!("Reserved 2 books for {total_cents} cents");
    if let Some(product) = inventory.get("BOOK-RUST") {
        println!("Remaining: {}", product.available());
    }
    Ok(())
}
