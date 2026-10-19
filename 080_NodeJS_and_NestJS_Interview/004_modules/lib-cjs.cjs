function greet(name) {
  return `Hello from CJS, ${name}`;
}

module.exports = { greet, kind: "commonjs" };
