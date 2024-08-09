import Row from "react-bootstrap/esm/Row";
import { useRecipeContext } from "../RecipeContextProvider";
import Col from "react-bootstrap/esm/Col";
import { RecipeRating } from "../Rating/RecipeRating";
import { queryClient } from "../../../main";
import { useAuth0 } from "@auth0/auth0-react";

export function RecipeHeader({ price, buttons, credit }) {
  const { recipe, setRecipe } = useRecipeContext();
  const { isAuthenticated } = useAuth0();
  const title = isAuthenticated ? buttons : recipe.name;

  const ratingCount = recipe.rating > 0 ? `(${recipe.rating} rating)` : "";
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
        <Col className="d-inline-flex flex-wrap align-items-center">
          <h2 className="d-flex flex-wrap align-items-center">{title}</h2>
          <div className="d-flex text-nowrap">
            <RecipeRating
              className="ms-2"
              recipe={recipe}
              setRecipe={setRecipe}
              refetch={refetch}
            />
            {ratingCount}
          </div>
        </Col>
      </Row>
    </>
  );
}
