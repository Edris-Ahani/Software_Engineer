use std::io::{self, BufRead, Cursor, Write};

fn select_errors(reader: impl BufRead, mut writer: impl Write) -> io::Result<usize> {
    let mut count = 0;
    for line in reader.lines() {
        let line = line?;
        if line.starts_with("ERROR ") {
            writeln!(writer, "{line}")?;
            count += 1;
        }
    }
    Ok(count)
}

fn main() -> io::Result<()> {
    let input = Cursor::new(b"INFO ready\nERROR database unavailable\nINFO stopped\n");
    let mut output = Vec::new();
    let count = select_errors(input, &mut output)?;
    assert_eq!(count, 1);
    io::stdout().lock().write_all(&output)?;
    Ok(())
}
