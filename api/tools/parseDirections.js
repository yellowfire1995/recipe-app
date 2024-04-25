export default function parseDirections(directions) {
  const directionArray = [];
  const prefilterDirections = directions
    .replace(/^(\d+\.?)||^[•]/gm, "")
    .trim();
  const directionLines = prefilterDirections
    .split("\n")
    .filter((direction) => direction != "");
  for (let i = 0; i < directionLines.length; i++) {
    const directionList = {
      id: i,
      step_num: i,
      step: directionLines[i],
    };
    directionArray.push(directionList);
  }

  return directionArray;
}
