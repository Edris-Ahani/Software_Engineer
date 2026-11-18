# 048 — Internationalization and RTL

[Persian](./048_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Internationalization separates messages, formatting, and layout from one locale. Use message parameters and plural rules instead of concatenating translated fragments. Intl.NumberFormat, DateTimeFormat, Collator, and PluralRules handle locale-sensitive formatting, ordering, and grammatical categories.

Set lang and dir independently: language is not direction. CSS logical properties such as margin-inline-start adapt to direction more reliably than left/right. Use bdi or explicit direction for user-generated mixed-script identifiers. Store timestamps in an unambiguous form and format in the intended time zone and calendar. Currency display and arithmetic are separate. Test long text, Persian digits, mixed emails, and multiple plural categories.

## Common mistakes

Do not reverse strings to implement RTL or assume every locale uses the same decimal separator, week start, or calendar.

## Exercise and acceptance criteria

Run the Intl demo for en-US and fa-IR with a fixed timestamp and explicit time zone. Switch direction without changing DOM order.

## Solution guidance

Use browser Intl APIs, logical spacing, and bdi for mixed identifiers. Compare meaning and layout rather than expecting identical strings across locales.

## Related code

- [018_intl.html](../examples/018_intl.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)

[Previous](../047_Advanced_Accessibility/047_Lesson_English.md) · [Next](../049_SEO_and_Metadata/049_Lesson_English.md)
