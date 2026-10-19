exports.name = "B";
const a = require("./circular-a.js");

// While A is still initializing, a.name / a.loaded may be incomplete
exports.sawA = {
  name: a.name,
  loaded: a.loaded,
};
