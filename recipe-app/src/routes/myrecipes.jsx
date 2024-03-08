import RecipeCards from "../Components/RecipeCards";
import { getMyRecipeCards, getSidebarCuisines } from "../../db/queries";

export async function loader({ params }) {
  const allRecipes = await getMyRecipeCards();
  const sidebarCuisines = await getSidebarCuisines();

  return { allRecipes, sidebarCuisines };
}

export default function MyRecipes() {
  return <RecipeCards />;
}
