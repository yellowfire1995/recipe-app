import { ListGroup } from "react-bootstrap";
import { RecipeListItem } from "../Recipes/MultiRecipeViewer/ListView/RecipeListItem";

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
          Date.parse(day.recipes[0].planDate) + 1000 * 60 * 60 * 24,
        ).toLocaleDateString(undefined, options) === date
      ) {
        return { ...day };
      }
    })
    .filter((day) => {
      return day !== undefined;
    });

  if (dailyMeals.length > 0) {
    return (
      <>
        <h3 key={date}>{date}</h3>
        <ListGroup>
          {dailyMeals[0].recipes.map((recipe) => {
            return (
              // <div key={recipe.planId}>
              //   <Link to={`/recipes/${recipe.recipeId}`}>{recipe.name}</Link>
              //   <Button size="sm" onClick={() => deleter.mutate(recipe.planId)}>
              //     Delete
              //   </Button>
              //   <ChangeMealDay
              //     planId={recipe.planId}
              //     date={date}
              //     dateObject={props.date}
              //   />
              // </div
              <RecipeListItem
                key={recipe.planId}
                recipe={{ ...recipe, planDate: props.date }}
              />
            );
          })}
        </ListGroup>
      </>
    );
  } else {
    return (
      <>
        <h3 key={date}>{date}</h3>
        No recipes for this day.
      </>
    );
  }
}
