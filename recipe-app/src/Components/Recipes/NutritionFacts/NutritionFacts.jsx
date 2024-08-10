import { Container } from "react-bootstrap";
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
      <Container fluid className="d-flex p-0 m-0 justify-content-center">
        <section className="performance-facts">{children}</section>
      </Container>
    </NutritionFactsContext.Provider>
  );
}

NutritionFacts.Table = NutritionFactsTable;
NutritionFacts.Header = NutritionFactsHeader;
