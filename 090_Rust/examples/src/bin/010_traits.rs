trait Notifier {
    fn send(&self, message: &str) -> String;
}

struct Email;
struct Sms;

impl Notifier for Email {
    fn send(&self, message: &str) -> String { format!("Email: {message}") }
}

impl Notifier for Sms {
    fn send(&self, message: &str) -> String { format!("SMS: {message}") }
}

fn notify<N: Notifier>(notifier: &N) -> String {
    notifier.send("Order confirmed")
}

fn broadcast(notifiers: &[Box<dyn Notifier>]) -> Vec<String> {
    notifiers.iter().map(|notifier| notifier.send("Service restored")).collect()
}

fn main() {
    println!("{}", notify(&Email));
    let notifiers: Vec<Box<dyn Notifier>> = vec![Box::new(Email), Box::new(Sms)];
    for message in broadcast(&notifiers) { println!("{message}"); }
}
