use log_search::{SearchOptions, search};
use std::io::{self, Cursor, Write};

#[test]
fn selects_matching_lines_and_keeps_original_numbers() {
    let options = SearchOptions::new("ERROR".into(), false).unwrap();
    let mut output = Vec::new();
    assert_eq!(search(Cursor::new("INFO ready\r\nERROR failed\r\nerror skipped"), &mut output, &options).unwrap(), 1);
    assert_eq!(output, b"2:ERROR failed\n");
}

#[test]
fn supports_ascii_case_insensitive_search() {
    let options = SearchOptions::new("ErRoR".into(), true).unwrap();
    let mut output = Vec::new();
    assert_eq!(search(Cursor::new("error a\nERROR b"), &mut output, &options).unwrap(), 2);
    assert_eq!(output, b"1:error a\n2:ERROR b\n");
}

#[test]
fn handles_empty_input_and_missing_matches() {
    let options = SearchOptions::new("missing".into(), false).unwrap();
    for input in ["", "INFO ready\n"] {
        let mut output = Vec::new();
        assert_eq!(search(Cursor::new(input), &mut output, &options).unwrap(), 0);
        assert!(output.is_empty());
    }
}

#[test]
fn rejects_invalid_utf8() {
    let options = SearchOptions::new("x".into(), false).unwrap();
    let error = search(Cursor::new([0xff]), Vec::new(), &options).unwrap_err();
    assert_eq!(error.kind(), io::ErrorKind::InvalidData);
}

struct BrokenWriter;
impl Write for BrokenWriter {
    fn write(&mut self, _: &[u8]) -> io::Result<usize> { Err(io::Error::new(io::ErrorKind::BrokenPipe, "Closed")) }
    fn flush(&mut self) -> io::Result<()> { Ok(()) }
}

#[test]
fn propagates_output_failures() {
    let options = SearchOptions::new("x".into(), false).unwrap();
    let error = search(Cursor::new("x\n"), BrokenWriter, &options).unwrap_err();
    assert_eq!(error.kind(), io::ErrorKind::BrokenPipe);
}
