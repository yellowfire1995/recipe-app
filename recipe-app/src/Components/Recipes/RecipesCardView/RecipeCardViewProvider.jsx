import { createContext, useContext } from "react";

export const RecipeCardContext = createContext();

export function useRecipeCardContext() {
  const context = useContext(RecipeCardContext);
  if (!context) {
    throw new Error(
      "RecipeCard.* component must be rendered as child of RecipeCard component"
    );
  }

  return context;
}
