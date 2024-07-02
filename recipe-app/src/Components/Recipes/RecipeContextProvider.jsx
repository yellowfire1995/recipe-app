import { createContext, useContext } from "react";

export const RecipeContext = createContext();

export function useRecipeContext() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error(
      "Recipe.* component must be rendered as child of Recipe component"
    );
  }

  return context;
}
