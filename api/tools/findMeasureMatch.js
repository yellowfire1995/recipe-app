const foodMeasurements = [
  {
    measurement: /^on?(unce)?z?s?/i,
    conversionFactor: 0.035273,
  },
  {
    measurement: /^pounds?/i,
    conversionFactor: 0.00220462442,
  },
  { measurement: /^g(ram)?s?/i, conversionFactor: 1, type: "weight" },
  {
    measurement: /^m(illi)?g(ram)?s?/i,
    conversionFactor: 1000,
    type: "weight",
  },
  { measurement: /^k(ilo)?g(ram)?s?/i, conversionFactor: 1000, type: "weight" },
  {
    measurement: /^lbs?/i,
    conversionFactor: 0.00220462442,
  },
];

export async function findMeasureMatch(unitOfMeasure) {
  try {
    const conversion = foodMeasurements.find((m) =>
      m.measurement.test(unitOfMeasure)
    );

    return conversion.conversionFactor;
  } catch (error) {
    return null;
  }
}
