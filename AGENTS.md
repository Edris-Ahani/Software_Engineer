# Project instructions

## New learning topics and directory numbering

- Apply these rules whenever adding a new subject, language, tool, or learning topic to this repository.
- Give every new top-level topic its own directory named `NNN_Descriptive_Topic_Name`, using a zero-padded, three-digit sequence such as `001`, `002`, and `003`.
- Inspect existing topic directories first. Use the next number after the highest existing prefix; do not reuse a number, fill historical gaps, or renumber existing topics unless explicitly requested.
- Keep each topic self-contained. Put its lessons, practical examples, projects, sample data, exercises, solutions, dependencies, and execution instructions inside its own directory.
- Add a topic `README.md` with an ordered learning path, prerequisites, links to lessons and examples, and exact run and verification commands.
- Number ordered lessons, runnable example files, and project directories with the same three-digit convention within their respective collections. Supporting names such as `src`, `tests`, `data`, `Cargo.toml`, and `README.md` may retain standard ecosystem names.
- Provide useful, separate runnable examples alongside explanations. State their purpose, working directory, input, expected output, and important limitations. Separate optional dependencies from basic examples where practical.
- Include installation instructions for relevant operating systems, real-world uses, common mistakes, and exercises when introducing a programming language or tool.
- Check current installation and dependency guidance against official documentation and link the sources. Distinguish commands actually executed from checks that could not run.
- Preserve unrelated user changes. Do not create a local commit unless explicitly requested. Never push to any remote.

## Language and execution

- All tutorials and explanatory documentation must have separate, complete Persian and English Markdown files. Apply this to lessons, topic overviews, installation and execution guides, project explanations, exercises, solutions, troubleshooting, and validation reports for every topic.
- Name each pair with the same base and explicit `_Persian.md` and `_English.md` suffixes. Keep the same three-digit lesson number in both files; a translation does not consume another sequence number.
- Keep both versions equivalent in scope, examples, commands, expected results, limitations, and important technical detail. A short English summary is not a substitute for a full English version.
- Whenever creating or updating an explanatory document, create or update its counterpart in the same task. Preserve code examples in English and keep links within the selected language where possible. Include a link to the other language.
- A conventional `README.md` or similar entry file may be a short bilingual language selector linking to the two complete versions. Do not place the complete lesson in a single mixed-language file as a substitute for the pair.
- Check language pairs and their links before completing documentation changes. For existing topics touched by a task, bring the affected explanations into this paired format without renumbering unrelated material.
- Write user-facing chat responses in Persian unless the user requests another language. English documentation is required alongside Persian documentation even though the chat is Persian.
- Wrap the entire content of every Markdown file containing Persian text in `<div dir="rtl">` and `</div>`.
- Use English exclusively for source-code identifiers, comments, docstrings, and annotations. Keep source and configuration files free of Persian characters.
- On Windows, execute shell commands through `cmd /c`. Use terminating, non-interactive commands; do not start persistent background sessions.
