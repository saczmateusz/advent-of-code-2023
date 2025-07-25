const fs = require("fs");
const path = require("path");
const performance = require("perf_hooks").performance;

/** DATA LOAD */
const data = fs
  .readFileSync(path.join(__dirname, "data.test.txt"), "utf8")
  .split("\r\n");

const sumNumbersFromFirstAndLastDigits = (prev, curr) =>
  prev + Number(`${curr[0] || 0}${curr[curr.length - 1] || 0}`);

/** PART 1 */
let t0 = performance.now();

let resultOne = data
  .map((line) =>
    line
      .split("")
      .filter((c) => !isNaN(Number(c)))
      .map((c) => Number(c))
  )
  .reduce(sumNumbersFromFirstAndLastDigits, 0);

let t1 = performance.now() - t0;

const numMap = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

/** PART 2 */
t0 = performance.now();

let resultTwo = 0;
const resArray = [];

data.map((line) => line.split("")).forEach((ca) => {
  const nums = [];
  let i = 0;
  while (i < ca.length) {
    if (!isNaN(Number(ca[i]))) {
      nums.push(Number(ca[i]));
      i++;
      continue;
    }
    const substr = ca.slice(i, i + 5).join("");
    for (let x in numMap) if (substr.startsWith(x)) nums.push(numMap[x]);
    i++;
  }
  resArray.push(nums);
});

resultTwo = resArray.reduce(sumNumbersFromFirstAndLastDigits, 0);

let t2 = performance.now() - t0;

console.log("=============================================");
console.log("Part 1 result:", resultOne);
console.log(`Execution time: ${t1.toFixed(3)} ms`);
console.log("=============================================");
console.log("Part 2 result:", resultTwo);
console.log(`Execution time: ${t2.toFixed(3)} ms`);
console.log("=============================================");
