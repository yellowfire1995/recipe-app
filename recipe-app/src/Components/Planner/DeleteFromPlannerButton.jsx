import { useMutation } from "@tanstack/react-query";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { deleteFromMealPlan } from "../../../db/queries";
import { queryClient } from "../../main";
import { useRecipeHeaderButtonsContext } from "../Recipes/Recipe Header/Buttons/RecipeHeaderButtonsContext";

export function DeleteFromPlannerButton() {
  const { recipe } = useRecipeHeaderButtonsContext();
  const { planId } = recipe;

  const { mutate } = useMutation({
    mutationFn: () => {
      return deleteFromMealPlan(planId);
    },
    onError: () => toast.error("Error deleting, please try again later."),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["MealPlan"],
        refetchType: "all",
      });
    },
  });

  return <Button onClick={mutate}>Delete from plan</Button>;
}
