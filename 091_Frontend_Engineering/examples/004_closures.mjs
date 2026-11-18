function createCounter() {
  let count = 0;
  return () => ++count;
}
export function debounce(callback, delayMs) {
  let timer;
  function run(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delayMs);
  }
  run.cancel = () => clearTimeout(timer);
  return run;
}
const first = createCounter();
const second = createCounter();
console.log(first(), first(), second());
const report = debounce(value => console.log("Settled:", value), 20);
report("old");
report("new");
