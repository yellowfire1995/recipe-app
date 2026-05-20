import { getRecipeCards } from "../../db/queries";
import { FloatingActionButton } from "../Components/ActionButton/FloatingActionButton";
import { MultiRecipeViewer } from "../Components/Recipes/MultiRecipeViewer/MultiRecipeViewer";

export default function AllRecipes() {
  return (
    <>
      <title>CookbookCalc | All Recipes</title>

      <MultiRecipeViewer query={getRecipeCards} queryKey="AllRecipes" />
      <FloatingActionButton />
    </>
  );
}
