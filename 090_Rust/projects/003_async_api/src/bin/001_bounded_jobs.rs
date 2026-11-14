use std::time::Duration;
use tokio::{sync::mpsc, task::JoinSet, time::{sleep, timeout}};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let (sender, mut receiver) = mpsc::channel::<u32>(2);
    let mut workers = JoinSet::new();
    workers.spawn(async move {
        let mut total = 0;
        while let Some(job) = receiver.recv().await {
            sleep(Duration::from_millis(5)).await;
            total += job;
        }
        total
    });
    let producer = async move {
        for job in 1..=5 { sender.send(job).await?; }
        Ok::<(), mpsc::error::SendError<u32>>(())
    };
    timeout(Duration::from_secs(5), producer).await??;
    let total = timeout(Duration::from_secs(5), workers.join_next()).await?
        .ok_or("Worker was missing")??;
    assert_eq!(total, 15);
    println!("Processed total: {total}");
    Ok(())
}
