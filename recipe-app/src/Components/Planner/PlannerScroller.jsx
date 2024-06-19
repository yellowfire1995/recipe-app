import { useMutation } from "@tanstack/react-query";
import Button from "react-bootstrap/esm/Button";
import { Link } from "react-router-dom";
import { deleteFromMealPlan } from "../../../db/queries";
import { queryClient } from "../../main";

export default function PlannerDayList(props) {
  const options = {
    weekday: "long",
    day: "numeric",
    month: "numeric",
  };
  const date = new Date(props.date).toLocaleDateString(undefined, options);

  const mealPlan = props.mealPlan;

  const dailyMeals = mealPlan.data
    .map((day) => {
      if (
        new Date(
          Date.parse(day.recipes[0].planDate) + 1000 * 60 * 60 * 24
        ).toLocaleDateString(undefined, options) == date
      ) {
        return { ...day };
      }
    })
    .filter((day) => {
      return day !== undefined;
    });

  const deleter = useMutation({
    mutationFn: (planId) => {
      return deleteFromMealPlan(planId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["MealPlan"],
        refetchType: "all",
      });
    },
  });

  return (
    <>
      <h3 key={date}>{date}</h3>
      {dailyMeals.length > 0
        ? dailyMeals[0].recipes.map((recipe) => {
            return (
              <p key={recipe.planId}>
                <Link to={`/recipes/${recipe.recipe_id}`}>{recipe.name}</Link>
                <Button size="sm" onClick={() => deleter.mutate(recipe.planId)}>
                  Delete
                </Button>
                <Button size="sm">Change Day</Button>
              </p>
            );
          })
        : null}
    </>
  );
}
