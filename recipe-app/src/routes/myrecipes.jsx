import RecipeCards from "../Components/RecipeCards";
import Sidebar from "../Components/Sidebar";
import { getSidebarCuisines } from "../../db/queries";
import { getMyRecipeCards } from "../../db/queries";
import Col from "react-bootstrap/esm/Col.js";

export default function MyRecipes() {
  return (
    <>
      <RecipeCards fetcher={getMyRecipeCards} queryKey="MyRecipes" />
    </>
  );
}
