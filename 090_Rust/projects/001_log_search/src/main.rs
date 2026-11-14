use log_search::{SearchOptions, search};
use std::{env, error::Error, ffi::OsString, fs::File, io::{self, BufReader, BufWriter}, path::PathBuf, process::ExitCode};

struct Arguments {
    path: PathBuf,
    options: SearchOptions,
}

fn parse_arguments(arguments: impl IntoIterator<Item = OsString>) -> Result<Arguments, String> {
    let usage = "Usage: log-search <query> <file> [--ignore-ascii-case]";
    let mut arguments = arguments.into_iter();
    let query = arguments.next().ok_or(usage)?.into_string()
        .map_err(|_| "Query must be valid UTF-8")?;
    let path = arguments.next().ok_or(usage)?;
    let ignore_ascii_case = match arguments.next() {
        Some(flag) if flag == "--ignore-ascii-case" => true,
        Some(_) => return Err(usage.into()),
        None => false,
    };
    if arguments.next().is_some() { return Err(usage.into()); }
    let options = SearchOptions::new(query, ignore_ascii_case)?;
    Ok(Arguments { path: path.into(), options })
}

fn run() -> Result<usize, Box<dyn Error>> {
    let arguments = parse_arguments(env::args_os().skip(1))
        .map_err(|message| io::Error::new(io::ErrorKind::InvalidInput, message))?;
    let reader = BufReader::new(File::open(arguments.path)?);
    let writer = BufWriter::new(io::stdout().lock());
    Ok(search(reader, writer, &arguments.options)?)
}

fn main() -> ExitCode {
    match run() {
        Ok(0) => ExitCode::from(1),
        Ok(_) => ExitCode::SUCCESS,
        Err(error) if error.downcast_ref::<io::Error>()
            .is_some_and(|error| error.kind() == io::ErrorKind::BrokenPipe) => ExitCode::SUCCESS,
        Err(error) => { eprintln!("Error: {error}"); ExitCode::from(2) }
    }
}

#[cfg(test)]
mod tests {
    use super::parse_arguments;

    #[test]
    fn validates_arguments() {
        assert!(parse_arguments(["error".into(), "a.log".into()]).is_ok());
        assert!(parse_arguments(["error".into(), "a.log".into(), "--ignore-ascii-case".into()]).is_ok());
        assert!(parse_arguments(["error".into()]).is_err());
        assert!(parse_arguments(["".into(), "a.log".into()]).is_err());
        assert!(parse_arguments(["x".into(), "a.log".into(), "--bad".into()]).is_err());
        assert!(parse_arguments(["x".into(), "a.log".into(), "--ignore-ascii-case".into(), "extra".into()]).is_err());
    }
}
