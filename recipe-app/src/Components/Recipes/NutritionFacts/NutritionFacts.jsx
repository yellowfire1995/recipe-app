import { NutritionFactsContext } from "./NutritionFactsContext";
import { NutritionFactsHeader } from "./NutritionFactsHeader";
import { NutritionFactsTable } from "./NutritionFactsTable";

export function NutritionFacts({ children, recipe }) {
  return (
    <NutritionFactsContext.Provider value={recipe}>
      <section className="performance-facts">{children}</section>
    </NutritionFactsContext.Provider>
  );
}

NutritionFacts.Table = NutritionFactsTable;
NutritionFacts.Header = NutritionFactsHeader;
