import { RecipeContext } from "./RecipeContextProvider";
import { CategoryBadge } from "./View Recipe/CategoryBadge";
import { CuisineBadge } from "./View Recipe/CuisineBadge";
import { DirectionList } from "./View Recipe/DirectionList";
import { IngredientList } from "./View Recipe/IngredientList";
import { RecipeCredit } from "./View Recipe/RecipeCredit";
import { RecipePrice } from "./View Recipe/RecipePrice";

export function Recipe2({ children, recipe, setRecipe }) {
  console.log(recipe);
  return (
    <RecipeContext.Provider value={{ recipe, setRecipe }}>
      {children}
    </RecipeContext.Provider>
  );
}

Recipe2.IngredientList = IngredientList;
Recipe2.DirectionList = DirectionList;
Recipe2.CuisineBadge = CuisineBadge;
Recipe2.CategoryBadge = CategoryBadge;
Recipe2.RecipeCredit = RecipeCredit;
Recipe2.RecipePrice = RecipePrice;
