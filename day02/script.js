const fs = require("fs");
const path = require("path");
const performance = require("perf_hooks").performance;

/** DATA LOAD */
const data = fs
  .readFileSync(path.join(__dirname, "data.test.txt"), "utf8")
  .split("\n"); // MAC
  // .split("\r\n"); // WINDOWS

const dataParsed = data.map((line, idx) => {
  const gameData = line.split(":");
  const gameId = gameData[0].split(" ")[1];

  const sets = gameData[1].split(";").map((set) => {
    const cubeData = set.split(",");
    const cubes = {};
    cubeData.forEach((cube) => {
      const data = cube.split(" ").filter((el) => !!el.length);
      cubes[data[1].trim()] = Number(data[0]);
    });
    return cubes;
  });
  return { id: Number(gameId), sets: sets };
});

/** PART 1 */
let t0 = performance.now();

let resultOne = 0;

dataParsed.forEach((game) => {
  const notValid = game.sets.some(
    (set) => set.red > 12 || set.green > 13 || set.blue > 14
  );
  if (!notValid) resultOne += game.id;
});

/** PART 1 TIMER STOP */
let t1 = performance.now() - t0;

/**********************************************************/

/** PART 2 */
t0 = performance.now();

let resultTwo = 0;

dataParsed.forEach((game) => {
  const minCount = {
    red: 0,
    green: 0,
    blue: 0,
  };
  game.sets.forEach((set) => {
    if (set.red > minCount.red) minCount.red = set.red;
    if (set.green > minCount.green) minCount.green = set.green;
    if (set.blue > minCount.blue) minCount.blue = set.blue;
  });
  resultTwo += minCount.red * minCount.green * minCount.blue;
});

/** PART 2 TIMER STOP */
let t2 = performance.now() - t0;

console.log("=============================================");
console.log("Part 1 result:", resultOne);
console.log(`Execution time: ${t1.toFixed(3)} ms`);
console.log("=============================================");
console.log("Part 2 result:", resultTwo);
console.log(`Execution time: ${t2.toFixed(3)} ms`);
console.log("=============================================");
