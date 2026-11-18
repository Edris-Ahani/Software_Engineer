# 003 — Git and development workflow

[Persian](./003_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Git stores snapshots in commits. The working tree, staging area, and committed history are distinct: inspect diff before staging and inspect the staged diff before committing. A feature branch isolates a change, but an untracked file does not belong to a branch until committed.

Small commits with a clear purpose make review, revert, and regression analysis easier. Merge preserves branch structure; rebase rewrites commit identities and should follow team policy for shared history. Resolve conflicts by understanding both intentions, then run relevant checks. Ignore node_modules, build artifacts, and secrets; commit source, configuration examples, and lockfiles.

## Common mistakes

Do not resolve every conflict by choosing one side or commit credentials because a repository is private.

## Exercise and acceptance criteria

In a disposable repository, make conflicting edits to one function on two branches. Merge, resolve, and explain the resulting behavior.

## Solution guidance

Inspect git status, git diff, and git diff --cached. Preserve both required behaviors and validate their observable result before committing.

## Official reference

[Primary documentation](https://git-scm.com/docs/gittutorial)

[Previous](../002_Environment_and_Installation/002_Lesson_English.md) · [Next](../004_Internet_HTTP_and_DNS/004_Lesson_English.md)
