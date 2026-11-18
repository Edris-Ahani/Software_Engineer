export const products = Object.freeze([
  Object.freeze({ id: "keyboard", name: "Keyboard", category: "Accessories", priceCents: 4500 }),
  Object.freeze({ id: "monitor", name: "Monitor", category: "Displays", priceCents: 18900 }),
  Object.freeze({ id: "notebook", name: "Notebook", category: "Stationery", priceCents: 700 }),
]);

/** @param {typeof products} items @param {string} query */
export function searchProducts(items, query) {
  const normalized = query.trim().toLocaleLowerCase("en-US");
  return items.filter(item => item.name.toLocaleLowerCase("en-US").includes(normalized));
}

/** @param {{ priceCents: number, quantity: number }[]} items */
export function cartTotal(items) {
  let total = 0;
  for (const { priceCents, quantity } of items) {
    if (!Number.isSafeInteger(priceCents) || !Number.isSafeInteger(quantity)
      || priceCents < 0 || quantity < 0) throw new TypeError("Invalid cart item");
    total += priceCents * quantity;
    if (!Number.isSafeInteger(total)) throw new RangeError("Total exceeds safe integer range");
  }
  return total;
}
