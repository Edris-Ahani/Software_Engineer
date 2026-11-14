use std::borrow::Cow;

#[derive(Debug, PartialEq, Eq)]
struct UserId(u64);

impl TryFrom<u64> for UserId {
    type Error = &'static str;
    fn try_from(value: u64) -> Result<Self, Self::Error> {
        if value == 0 { Err("User ID must be positive") } else { Ok(Self(value)) }
    }
}

fn normalize(input: &str) -> Cow<'_, str> {
    if input.bytes().any(|byte| byte.is_ascii_uppercase()) {
        Cow::Owned(input.to_ascii_lowercase())
    } else {
        Cow::Borrowed(input)
    }
}

fn main() {
    assert_eq!(UserId::try_from(42), Ok(UserId(42)));
    assert!(UserId::try_from(0).is_err());
    assert!(matches!(normalize("rust"), Cow::Borrowed(_)));
    assert_eq!(normalize("RUST"), "rust");
    println!("{:?}", UserId::try_from(42));
}
