# 040 — Frontend security

[Persian](./040_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

XSS occurs when attacker-controlled content executes as trusted script. Prefer text rendering, contextual escaping, and a maintained sanitizer when rich HTML is necessary. Content Security Policy reduces impact but does not replace safe sinks. Trusted Types can constrain dangerous DOM assignments in supporting browsers.

CSRF abuses ambient credentials such as cookies to trigger unwanted requests. Defenses include server-validated tokens, origin checks, suitable SameSite attributes, and safe method semantics. CORS is not a CSRF defense by itself. Validate URLs before opening redirects or assigning link destinations; reject dangerous schemes and restrict allowed origins where appropriate. Treat third-party scripts as privileged code with access to the page.

## Common mistakes

Never rely on a frontend role check for authorization or insert API error text through innerHTML. Avoid inventing a sanitizer with regular expressions.

## Exercise and acceptance criteria

Enter markup-like task titles and unsafe redirect URLs in a local lab. Verify titles display literally and navigation accepts only intended targets.

## Solution guidance

Use textContent or JSX text, parse URLs against a known base, validate protocol and origin, and enforce authorization on the server independently.

## Related code

- [008_dom_events.html](../examples/008_dom_events.html)
- [index.html](../examples/../projects/002_persistent_board/index.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS)

[Previous](../039_Frameworks_and_Web_Components/039_Lesson_English.md) · [Next](../041_Authentication_and_Sessions/041_Lesson_English.md)
