exports.loaded = false;
//exports.name = "A"; //we can used of it here for solve warning
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
