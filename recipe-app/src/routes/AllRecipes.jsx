import RecipeCards from "../Components/RecipeCards";
import Sidebar from "../Components/Sidebar";
import { getSidebarCuisines } from "../../db/queries";
import { getRecipeCards } from "../../db/queries";
import Col from "react-bootstrap/esm/Col.js";

export default function AllRecipes() {
  return (
    <>
      <Col className="col-2 user-select-none">
        <Sidebar fetcher={getSidebarCuisines} />
      </Col>

      <Col style={{ minWidth: "100px" }}>
        <RecipeCards fetcher={getRecipeCards} queryKey="AllRecipes" />
      </Col>
    </>
  );
}
