use std::io::{self, BufRead, Write};

#[derive(Debug)]
pub struct SearchOptions {
    query: String,
    ignore_ascii_case: bool,
}

impl SearchOptions {
    pub fn new(query: String, ignore_ascii_case: bool) -> Result<Self, &'static str> {
        if query.is_empty() { return Err("Search query must not be empty"); }
        let query = if ignore_ascii_case { query.to_ascii_lowercase() } else { query };
        Ok(Self { query, ignore_ascii_case })
    }

    fn matches(&self, line: &str) -> bool {
        if self.ignore_ascii_case {
            line.to_ascii_lowercase().contains(&self.query)
        } else {
            line.contains(&self.query)
        }
    }
}

/// Streams matching UTF-8 lines to the writer with one-based line numbers.
///
/// Memory usage depends on the longest line, not the entire file size.
///
/// ```
/// use log_search::{SearchOptions, search};
/// use std::io::Cursor;
/// let options = SearchOptions::new("ERROR".into(), false).unwrap();
/// let mut output = Vec::new();
/// assert_eq!(search(Cursor::new("INFO ok\nERROR failed\n"), &mut output, &options).unwrap(), 1);
/// assert_eq!(output, b"2:ERROR failed\n");
/// ```
pub fn search(
    reader: impl BufRead,
    mut writer: impl Write,
    options: &SearchOptions,
) -> io::Result<usize> {
    let mut matches = 0;
    for (index, line) in reader.lines().enumerate() {
        let line = line?;
        if options.matches(&line) {
            writeln!(writer, "{}:{line}", index + 1)?;
            matches += 1;
        }
    }
    writer.flush()?;
    Ok(matches)
}
