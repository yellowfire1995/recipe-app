import { useRecipeContext } from "../RecipeContextProvider";

export function RecipeCredit() {
  const { recipe } = useRecipeContext();
  return (
    <>
      <a href={recipe.url}>Original Recipe</a>
      {recipe.nickname}&apos;s recipe
    </>
  );
}
