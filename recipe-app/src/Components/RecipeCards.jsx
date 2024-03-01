import { useLoaderData } from "react-router-dom";
import Col from "react-bootstrap/esm/Col.js";
import { getRecipeCards, getSidebarCuisines } from "../../db/queries.js";
import RecipeCardData from "./RecipeCard.jsx";
import Sidebar from "./Sidebar.jsx";

export async function action({ params, request }) {
  return redirect(`/`);
}

export async function loader({ params }) {
  const allRecipes = await getRecipeCards();
  const sidebarCuisines = await getSidebarCuisines();

  return { allRecipes, sidebarCuisines };
}

export default function RecipeCards() {
  return (
    <>
      <Col className="col-2 user-select-none">
        <Sidebar cuisines={useLoaderData().sidebarCuisines} />
      </Col>

      <Col style={{ minWidth: "100px" }}>
        <RecipeCardData recipes={useLoaderData().allRecipes} />
      </Col>
    </>
  );
}
