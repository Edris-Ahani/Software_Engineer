exports.loaded = false;
const b = require("./circular-b.js");

exports.loaded = true;
exports.name = "A";
exports.fromB = b.name;
exports.demo = function demo() {
  return {
    aName: exports.name,
    bName: b.name,
    bSeesADuringInit: b.sawA,
  };
};
