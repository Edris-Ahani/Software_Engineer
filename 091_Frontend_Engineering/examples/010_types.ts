type Product = Readonly<{ id: string; priceCents: number }>;
type LoadState =
  | { status: "idle" | "loading" }
  | { status: "success"; data: readonly Product[] }
  | { status: "error"; message: string };

function assertNever(value: never): never {
  throw new Error("Unhandled state: " + JSON.stringify(value));
}
function describe(state: LoadState): string {
  switch (state.status) {
    case "idle": return "Ready";
    case "loading": return "Loading";
    case "success": return state.data.length + " products";
    case "error": return state.message;
    default: return assertNever(state);
  }
}
function getProperty<T, K extends keyof T>(record: T, key: K): T[K] {
  return record[key];
}
console.log(describe({ status: "success", data: [{ id: "keyboard", priceCents: 4500 }] }));
console.log(getProperty({ id: "keyboard", priceCents: 4500 }, "priceCents"));
export {};
