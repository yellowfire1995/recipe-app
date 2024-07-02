import Badge from "react-bootstrap/esm/Badge";
import { useRecipeContext } from "../RecipeContextProvider";

export function CuisineBadge() {
  const { recipe } = useRecipeContext();
  return recipe.cuisine.map((cuisine) => {
    return (
      <Badge bg="primary" key={cuisine.id}>
        {cuisine.cuisine}
      </Badge>
    );
  });
}
