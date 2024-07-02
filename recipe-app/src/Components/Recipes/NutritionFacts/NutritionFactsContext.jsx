import { createContext, useContext } from "react";

export const NutritionFactsContext = createContext();

export function useNutritionFactsContext() {
  const context = useContext(NutritionFactsContext);
  if (!context) {
    throw new Error(
      "NutritionFacts.* component must be rendered as child of NutritionFacts component"
    );
  }

  return context;
}
