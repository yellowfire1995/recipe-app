import { useAuth0 } from "@auth0/auth0-react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { queryClient } from "../../../main";
import { RecipeRating } from "../Rating/RecipeRating";
import { useRecipeContext } from "../RecipeContextProvider";

export function RecipeHeader({ buttons, credit }) {
  const { recipe, setRecipe } = useRecipeContext();
  const { isAuthenticated } = useAuth0();
  const title = isAuthenticated ? buttons : recipe.name;

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
      <Row className="justify-content-between text-break">
        <Col xs="auto">
          <h2>{title}</h2>
        </Col>
        <Col xs="auto" className="d-flex align-items-center text-nowrap">
          <RecipeRating
            className=""
            recipe={recipe}
            setRecipe={setRecipe}
            refetch={refetch}
            showCount={true}
            showRatingNumber={true}
          />
        </Col>
      </Row>
    </>
  );
}
