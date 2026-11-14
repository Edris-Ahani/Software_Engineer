macro_rules! string_list {
    ($($value:expr),* $(,)?) => {
        vec![$(String::from($value)),*]
    };
}

fn main() {
    let services = string_list!["api", "worker", "scheduler",];
    assert_eq!(services.len(), 3);
    println!("{services:?}");
}
