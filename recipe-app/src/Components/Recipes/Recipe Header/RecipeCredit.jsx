import { useRecipeContext } from "../RecipeContextProvider";
import Col from "react-bootstrap/esm/Col.js";

export function RecipeCredit() {
  const { recipe } = useRecipeContext();
  return (
    <>
      <Col>{recipe.url ? <a href={recipe.url}>Original Recipe</a> : ""}</Col>
      <Col className="text-end">{recipe.nickname}&apos;s recipe</Col>
    </>
  );
}
