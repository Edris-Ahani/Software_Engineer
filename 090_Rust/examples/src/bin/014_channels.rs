use std::{error::Error, io, sync::mpsc, thread};

fn main() -> Result<(), Box<dyn Error>> {
    let (sender, receiver) = mpsc::sync_channel::<String>(2);
    let producer = thread::spawn(move || -> Result<(), mpsc::SendError<String>> {
        for index in 1..=5 { sender.send(format!("job-{index}"))?; }
        Ok(())
    });
    let jobs: Vec<_> = receiver.into_iter().collect();
    producer.join().map_err(|_| io::Error::other("Producer panicked"))??;
    assert_eq!(jobs.len(), 5);
    println!("Processed: {jobs:?}");
    Ok(())
}
