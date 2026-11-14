use std::{collections::BTreeMap, error::Error, fmt};

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum InventoryError {
    InvalidSku,
    DuplicateSku,
    UnknownSku,
    InvalidQuantity,
    InsufficientStock { available: u32, requested: u32 },
    TotalOverflow,
}

impl fmt::Display for InventoryError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::InvalidSku => write!(formatter, "SKU must contain 1 to 40 ASCII letters, digits, or hyphens"),
            Self::DuplicateSku => write!(formatter, "SKU already exists"),
            Self::UnknownSku => write!(formatter, "SKU was not found"),
            Self::InvalidQuantity => write!(formatter, "Quantity must be greater than zero"),
            Self::InsufficientStock { available, requested } =>
                write!(formatter, "Requested {requested} units, but only {available} are available"),
            Self::TotalOverflow => write!(formatter, "Total price overflowed"),
        }
    }
}

impl Error for InventoryError {}

#[derive(Debug)]
pub struct Product {
    available: u32,
    price_cents: u64,
}

impl Product {
    pub fn available(&self) -> u32 { self.available }
}

#[derive(Debug, Default)]
pub struct Inventory {
    products: BTreeMap<String, Product>,
}

impl Inventory {
    pub fn add(&mut self, sku: String, available: u32, price_cents: u64) -> Result<(), InventoryError> {
        if sku.is_empty() || sku.len() > 40 || !sku.bytes().all(|byte| byte.is_ascii_alphanumeric() || byte == b'-') {
            return Err(InventoryError::InvalidSku);
        }
        match self.products.entry(sku) {
            std::collections::btree_map::Entry::Occupied(_) => Err(InventoryError::DuplicateSku),
            std::collections::btree_map::Entry::Vacant(entry) => {
                entry.insert(Product { available, price_cents });
                Ok(())
            }
        }
    }

    pub fn get(&self, sku: &str) -> Option<&Product> { self.products.get(sku) }

    /// Validates the entire reservation before changing stock.
    pub fn reserve(&mut self, sku: &str, quantity: u32) -> Result<u64, InventoryError> {
        if quantity == 0 { return Err(InventoryError::InvalidQuantity); }
        let product = self.products.get_mut(sku).ok_or(InventoryError::UnknownSku)?;
        if quantity > product.available {
            return Err(InventoryError::InsufficientStock { available: product.available, requested: quantity });
        }
        let total = product.price_cents.checked_mul(u64::from(quantity))
            .ok_or(InventoryError::TotalOverflow)?;
        product.available -= quantity;
        Ok(total)
    }
}
