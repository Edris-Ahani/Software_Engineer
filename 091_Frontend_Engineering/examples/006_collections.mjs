const categories = new Map([["a", "Accessories"], ["b", "Books"]]);
const items = [{ id: "1", categoryId: "a" }, { id: "2", categoryId: "missing" }];
console.log(items.map(item => ({ ...item, category: categories.get(item.categoryId) ?? "Unknown" })));
console.log("Unique ids:", new Set(items.map(item => item.id)).size);
