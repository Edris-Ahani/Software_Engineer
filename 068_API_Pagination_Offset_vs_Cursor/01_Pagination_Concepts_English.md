# API Pagination: Offset vs Cursor

## 1. Offset Pagination (LIMIT / OFFSET)
- **Concept**: The traditional way to paginate. `SELECT * FROM posts ORDER BY created_at DESC LIMIT 10 OFFSET 20`. This skips the first 20 records and fetches the next 10.
- **Pros**: Easy to implement. Allows jumping to a specific page (e.g., "Go to Page 5").
- **Cons**: 
  1. **Performance**: To process `OFFSET 10000`, the database actually has to fetch 10,010 rows from the disk, throw away the first 10,000, and return the last 10. It becomes painfully slow on deep pages.
  2. **Data Drift**: If a user is on Page 1, and a new post is inserted, everything shifts down. When the user clicks "Page 2", they will see a duplicate post (the last item from Page 1 just got pushed to the top of Page 2).

## 2. Cursor Pagination (Keyset Pagination)
- **Concept**: Instead of counting row numbers (offset), you pass a unique marker (a cursor) from the last item you saw. E.g., `SELECT * FROM posts WHERE created_at < '2023-10-05T12:00:00' ORDER BY created_at DESC LIMIT 10`.
- **Pros**:
  1. **Blazing Fast**: Because it uses the `WHERE` clause on an indexed column, the database jumps directly to that timestamp in the B-Tree. Querying the 1st page or the 10,000th page takes the exact same amount of time.
  2. **No Data Drift**: Because you are fetching items *older* than a specific timestamp, new inserts at the top of the list won't shift your results.
- **Cons**: You cannot jump to a specific page number (e.g., you can't have a "Go to Page 15" button). You can only have "Next" and "Previous" buttons, which is why it's used for Infinite Scrolling (like Twitter or Instagram feeds).
