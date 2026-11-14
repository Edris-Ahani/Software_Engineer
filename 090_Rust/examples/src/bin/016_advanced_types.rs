use std::marker::PhantomData;

struct Draft;
struct Published;
struct Article<State> {
    title: String,
    _state: PhantomData<State>,
}

impl Article<Draft> {
    fn new(title: String) -> Self { Self { title, _state: PhantomData } }
    fn publish(self) -> Article<Published> {
        Article { title: self.title, _state: PhantomData }
    }
}

impl Article<Published> {
    fn url(&self) -> String { format!("/articles/{}", self.title.to_lowercase()) }
}

fn array_total<const N: usize>(values: [u32; N]) -> u32 { values.iter().sum() }

fn main() {
    let article = Article::new(String::from("Rust")).publish();
    assert_eq!(article.url(), "/articles/rust");
    assert_eq!(array_total([1, 2, 3]), 6);
    println!("{}", article.url());
}
