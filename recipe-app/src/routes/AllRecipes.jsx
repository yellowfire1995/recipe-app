import { Helmet } from "react-helmet-async";
import { getRecipeCards } from "../../db/queries";
import { MultiRecipeViewer } from "../Components/Recipes/MultiRecipeViewer/MultiRecipeViewer";

export default function AllRecipes() {
  return (
    <>
      <Helmet>
        <title>CookbookCalc | All Recipes</title>
      </Helmet>

      <MultiRecipeViewer query={getRecipeCards} queryKey="AllRecipes" />
    </>
  );
}
