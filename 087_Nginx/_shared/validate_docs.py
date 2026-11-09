"""Check the chapter's bilingual structure, local links and fenced blocks.

بررسی ساختار دوزبانه، لینک محلی و بلوک کد؛ اعتبارسنج Nginx نیست.
"""

from pathlib import Path
import re
import sys


def main():
    root = Path(__file__).resolve().parents[1]
    errors = []
    lessons = sorted(path for path in root.iterdir()
                     if path.is_dir() and re.fullmatch(r"\d{3}_.+", path.name))
    actual = [int(path.name[:3]) for path in lessons]
    if actual != list(range(1, 23)):
        errors.append(f"Expected consecutive lessons 001..022, got {actual}")
    for lesson in lessons:
        for language in ("English", "Persian"):
            path = lesson / f"01_{lesson.name}_{language}.md"
            if not path.is_file():
                errors.append(f"Missing {path.relative_to(root)}")
    documents = list(root.rglob("*.md"))
    for path in documents:
        if ".validation" in path.parts:
            continue
        content = path.read_text(encoding="utf-8")
        if "\ufffd" in content:
            errors.append(f"Invalid Unicode replacement character: {path.name}")
        if len(re.findall(r"^```", content, re.MULTILINE)) % 2:
            errors.append(f"Unbalanced code fences: {path.name}")
        if path.name.endswith("_Persian.md") and not re.search(r"[\u0600-\u06ff]", content):
            errors.append(f"No Persian text: {path.name}")
        for target in re.findall(r"\[[^\]]*\]\(([^)]+)\)", content):
            if re.match(r"[a-z]+://", target) or target.startswith("#"):
                continue
            target = target.split("#", 1)[0]
            if not (path.parent / target).resolve().exists():
                errors.append(f"Broken link in {path.relative_to(root)}: {target}")
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print(f"PASS: {len(lessons)} bilingual lessons, local links, UTF-8 and code fences")
    return 0


if __name__ == "__main__":
    sys.exit(main())
