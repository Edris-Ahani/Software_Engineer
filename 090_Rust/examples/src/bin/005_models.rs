#[derive(Debug, PartialEq, Eq)]
enum OrderStatus {
    Pending,
    Paid { receipt: String },
    Cancelled,
}

#[derive(Debug)]
struct Order {
    id: u64,
    status: OrderStatus,
}

impl Order {
    fn new(id: u64) -> Self {
        Self { id, status: OrderStatus::Pending }
    }

    fn pay(&mut self, receipt: String) -> Result<(), &'static str> {
        if self.status != OrderStatus::Pending {
            return Err("Only pending orders can be paid");
        }
        self.status = OrderStatus::Paid { receipt };
        Ok(())
    }
}

fn main() {
    let mut order = Order::new(42);
    order.pay(String::from("receipt-42")).expect("The new order is pending");
    match &order.status {
        OrderStatus::Pending => println!("Order {} is pending", order.id),
        OrderStatus::Paid { receipt } => println!("Order {} paid: {receipt}", order.id),
        OrderStatus::Cancelled => println!("Order {} cancelled", order.id),
    }
    let cancelled = OrderStatus::Cancelled;
    assert_ne!(cancelled, order.status);
    assert!(order.pay(String::from("duplicate")).is_err());
}
