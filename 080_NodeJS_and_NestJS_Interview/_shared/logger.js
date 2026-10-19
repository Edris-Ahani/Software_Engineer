/**
 * Shared console helpers for detailed, readable demo output.
 */

function line(char = "=", width = 64) {
  return char.repeat(width);
}

function title(text) {
  console.log("\n" + line("="));
  console.log(`  ${text}`);
  console.log(line("="));
}

function section(text) {
  console.log("\n" + line("-", 48));
  console.log(`> ${text}`);
  console.log(line("-", 48));
}

function step(label, value) {
  if (arguments.length === 1) {
    console.log(`  • ${label}`);
    return;
  }
  console.log(`  • ${label}:`, value);
}

function note(text) {
  console.log(`  ℹ ${text}`);
}

function ok(text) {
  console.log(`  ✓ ${text}`);
}

function warn(text) {
  console.log(`  ! ${text}`);
}

module.exports = { title, section, step, note, ok, warn, line };
