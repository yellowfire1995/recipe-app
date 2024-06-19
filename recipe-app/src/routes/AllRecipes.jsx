import RecipeCards from "../Components/Recipes/View Recipe/RecipeCards.jsx";
import { Helmet } from "react-helmet-async";
import { getRecipeCards } from "../../db/queries";

export default function AllRecipes() {
  return (
    <>
      <Helmet>
        <title>CookbookCalc | All Recipes</title>
      </Helmet>
      <RecipeCards fetcher={getRecipeCards} queryKey="AllRecipes" />
    </>
  );
}
