# 057 — Dependencies and supply-chain security

[Persian](./057_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Every package adds maintenance and supply-chain exposure. Evaluate necessity, ownership, release activity, license, browser targets, bundle impact, and transitive dependencies. A lockfile records exact resolution and integrity information but does not prove that code is trustworthy.

Review install scripts and dependency updates with the same care as source changes. Use automated vulnerability reports as input to investigation: reachability, deployed code paths, available fixes, and compatibility matter. Remove unused dependencies, separate build tooling from runtime needs, and keep the toolchain supported. Prefer official installation guidance and review migration notes before a major upgrade.

## Common mistakes

Do not run npm audit fix --force blindly or treat zero reported vulnerabilities as a guarantee. A misspelled package name can install unrelated code.

## Exercise and acceptance criteria

Review one dependency addition and one major-version update. Write a short decision with necessity, risk, test plan, and rollback.

## Solution guidance

Compare the feature against a platform API, inspect the lockfile diff and release notes, then verify the affected workflows before adopting the update.

## Official reference

[Primary documentation](https://docs.npmjs.com/cli/v11/commands/npm-audit)

[Previous](../056_Observability_Analytics_and_Privacy/056_Lesson_English.md) · [Next](../058_Senior_Engineering_and_Collaboration/058_Lesson_English.md)
