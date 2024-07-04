import { NutritionFactsContext } from "./NutritionFactsContext";
import { NutritionFactsHeader } from "./NutritionFactsHeader";
import { NutritionFactsTable } from "./NutritionFactsTable";

export function NutritionFacts({ children, ingredientArray, setRecipe }) {
  return (
    <NutritionFactsContext.Provider value={{ ingredientArray, setRecipe }}>
      <section className="performance-facts">{children}</section>
    </NutritionFactsContext.Provider>
  );
}

NutritionFacts.Table = NutritionFactsTable;
NutritionFacts.Header = NutritionFactsHeader;
