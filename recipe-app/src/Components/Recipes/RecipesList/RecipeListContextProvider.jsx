import { createContext, useContext } from "react";

export const RecipeListContext = createContext();

export function useRecipeListContext() {
  const context = useContext(RecipeListContext);
  if (!context) {
    throw new Error(
      "RecipeList.* component must be rendered as child of RecipeList component"
    );
  }

  return context;
}
