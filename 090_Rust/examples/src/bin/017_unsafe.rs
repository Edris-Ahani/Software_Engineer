fn split_bytes(bytes: &mut [u8], middle: usize) -> (&mut [u8], &mut [u8]) {
    assert!(middle <= bytes.len());
    let length = bytes.len();
    let pointer = bytes.as_mut_ptr();
    // SAFETY: The pointer comes from a live exclusive slice. Both ranges are
    // in bounds and disjoint, and their lifetimes remain tied to that slice.
    unsafe {
        (
            std::slice::from_raw_parts_mut(pointer, middle),
            std::slice::from_raw_parts_mut(pointer.add(middle), length - middle),
        )
    }
}

fn main() {
    let mut bytes = [1, 2, 3, 4];
    let (left, right) = split_bytes(&mut bytes, 2);
    left[0] = 9;
    right[0] = 8;
    assert_eq!(bytes, [9, 2, 8, 4]);
    println!("{bytes:?}");
    let (left, right) = split_bytes(&mut [], 0);
    assert!(left.is_empty() && right.is_empty());
}

#[cfg(test)]
mod tests {
    use super::split_bytes;

    #[test]
    fn handles_boundaries() {
        for middle in 0..=4 {
            let mut bytes = [1, 2, 3, 4];
            let (left, right) = split_bytes(&mut bytes, middle);
            assert_eq!(left.len(), middle);
            assert_eq!(right.len(), 4 - middle);
        }
    }

    #[test]
    #[should_panic]
    fn rejects_out_of_bounds() { split_bytes(&mut [1], 2); }
}
