use std::{sync::{Arc, atomic::{AtomicUsize, Ordering}}, thread};

fn main() {
    let completed = Arc::new(AtomicUsize::new(0));
    let handles: Vec<_> = (0..4).map(|_| {
        let completed = Arc::clone(&completed);
        thread::spawn(move || {
            for _ in 0..1_000 { completed.fetch_add(1, Ordering::Relaxed); }
        })
    }).collect();
    for handle in handles { handle.join().expect("The sample workers only increment a counter"); }
    let total = completed.load(Ordering::Relaxed);
    assert_eq!(total, 4_000);
    println!("Completed: {total}");
}
