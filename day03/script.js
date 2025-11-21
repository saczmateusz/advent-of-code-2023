const fs = require("fs");
const path = require("path");
const performance = require("perf_hooks").performance;

/** DATA LOAD */
const data = fs
  .readFileSync(path.join(__dirname, "data.test.txt"), "utf8")
  .split("\r\n"); // WINDOWS
// .split("\n"); // MAC

const array2D = data.map((line) => line.split(""));

function getNumber(ch) {
  if (isNaN(Number(ch))) return null;
  return Number(ch);
}

function checkPrev(line, currentPos, len, symbol) {
  const posToCheck = currentPos - len - 1;
  const valToCheck = array2D[line][posToCheck];
  if (posToCheck < 0) return -1;
  if (symbol != null && valToCheck === symbol) return posToCheck;
  if (valToCheck === ".") return -1;
  return posToCheck;
}

function checkNext(line, currentPos, symbol) {
  const valToCheck = array2D[line][currentPos];
  if (symbol != null && valToCheck === symbol) return currentPos;
  if (!valToCheck || valToCheck === ".") return -1;
  return currentPos;
}

function checkUpper(line, currentPos, len, symbol) {
  if (line === 0) return -1;
  const posToCheckStart =
    currentPos - len - 1 < 0 ? currentPos - len : currentPos - len - 1;
  const posToCheckEnd =
    currentPos >= array2D[line].length ? currentPos : currentPos + 1;

  const lineValSlice = array2D[line - 1].slice(posToCheckStart, posToCheckEnd);

  if (symbol != null) {
    const idxOfSymbol = lineValSlice.indexOf(symbol);
    if (idxOfSymbol === -1) return -1;
    else return idxOfSymbol + posToCheckStart;
  }

  const lineValFiltered = lineValSlice.filter(
    (l) => l !== "." && getNumber(l) === null
  );

  if (lineValFiltered.length) return 1;
  return -1;
}

function checkLower(line, currentPos, len, symbol) {
  if (line === array2D.length - 1) return -1;
  const posToCheckStart =
    currentPos - len - 1 < 0 ? currentPos - len : currentPos - len - 1;
  const posToCheckEnd =
    currentPos >= array2D[line].length ? currentPos : currentPos + 1;

  const lineValSlice = array2D[line + 1].slice(posToCheckStart, posToCheckEnd);

  if (symbol != null) {
    const idxOfSymbol = lineValSlice.indexOf(symbol);
    if (idxOfSymbol === -1) return -1;
    else return idxOfSymbol + posToCheckStart;
  }

  const lineValFiltered = lineValSlice.filter(
    (l) => l !== "." && getNumber(l) === null
  );

  if (lineValFiltered.length) return 1;
  return -1;
}

/** PART 1 */
let t0 = performance.now();

let resultOne = 0;

let partNumbers = [];

for (let line = 0; line < array2D.length; line++) {
  const currentLine = array2D[line];

  let currentPos = 0;
  let currentNumber = "";
  while (currentPos <= currentLine.length) {
    const currCh = currentLine[currentPos];
    if (getNumber(currCh) !== null) currentNumber += currCh;
    else {
      if (currentNumber.length) {
        const partNumberCandidate = getNumber(currentNumber);
        if (
          checkPrev(line, currentPos, currentNumber.length) !== -1 ||
          checkNext(line, currentPos) !== -1 ||
          checkUpper(line, currentPos, currentNumber.length) !== -1 ||
          checkLower(line, currentPos, currentNumber.length) !== -1
        ) {
          partNumbers.push(partNumberCandidate);
        }
      }
      currentNumber = "";
    }

    currentPos++;
  }
}

resultOne = partNumbers.reduce((prev, curr) => prev + curr, 0);

/** PART 1 TIMER STOP */
let t1 = performance.now() - t0;

/**********************************************************/

/** PART 2 */
t0 = performance.now();

let resultTwo = 0;

let gearCandidates = [];

for (let line = 0; line < array2D.length; line++) {
  const currentLine = array2D[line];

  let currentPos = 0;
  let currentNumber = "";
  while (currentPos <= currentLine.length) {
    const currCh = currentLine[currentPos];
    if (getNumber(currCh) !== null) currentNumber += currCh;
    else {
      if (currentNumber.length) {
        const partNumberCandidate = getNumber(currentNumber);
        let starPosCandidates = [
          checkPrev(line, currentPos, currentNumber.length, "*"),
          checkNext(line, currentPos, "*"),
          checkUpper(line, currentPos, currentNumber.length, "*"),
          checkLower(line, currentPos, currentNumber.length, "*"),
        ];

        const starPosPosition = starPosCandidates.findIndex((s) => s > -1);

        if (starPosPosition !== -1) {
          gearCandidates.push({
            num: partNumberCandidate,
            starPos: {
              x: starPosCandidates[starPosPosition],
              y:
                line +
                (starPosPosition === 2 ? -1 : starPosPosition === 3 ? 1 : 0),
            },
          });
        }
      }
      currentNumber = "";
    }

    currentPos++;
  }
}

let gearCandidatesFiltered = [];

for (let i = 0; i < gearCandidates.length; i++) {
  const g = gearCandidates[i];

  for (let j = i + 1; j < gearCandidates.length; j++) {
    const g2 = gearCandidates[j];
    if (g.starPos.x === g2.starPos.x && g.starPos.y === g2.starPos.y) {
      gearCandidatesFiltered.push(g.num * g2.num);
    }
  }
}
resultTwo = gearCandidatesFiltered.reduce((prev, curr) => prev + curr, 0);

/** PART 2 TIMER STOP */
let t2 = performance.now() - t0;

console.log("=============================================");
console.log("Part 1 result:", resultOne);
console.log(`Execution time: ${t1.toFixed(3)} ms`);
console.log("=============================================");
console.log("Part 2 result:", resultTwo);
console.log(`Execution time: ${t2.toFixed(3)} ms`);
console.log("=============================================");
