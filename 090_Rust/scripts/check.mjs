import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argumentsList = process.argv.slice(2);
assert(argumentsList.every((value) => ['--content-only', '--with-web'].includes(value)), 'Unknown option');
const contentOnly = argumentsList.includes('--content-only');
const withWeb = argumentsList.includes('--with-web');
const persianCharacters = /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff]/u;
const ignoredDirectories = new Set(['target', '.git', 'scratch']);

function collectFiles(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const filename = path.join(directory, entry.name);
        if (entry.isDirectory()) return ignoredDirectories.has(entry.name) ? [] : collectFiles(filename);
        return [filename];
    });
}

function checkSequence(names, expectedCount, label) {
    const prefixes = names.map((name) => name.match(/^(\d{3})_/u)?.[1]).sort();
    const expected = Array.from({ length: expectedCount }, (_, index) => String(index + 1).padStart(3, '0'));
    assert.deepEqual(prefixes, expected, `${label}: expected a contiguous three-digit sequence`);
}

const files = collectFiles(root);
const markdownFiles = files.filter((filename) => filename.endsWith('.md'));
const languageSuffix = /_(English|Persian)\.md$/u;
const languageSelectors = new Set(['README.md', 'VALIDATION.md']);
function codeBlocks(content) {
    return [...content.matchAll(/^```([^\n]*)\n([\s\S]*?)^```/gmu)]
        .map(([, language, code]) => [language.trim(), code.replaceAll('\r\n', '\n').trimEnd()]);
}
for (const filename of markdownFiles) {
    const content = fs.readFileSync(filename, 'utf8');
    const relative = path.relative(root, filename);
    const language = filename.match(languageSuffix)?.[1];
    if (language) {
        const counterpart = filename.replace(languageSuffix, language === 'English' ? '_Persian.md' : '_English.md');
        assert(fs.existsSync(counterpart), `${relative}: missing language counterpart`);
        assert(content.includes(`](${path.basename(counterpart)})`), `${relative}: missing language-switch link`);
        if (language === 'English') {
            assert(!persianCharacters.test(content), `${relative}: Persian text in English edition`);
            assert.deepEqual(codeBlocks(content), codeBlocks(fs.readFileSync(counterpart, 'utf8')), `${relative}: code blocks differ between editions`);
        } else {
            assert(persianCharacters.test(content), `${relative}: Persian edition has no Persian text`);
        }
    } else {
        assert(languageSelectors.has(path.basename(filename)), `${relative}: explanatory documents need explicit language suffixes`);
        for (const edition of ['English', 'Persian']) {
            const destination = path.basename(filename, '.md') + `_${edition}.md`;
            assert(content.includes(`](${destination})`), `${relative}: selector missing ${edition} edition`);
        }
    }
    if (persianCharacters.test(content)) {
        assert(content.trim().startsWith('<div dir="rtl">'), `${relative}: missing opening RTL wrapper`);
        assert(content.trim().endsWith('</div>'), `${relative}: missing closing RTL wrapper`);
    }
    assert.equal((content.match(/^```/gmu) ?? []).length % 2, 0, `${relative}: unbalanced code fences`);
    for (const [, target] of content.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/gu)) {
        if (/^[a-z][a-z\d+.-]*:/iu.test(target) || target.startsWith('#')) continue;
        const destination = path.resolve(path.dirname(filename), decodeURIComponent(target.split('#')[0]));
        assert(destination.startsWith(root + path.sep), `${relative}: link leaves the topic directory: ${target}`);
        assert(fs.existsSync(destination), `${relative}: missing link destination: ${target}`);
    }
    for (const [, language, code] of content.matchAll(/^```([^\n]*)\n([\s\S]*?)^```/gmu)) {
        assert(!persianCharacters.test(code), `${relative}: Persian characters in ${language} code block`);
    }
}

const sourceExtensions = new Set(['.rs', '.toml', '.mjs', '.json']);
for (const filename of files.filter((item) => sourceExtensions.has(path.extname(item)))) {
    assert(!persianCharacters.test(fs.readFileSync(filename, 'utf8')), `${path.relative(root, filename)}: Persian characters in source/configuration`);
}

const binaries = fs.readdirSync(path.join(root, 'examples/src/bin')).filter((name) => name.endsWith('.rs')).sort();
checkSequence(binaries, 21, 'Examples');
for (const language of ['English', 'Persian']) {
    checkSequence(fs.readdirSync(path.join(root, 'lessons')).filter((name) => name.endsWith(`_${language}.md`)), 31, `${language} lessons`);
}
checkSequence(fs.readdirSync(path.join(root, 'projects'), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name), 3, 'Projects');
const coreManifest = fs.readFileSync(path.join(root, 'Cargo.toml'), 'utf8');
for (const member of ['examples', 'projects/001_log_search', 'projects/002_inventory']) {
    assert(coreManifest.includes(`"${member}"`), `Workspace member missing: ${member}`);
    assert(fs.existsSync(path.join(root, member, 'Cargo.toml')), `Manifest missing: ${member}`);
    if (member !== 'examples') assert(fs.existsSync(path.join(root, member, 'src/lib.rs')), `Library missing: ${member}`);
}
assert.doesNotThrow(() => JSON.parse(fs.readFileSync(path.join(root, 'projects/003_async_api/data/001_create_task.json'), 'utf8')));
const languagePairCount = markdownFiles.filter((filename) => filename.endsWith('_English.md')).length;
console.log(`Content checks passed: ${markdownFiles.length} Markdown files, ${languagePairCount} language pairs, 31 lessons per language, 21 examples, 3 projects.`);
console.log('These checks do not compile Rust or validate external websites.');
if (contentOnly) process.exit(0);

function runCargo(argumentsValue) {
    const options = { cwd: root, encoding: 'utf8', timeout: 180_000, windowsHide: true };
    const result = process.platform === 'win32'
        ? spawnSync('cmd.exe', ['/d', '/c', `cargo ${argumentsValue.join(' ')}`], options)
        : spawnSync('cargo', argumentsValue, options);
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    if (result.error) console.error(result.error.message);
    return result.status === 0;
}

if (!runCargo(['--version'])) {
    console.error('Cargo is unavailable. Rust checks were NOT run. Install the toolchain using lessons/002_installation_English.md.');
    process.exit(1);
}
const commands = [
    ['check', '--workspace', '--offline'],
    ['fmt', '--all', '--', '--check'],
    ['clippy', '--workspace', '--all-targets', '--offline', '--', '-D', 'warnings'],
    ['test', '--workspace', '--offline'],
    ...binaries.map((name) => ['run', '--quiet', '--offline', '-p', 'rust-lessons', '--bin', name.slice(0, -3)]),
    ['run', '--quiet', '--offline', '-p', 'inventory'],
    ['run', '--quiet', '--offline', '-p', 'log-search', '--', 'ERROR', 'projects/001_log_search/data/sample.log'],
];
if (withWeb) {
    const manifest = ['--manifest-path', 'projects/003_async_api/Cargo.toml'];
    commands.push(
        ['fmt', ...manifest, '--', '--check'],
        ['clippy', ...manifest, '--all-targets', '--', '-D', 'warnings'],
        ['test', ...manifest],
        ['run', ...manifest, '--bin', '001_bounded_jobs'],
    );
}
let failures = 0;
for (const command of commands) {
    console.log(`Running cargo ${command.join(' ')}`);
    if (!runCargo(command)) failures += 1;
}
if (failures > 0) {
    console.error(`${failures} Rust command(s) failed.`);
    process.exit(1);
}
console.log(withWeb ? 'Core and web checks passed.' : 'Core checks passed. Optional web checks were not selected.');
