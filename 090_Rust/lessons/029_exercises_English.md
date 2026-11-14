# 029 - Exercises and Acceptance Criteria

[Persian version](029_exercises_Persian.md) · [Contents](../README_English.md) · [Previous](028_projects_English.md) · [Next: solutions](030_solutions_English.md)

Attempt each exercise before opening its solution. Keep experiments under scratch so the teaching files remain a reference. Check at least one successful input and one boundary case for each exercise.

| Number | Problem | Acceptance criteria |
| --- | --- | --- |
| 001 | Shipping costs | 750 grams with express costs 80; 1,500 grams without express costs 80 |
| 002 | Normalize without taking input ownership | Original remains usable; result is alice |
| 003 | In-place discount | [100,20,300] minus 30 becomes [70,0,270] |
| 004 | Borrowed header parsing | Key/value borrow the input; no colon returns None |
| 005 | Pay an order once | Second payment returns Err and preserves first receipt |
| 006 | Sorted word counts | rust is rust gives rust=2 and is=1 with stable output order |
| 007 | Unicode | caf\u{e9} has 5 bytes and 4 scalar values; get returns None for an invalid boundary |
| 008 | Valid port | 8080 succeeds; zero, nonnumeric text, and 65536 fail |
| 009 | Multiple notifier channels | Add an implementation without changing broadcast |
| 010 | Iterator price sum | [100,0,250,50] totals 400 without consuming input |
| 011 | A tree without strong cycles | After parent drop, the child's Weak cannot upgrade |
| 012 | Multi-threaded counter | Four workers times 1,000 increments equals exactly 4000 after joining |
| 013 | Bounded queue | Five messages pass capacity two and all senders close |
| 014 | Article typestate | Only a published article exposes url |
| 015 | Safe unsafe wrapper | Zero/end boundaries work; excessive indices fail before raw operations |
| 016 | Inventory invariants | Overflow, shortages, and duplicates preserve prior state |
| 017 | File search | Correct line numbers, CRLF, no match, and writer errors are covered |
| 018 | API | Creation 201, blank title 422, missing ID 404, completion visible |
| 019 | Async queue | Capacity two, sum 15, bounded timeout, and collected worker |
| 020 | ID conversion and Cow | Reject zero ID; already lowercase text remains Borrowed |

## Independent extensions

**A - Count mode:** add --count. Print only a count in that mode; file errors must still exit 2. Do not confuse a matching line's number with the number of matches.

**B - Multi-item inventory:** reservation must be all-or-nothing. Validate every item and the total before mutation. Decide how duplicate SKUs within a request behave. Calling the existing one-item method sequentially must not deduct the first item when the second fails.

**C - Line-size limit:** define a maximum byte length. Calling read_line and checking after an unbounded allocation is too late; design bounded reading and overflow behavior.

**D - Persistent API:** add storage, migrations, transactions, and idempotency. Test restart and two concurrent requests for the final stock unit. This needs an independent database and is not implemented in the current in-memory project.

**E - Async reasoning:** explain why a timeout cannot necessarily stop a CPU loop with no yield, and why dropping a JoinHandle differs from dropping an operation's future.

Several designs can satisfy the extensions. The [solutions](030_solutions_English.md) describe approaches and invariants, rather than claiming to provide a complete implementation for every production requirement.
