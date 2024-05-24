import RecipeCards from "../Components/RecipeCards";
import { getMyRecipeCards } from "../../db/queries";
import { Helmet } from "react-helmet";

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
