import RecipeCards from "../Components/RecipeCards";
import Sidebar from "../Components/Sidebar";
import { getSidebarCuisines } from "../../db/queries";
import { getRecipeCards } from "../../db/queries";
import Col from "react-bootstrap/esm/Col.js";

export default function AllRecipes() {
  return (
    <>
      <RecipeCards fetcher={getRecipeCards} queryKey="AllRecipes" />
    </>
  );
}
