import { Helmet } from "react-helmet-async";
import { getMyRecipeCards } from "../../db/queries.js";
import { MultiRecipeViewer } from "../Components/Recipes/MultiRecipeViewer/MultiRecipeViewer.jsx";

export default function MyRecipes() {
  return (
    <>
      <Helmet>
        <title>CookbookCalc | My Recipes</title>
      </Helmet>
      <MultiRecipeViewer query={getMyRecipeCards} queryKey="MyRecipes" />
    </>
  );
}
