import RecipeCards from "../Components/Recipes/View Recipe/RecipeCards.jsx";
import { getMyRecipeCards } from "../../db/queries";
import { Helmet } from "react-helmet-async";

export default function MyRecipes() {
  return (
    <>
      <Helmet>
        <title>CookbookCalc | My Recipes</title>
      </Helmet>
      <RecipeCards fetcher={getMyRecipeCards} queryKey="MyRecipes" />
    </>
  );
}
