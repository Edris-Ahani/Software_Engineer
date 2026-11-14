use std::{future::{Future, ready}, pin::Pin, sync::Arc, task::{Context, Poll, Wake, Waker}};

struct NoopWake;
impl Wake for NoopWake {
    fn wake(self: Arc<Self>) {}
}

async fn total() -> u32 {
    let first = ready(20).await;
    let second = ready(22).await;
    first + second
}

fn main() {
    let waker = Waker::from(Arc::new(NoopWake));
    let mut context = Context::from_waker(&waker);
    let mut future = Box::pin(total());
    match Pin::as_mut(&mut future).poll(&mut context) {
        Poll::Ready(value) => { assert_eq!(value, 42); println!("Ready: {value}"); }
        Poll::Pending => panic!("This example contains only immediately ready futures"),
    }
}
