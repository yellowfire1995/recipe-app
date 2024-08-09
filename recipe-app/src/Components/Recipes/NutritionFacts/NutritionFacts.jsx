import { NutritionFactsContext } from "./NutritionFactsContext";
import { NutritionFactsHeader } from "./NutritionFactsHeader";
import { NutritionFactsTable } from "./NutritionFactsTable";

export function NutritionFacts({
  children,
  ingredientArray,
  setRecipe,
  servings,
}) {
  return (
    <NutritionFactsContext.Provider
      value={{ ingredientArray, setRecipe, servings }}
    >
      <section className="performance-facts ">{children}</section>
    </NutritionFactsContext.Provider>
  );
}

NutritionFacts.Table = NutritionFactsTable;
NutritionFacts.Header = NutritionFactsHeader;
