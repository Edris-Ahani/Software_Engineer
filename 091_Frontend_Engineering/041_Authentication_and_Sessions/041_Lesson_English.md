# 041 — Authentication and sessions

[Persian](./041_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Authentication establishes identity; authorization decides permitted actions. A session can be represented by an opaque identifier in a Secure, HttpOnly cookie and validated by the server. SameSite and CSRF protections must match the application's navigation and embedding requirements. Session expiration, revocation, and logout are server concerns as well as UI states.

OAuth delegates access; OpenID Connect adds an identity layer. Browser-based flows commonly use authorization code with PKCE and strict redirect validation. A backend-for-frontend can keep tokens off the browser JavaScript surface, at the cost of another server responsibility. A JWT is a token format, not encryption or an automatic logout mechanism. Decode is not signature validation.

## Common mistakes

Do not log tokens, send them in URLs, or leave authenticated query caches visible after logout. Refresh storms need coordination.

## Exercise and acceptance criteria

Design behavior for initial loading, signed out, expired session, forbidden resource, and successful logout in two open tabs.

## Solution guidance

Keep 401 and 403 distinct, coordinate a bounded refresh attempt, invalidate server session on logout, and notify other tabs to clear local user data.

## Official reference

[Primary documentation](https://openid.net/developers/how-connect-works/)

[Previous](../040_Frontend_Security/040_Lesson_English.md) · [Next](../042_Performance_and_Core_Web_Vitals/042_Lesson_English.md)
