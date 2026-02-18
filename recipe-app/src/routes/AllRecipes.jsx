import { getRecipeCards } from "../../db/queries";
import { MultiRecipeViewer } from "../Components/Recipes/MultiRecipeViewer/MultiRecipeViewer";

export default function AllRecipes() {
  return (
    <>
      <title>CookbookCalc | All Recipes</title>

      <MultiRecipeViewer query={getRecipeCards} queryKey="AllRecipes" />
    </>
  );
}
