import { Col, ListGroup, Row } from "react-bootstrap";
import { useRecipeListContext } from "./RecipeListContextProvider";
import { Link } from "react-router-dom";
import { RecipeRating } from "../Rating/RecipeRating";
import { RecipeOptionsDropdown } from "../View Recipe/RecipeHeaderButtons";

export function RecipeListItem({ recipe }) {
  const { recipeId, name } = recipe;
  const { refetch } = useRecipeListContext();

  return (
    <ListGroup.Item className="mt-1 recipe-list-item d-flex align-items-center flex-wrap">
      <Link to={`/recipes/${recipeId}`} style={{ display: "contents" }}>
        <Col xs="auto">
          <img
            className="recipe-list-thumbnail"
            src={`${recipe.thumbnailLink}`}
          />
        </Col>

        <Col className="d-flex ms-2" xs={8}>
          {name}
        </Col>
      </Link>

      <Col xs="auto" className="align-items-end">
        <Row className="justify-content-between">
          <label htmlFor="yourRating" style={{ width: "fit-content" }}>
            Your Rating:
          </label>
          <RecipeRating
            id="yourRating"
            recipe={recipe}
            value={recipe.userRating}
            refetch={refetch}
          />
        </Row>
        <Row className="justify-content-between">
          <label htmlFor="yourRating" style={{ width: "fit-content" }}>
            All Ratings:
          </label>
          <RecipeRating
            id="allRatings"
            recipe={{ ...recipe, userRating: null }}
            value={recipe.rating}
            readOnly={true}
          />
        </Row>
      </Col>
      <Col xs="auto">
        {" "}
        <RecipeOptionsDropdown recipe={recipe} text="Options">
          <RecipeOptionsDropdown.EditRecipeButton />
          <RecipeOptionsDropdown.RemixButton />
          <RecipeOptionsDropdown.AddRecipeToCollectionModal />
          <RecipeOptionsDropdown.AddToMealPlannerButton />
          <RecipeOptionsDropdown.DeleteRecipeIcon
            onSuccess={() => {
              refetch();
            }}
          />
        </RecipeOptionsDropdown>
      </Col>
    </ListGroup.Item>
  );
}
