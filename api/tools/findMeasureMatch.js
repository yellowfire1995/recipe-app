const foodMeasurements = [
  {
    measurement: /^t(ea)?sp(oon)?s?/i,
    conversionFactor: 0.0208333,
    type: "volume",
  }, // 1 teaspoon = 5 grams
  {
    measurement: /^ta?b(le)?sp(oon)?s?/i,
    conversionFactor: 0.0625,
    type: "volume",
  }, // 1 tablespoon = 15 grams
  { measurement: /^c(up)?s?/i, conversionFactor: 1, type: "volume" }, // 1 cup = 240 grams
  { measurement: /^o(unce)?z?s?/i, conversionFactor: 28.3495, type: "weight" }, // 1 ounce = 28.3495 grams
  {
    measurement: /^pounds?/i,
    conversionFactor: 453.592,
    type: "weight",
  }, // 1 pound = 453.592 grams
  { measurement: /^g(ram)?s?/i, conversionFactor: 1, type: "weight" }, // 1 gram = 1 gram (just for completeness)
  {
    measurement: /^m(illi)?g(ram)?s?/i,
    conversionFactor: 0.001,
    type: "weight",
  }, // 1 milligram = 0.001 grams
  { measurement: /^k(ilo)?g(ram)?s?/i, conversionFactor: 1000, type: "weight" }, // 1 kilogram = 1000 grams
  // Add more measurements as needed
  {
    measurement: /^lbs?/i,
    conversionFactor: 453.592,
    type: "weight",
  }, // 1 pound = 453.592 grams
  {
    measurement: /^g(ram)?s?/i,
    conversionFactor: 1,
    type: "weight",
  }, // 1 pound = 453.592 grams
];

export async function findMeasureMatch([dbMeasure, origMeasure]) {
  const origType = foodMeasurements.find((foodMeasurement) =>
    foodMeasurement.measurement.test(origMeasure)
  )
    ? foodMeasurements.find((foodMeasurement) =>
        foodMeasurement.measurement.test(origMeasure)
      ).type
    : 0;

  const dbType = foodMeasurements.find((foodMeasurement) =>
    foodMeasurement.measurement.test(dbMeasure)
  )
    ? foodMeasurements.find((foodMeasurement) =>
        foodMeasurement.measurement.test(dbMeasure)
      ).type
    : 0;

  const origMatchable =
    origType == "volume"
      ? foodMeasurements.find((foodMeasurement) =>
          foodMeasurement.measurement.test(origMeasure)
        ).conversionFactor
      : origType == "weight"
      ? foodMeasurements.find((foodMeasurement) =>
          foodMeasurement.measurement.test(origMeasure)
        ).conversionFactor
      : 0;

  const dbMatchable =
    dbType == "volume" && origType == "volume"
      ? foodMeasurements.find((foodMeasurement) =>
          foodMeasurement.measurement.test(dbMeasure)
        ).conversionFactor
      : 1;

  const conversion = origMatchable / dbMatchable;

  return [conversion, origType];
}
