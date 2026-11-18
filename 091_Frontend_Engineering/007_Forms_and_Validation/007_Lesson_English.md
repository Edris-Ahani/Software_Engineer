# 007 — Forms and validation

[Persian](./007_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Associate every input with a visible label. Choose meaningful types, autocomplete tokens, and inputmode to help autofill and mobile keyboards. A form has a submission action; listening to submit also covers keyboard activation. Browser constraints such as required, minlength, and type=email provide a useful first validation layer.

Client validation improves feedback, while the server validates every trusted operation again. Keep raw input separate from normalized domain values: trimming a display name may be appropriate, silently altering a password is not. Show field errors near controls and connect them with aria-describedby; use an error summary for large forms. Preserve input after failure and prevent duplicate submission while explaining progress.

## Common mistakes

Do not use placeholders as labels or disable paste into password fields. Disabled controls are omitted from native form submission.

## Exercise and acceptance criteria

Submit an empty form, an invalid email, and a valid input using Enter. Simulate a server rejection without clearing entered values.

## Solution guidance

Use a submit handler with preventDefault for the local demo, report validity first, and render a persistent status message with textContent.

## Related code

- [001_semantic_form.html](../examples/001_semantic_form.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms)

[Previous](../006_Semantic_HTML/006_Lesson_English.md) · [Next](../008_Images_Media_and_SVG/008_Lesson_English.md)
