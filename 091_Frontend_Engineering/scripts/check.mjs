import { readdir, readFile, access } from "node:fs/promises";
import { resolve, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
const root = fileURLToPath(new URL("../", import.meta.url));
const files = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (["node_modules", "dist", ".git", "test-results", "playwright-report"].includes(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await walk(path); else files.push(path);
  }
}
await walk(root);
const failures = [];
let paired = 0;
let checkedScripts = 0;
for (const path of files) {
  const source = await readFile(path, "utf8");
  const ext = extname(path);
  if (ext === ".md") {
    if (/[\u0600-\u06ff]/u.test(source)
      && (!source.trimStart().startsWith('<div dir="rtl">') || !source.trimEnd().endsWith("</div>"))) {
      failures.push("Missing full RTL wrapper: " + path);
    }
    if (path.endsWith("_English.md") || path.endsWith("_Persian.md")) {
      const other = path.endsWith("_English.md") ? path.replace(/_English\.md$/, "_Persian.md")
        : path.replace(/_Persian\.md$/, "_English.md");
      try { await access(other); } catch { failures.push("Missing language counterpart: " + other); }
      paired++;
    }
    for (const match of source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = match[1].split("#")[0];
      if (!target || /^(?:https?:|mailto:)/.test(target)) continue;
      try { await access(resolve(dirname(path), decodeURIComponent(target))); }
      catch { failures.push("Broken link: " + path + " -> " + target); }
    }
    const fence = String.fromCharCode(96).repeat(3);
    const blocks = new RegExp(fence + "[^\\n]*\\n([\\s\\S]*?)" + fence, "g");
    for (const match of source.matchAll(blocks)) {
      if (/[\u0600-\u06ff]/u.test(match[1])) failures.push("Persian in code block: " + path);
    }
  } else if ([".js", ".mjs", ".ts", ".tsx", ".css", ".html", ".json"].includes(ext)
    && /[\u0600-\u06ff]/u.test(source)) {
    failures.push("Persian in source/configuration: " + path);
  }
  if (ext === ".mjs" || ext === ".js") {
    const result = spawnSync(process.execPath, ["--check", path], { encoding: "utf8", timeout: 10_000 });
    if (result.status !== 0) failures.push("JavaScript syntax failure: " + path + "\n" + result.stderr);
    checkedScripts++;
  }
  if (ext === ".html") {
    for (const match of source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
      if (!match[1].trim()) continue;
      const result = spawnSync(process.execPath, ["--input-type=module", "--check"], {
        input: match[1], encoding: "utf8", timeout: 10_000,
      });
      if (result.status !== 0) failures.push("Inline script syntax failure: " + path + "\n" + result.stderr);
      checkedScripts++;
    }
  }
}
const topics = (await readdir(root)).filter(name => /^\d{3}_/.test(name)).sort();
if (topics.length !== 64 || topics.some((name, index) => Number(name.slice(0, 3)) !== index + 1)) {
  failures.push("Expected 64 contiguous lesson directories");
}
for (const topic of topics) {
  for (const language of ["English", "Persian"]) {
    try { await access(resolve(root, topic, topic.slice(0, 3) + "_Lesson_" + language + ".md")); }
    catch { failures.push("Missing lesson file: " + topic + " " + language); }
  }
}
if (failures.length) { console.error(failures.join("\n")); process.exitCode = 1; }
else console.log("PASS: " + topics.length + " lessons, " + paired / 2 + " language pairs, " + checkedScripts + " JavaScript checks; all local Markdown links and RTL wrappers valid.");
