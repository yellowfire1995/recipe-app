import { getMyRecipeCards } from "../../db/queries.js";
import { MultiRecipeViewer } from "../Components/Recipes/MultiRecipeViewer/MultiRecipeViewer.jsx";

export default function MyRecipes() {
  return (
    <>
      <title>CookbookCalc | My Recipes</title>

      <MultiRecipeViewer query={getMyRecipeCards} queryKey="MyRecipes" />
    </>
  );
}
