export default function parseDirections(directions) {
  const directionArray = [];
  const prefilterDirections = directions
    .replace(/^(\d+\.?)||^[•]/gm, "")
    .trim();

  const directionLines = prefilterDirections
    .split("\n")
    .filter((direction) => direction !== "");

  const limit = Math.min(directionLines.length, 50);

  for (let i = 0; i < limit; i++) {
    const directionList = {
      id: i,
      step_num: i,
      step: directionLines[i],
    };
    directionArray.push(directionList);
  }

  return directionArray;
}
