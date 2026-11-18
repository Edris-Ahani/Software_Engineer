const original = { name: "Alex", address: { city: "Berlin" } };
const updated = { ...original, address: { ...original.address, city: "Hamburg" } };
console.log(original.address.city, updated.address.city);
console.log("Address shared:", original.address === updated.address);
const account = { name: "Alex", readName() { return this.name; } };
const bound = account.readName.bind(account);
console.log(bound());
