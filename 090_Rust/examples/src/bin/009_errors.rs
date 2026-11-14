use std::{error::Error, fmt, num::ParseIntError};

#[derive(Debug)]
enum PortError {
    InvalidNumber(ParseIntError),
    Zero,
}

impl fmt::Display for PortError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::InvalidNumber(_) => write!(formatter, "Port must be an integer from 1 to 65535"),
            Self::Zero => write!(formatter, "Port must not be zero"),
        }
    }
}

impl Error for PortError {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        match self { Self::InvalidNumber(error) => Some(error), Self::Zero => None }
    }
}

impl From<ParseIntError> for PortError {
    fn from(error: ParseIntError) -> Self { Self::InvalidNumber(error) }
}

fn parse_port(input: &str) -> Result<u16, PortError> {
    let port = input.parse::<u16>()?;
    if port == 0 { return Err(PortError::Zero); }
    Ok(port)
}

fn main() -> Result<(), Box<dyn Error>> {
    println!("Port: {}", parse_port("8080")?);
    assert!(parse_port("0").is_err());
    assert!(parse_port("65536").is_err());
    Ok(())
}
