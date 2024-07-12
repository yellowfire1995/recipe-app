import { useRecipeContext } from "../RecipeContextProvider";

export function RecipePrice() {
  const { recipe } = useRecipeContext();
  const recipePrice = (
    Math.round(
      recipe.ingredients
        .map((ingredient) => ingredient.price * ingredient.quantity)
        .reduce((partialSum, a) => partialSum + a, 0) * 100
    ) / 100
  ).toFixed(2);
  if (recipePrice > 0) {
    return (
      <>
        - ${recipePrice} ($
        {(recipePrice / recipe.servings).toFixed(2)}
        /serving){" "}
      </>
    );
  }
}
