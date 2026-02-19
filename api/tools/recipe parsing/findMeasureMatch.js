const foodMeasurements = [
  {
    measurement: /^t(ea)?sp(oon)?s?/i,
    conversionFactor: 0.0208333,
    type: "volume",
  },
  {
    measurement: /^ta?b(le)?sp(oon)?s?/i,
    conversionFactor: 0.0625,
    type: "volume",
  },
  { measurement: /^(cup)s?/i, conversionFactor: 1, type: "volume" },
  { measurement: /^(c$)/i, conversionFactor: 1, type: "volume" },
  {
    measurement: /^(pound)s?/i,
    conversionFactor: 0.00220462442,
    type: "weight",
  },
  {
    measurement: /^o(unce)?z?s?/i,
    conversionFactor: 0.0352739907,
    type: "weight",
  },

  { measurement: /^g(ram)?s?/i, conversionFactor: 1, type: "weight" },
  { measurement: /^(g$)s?/i, conversionFactor: 1, type: "weight" },
  {
    measurement: /^m(illi)?g(ram)?s?/i,
    conversionFactor: 1000,
    type: "weight",
  },
  {
    measurement: /^k(ilo)?g(ram)?s?/i,
    conversionFactor: 0.001,
    type: "weight",
  },

  {
    measurement: /(^lb)s?/i,
    conversionFactor: 0.00220462442,
    type: "weight",
  },
];

export async function findMeasureMatch(
  userMeasure,
  dbMeasure,
  gramsPerDbMeasure,
) {
  try {
    const userMeasureMatch = foodMeasurements.find((m) =>
      m.measurement.test(userMeasure),
    );

    const dbMeasureMatch = foodMeasurements.find((m) =>
      m.measurement.test(dbMeasure),
    );

    if (userMeasureMatch.type === "weight") {
      return userMeasureMatch.conversionFactor;
    } else if (
      userMeasureMatch.type === "volume" &&
      dbMeasureMatch.type === "volume"
    ) {
      return (
        (dbMeasureMatch.conversionFactor / userMeasureMatch.conversionFactor) *
        gramsPerDbMeasure
      );
    } else {
      return null;
    }
  } catch {
    return null;
  }
}
