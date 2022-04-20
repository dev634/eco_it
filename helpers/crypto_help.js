const crypto = require("crypto");

if (!process.argv[2]) {
  console.log("Should a number");
  return;
}
let numKeys = process.argv[2];
let keys = {};
for (let i = 0; i < numKeys; i++) {
  keys[`key${i}`] = crypto.randomBytes(32).toString("hex");
}
console.table(keys);
