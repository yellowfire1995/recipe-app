import { createContext, useContext } from "react";

export const AddPhotoContext = createContext();

export function useAddPhotoContext() {
  const context = useContext(AddPhotoContext);
  if (!context) {
    throw new Error(
      "AddPhoto* component must be rendered within the RecipeForm.AddPhoto component"
    );
  }

  return context;
}
