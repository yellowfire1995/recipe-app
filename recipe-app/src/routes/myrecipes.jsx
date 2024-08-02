import { Helmet } from "react-helmet-async";
import { RecipeList } from "../Components/Recipes/RecipesList/RecipesList.jsx";

export default function MyRecipes() {
  return (
    <>
      <Helmet>
        <title>CookbookCalc | My Recipes</title>
      </Helmet>
      <RecipeList />
    </>
  );
}
