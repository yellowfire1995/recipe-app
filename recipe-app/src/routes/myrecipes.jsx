import RecipeCards from "../Components/RecipeCards";
import Sidebar from "../Components/Sidebar";
import { getCollectionRecipes, getSidebarCuisines } from "../../db/queries";
import { getMyRecipeCards } from "../../db/queries";
import Col from "react-bootstrap/esm/Col.js";
import { Button } from "bootstrap";

export default function MyRecipes() {
  return (
    <>
      <RecipeCards fetcher={getMyRecipeCards} queryKey="MyRecipes" />
    </>
  );
}
