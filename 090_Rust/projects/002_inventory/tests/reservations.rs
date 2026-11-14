use inventory::{Inventory, InventoryError};

fn sample() -> Inventory {
    let mut inventory = Inventory::default();
    inventory.add("BOOK".into(), 5, 1_750).unwrap();
    inventory
}

#[test]
fn successful_reservation_updates_stock() {
    let mut inventory = sample();
    assert_eq!(inventory.reserve("BOOK", 2), Ok(3_500));
    assert_eq!(inventory.get("BOOK").unwrap().available(), 3);
}

#[test]
fn overselling_keeps_stock_unchanged() {
    let mut inventory = sample();
    assert_eq!(inventory.reserve("BOOK", 6), Err(InventoryError::InsufficientStock { available: 5, requested: 6 }));
    assert_eq!(inventory.get("BOOK").unwrap().available(), 5);
}

#[test]
fn overflow_keeps_stock_unchanged() {
    let mut inventory = Inventory::default();
    inventory.add("EXPENSIVE".into(), 3, u64::MAX).unwrap();
    assert_eq!(inventory.reserve("EXPENSIVE", 2), Err(InventoryError::TotalOverflow));
    assert_eq!(inventory.get("EXPENSIVE").unwrap().available(), 3);
}

#[test]
fn duplicate_does_not_replace_existing_stock() {
    let mut inventory = sample();
    assert_eq!(inventory.add("BOOK".into(), 99, 1), Err(InventoryError::DuplicateSku));
    assert_eq!(inventory.get("BOOK").unwrap().available(), 5);
}

#[test]
fn rejects_unknown_sku_zero_quantity_and_invalid_sku() {
    let mut inventory = sample();
    assert_eq!(inventory.reserve("MISSING", 1), Err(InventoryError::UnknownSku));
    assert_eq!(inventory.reserve("BOOK", 0), Err(InventoryError::InvalidQuantity));
    for sku in ["", "white space", "bad/sku"] {
        assert_eq!(inventory.add(sku.into(), 1, 1), Err(InventoryError::InvalidSku));
    }
}

#[test]
fn can_reserve_exact_stock_once() {
    let mut inventory = sample();
    assert_eq!(inventory.reserve("BOOK", 5), Ok(8_750));
    assert_eq!(inventory.reserve("BOOK", 1), Err(InventoryError::InsufficientStock { available: 0, requested: 1 }));
}
