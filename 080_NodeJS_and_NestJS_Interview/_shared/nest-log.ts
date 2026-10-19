/** Shared logging helpers for NestJS demos (TypeScript). */

export function title(text: string): void {
  console.log("\n" + "=".repeat(64));
  console.log(`  ${text}`);
  console.log("=".repeat(64));
}

export function section(text: string): void {
  console.log("\n" + "-".repeat(48));
  console.log(`> ${text}`);
  console.log("-".repeat(48));
}

export function step(label: string, value?: unknown): void {
  if (arguments.length === 1) {
    console.log(`  • ${label}`);
    return;
  }
  console.log(`  • ${label}:`, value);
}

export function note(text: string): void {
  console.log(`  ℹ ${text}`);
}

export function ok(text: string): void {
  console.log(`  ✓ ${text}`);
}

export function warn(text: string): void {
  console.log(`  ! ${text}`);
}

export async function getJson(url: string, init?: RequestInit): Promise<{ status: number; body: any }> {
  const res = await fetch(url, init);
  const text = await res.text();
  let body: any = text;
  try {
    body = JSON.parse(text);
  } catch {
    // keep text
  }
  return { status: res.status, body };
}
