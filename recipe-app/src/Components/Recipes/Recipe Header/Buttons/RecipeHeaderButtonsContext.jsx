import { createContext, useContext } from "react";

export const RecipeHeaderButtonsContext = createContext();

export function useRecipeHeaderButtonsContext() {
  const context = useContext(RecipeHeaderButtonsContext);
  if (!context) {
    throw new Error(
      "RecipeHeaderButtons.* component must be rendered as child of RecipeHeaderButtons component"
    );
  }

  return context;
}
