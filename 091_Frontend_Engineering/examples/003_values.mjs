import { cartTotal } from "../lib/products.mjs";
console.log("Total cents:", cartTotal([{ priceCents: 4500, quantity: 2 }, { priceCents: 700, quantity: 1 }]));
console.log("Nullish default:", 0 ?? 10, "Falsy default:", 0 || 10);
try { cartTotal([{ priceCents: -1, quantity: 1 }]); }
catch (error) { console.log("Rejected:", error.message); }
