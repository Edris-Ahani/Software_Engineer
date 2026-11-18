export class HttpError extends Error {
  constructor(status) {
    super("HTTP " + status);
    this.name = "HttpError";
    this.status = status;
  }
}

export async function fetchJson(url, { signal, timeoutMs = 3000, fetcher = fetch } = {}) {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new RangeError("Invalid timeout");
  const timeout = AbortSignal.timeout(timeoutMs);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
  const response = await fetcher(url, { signal: combined, headers: { Accept: "application/json" } });
  if (!response.ok) throw new HttpError(response.status);
  return response.json();
}

export function validateProductPayload(value) {
  if (!Array.isArray(value)) throw new TypeError("Expected an array");
  const ids = new Set();
  return value.map(item => {
    if (typeof item !== "object" || item === null || Array.isArray(item)
      || typeof item.id !== "string" || item.id.length === 0
      || typeof item.name !== "string" || item.name.trim().length === 0
      || !Number.isSafeInteger(item.priceCents) || item.priceCents < 0) {
      throw new TypeError("Invalid product");
    }
    if (ids.has(item.id)) throw new TypeError("Duplicate product id");
    ids.add(item.id);
    return { id: item.id, name: item.name, priceCents: item.priceCents };
  });
}

export function createLatestRequest() {
  let version = 0;
  let controller;
  return {
    begin() {
      controller?.abort();
      controller = new AbortController();
      const current = ++version;
      return { signal: controller.signal, isCurrent: () => current === version };
    },
    dispose() {
      ++version;
      controller?.abort();
    },
  };
}
