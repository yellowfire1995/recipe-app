import Row from "react-bootstrap/esm/Row";
import { useRecipeContext } from "../RecipeContextProvider";
import Col from "react-bootstrap/esm/Col";
import { RecipeRating } from "../Rating/RecipeRating";
import { queryClient } from "../../../main";

export function RecipeHeader({ price, buttons, credit }) {
  const { recipe, setRecipe } = useRecipeContext();
  const rating = Math.round(recipe.rating * 10) / 10;
  const refetch = async () => {
    await queryClient.invalidateQueries({
      queryKey: [`Recipe${recipe.recipeId}`],
      refetchType: "all",
    });
  };

  return (
    <>
      <Row>
        <Col className="d-flex justify-content-between">{credit}</Col>
      </Row>
      <Row>
        {" "}
        <Col className="d-flex flex-wrap">
          <Col xl={8} className="d-flex align-items-center ">
            <h2>{recipe.name}</h2>
            {buttons}
            <RecipeRating
              className="ms-2"
              recipe={recipe}
              setRecipe={setRecipe}
              refetch={refetch}
            />
            {`(average ${rating})`}
          </Col>

          <hr />
          <div className="d-flex">{price}</div>
        </Col>
      </Row>
    </>
  );
}
