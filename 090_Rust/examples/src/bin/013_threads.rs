use std::{error::Error, io, sync::{Arc, Mutex}, thread};

fn main() -> Result<(), Box<dyn Error>> {
    let counter = Arc::new(Mutex::new(0_u32));
    let mut handles = Vec::new();
    for _ in 0..4 {
        let shared = Arc::clone(&counter);
        handles.push(thread::spawn(move || -> Result<(), String> {
            for _ in 0..1_000 {
                *shared.lock().map_err(|_| "Counter lock was poisoned".to_string())? += 1;
            }
            Ok(())
        }));
    }
    for handle in handles {
        handle.join().map_err(|_| io::Error::other("Worker panicked"))?
            .map_err(io::Error::other)?;
    }
    let total = *counter.lock().map_err(|_| io::Error::other("Counter lock was poisoned"))?;
    assert_eq!(total, 4_000);
    let values = [1_u32, 2, 3];
    let sum = thread::scope(|scope| {
        let worker = scope.spawn(|| values.iter().sum::<u32>());
        worker.join().expect("The sample worker only adds small integers")
    });
    println!("Counter: {total}, scoped sum: {sum}");
    Ok(())
}
