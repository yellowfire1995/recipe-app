import Badge from "react-bootstrap/esm/Badge";
import { useRecipeContext } from "../RecipeContextProvider";

export function CategoryBadge() {
  const { recipe } = useRecipeContext();
  return recipe.category.map((category) => {
    return (
      <Badge bg="primary" key={category.id}>
        {category.category}
      </Badge>
    );
  });
}
