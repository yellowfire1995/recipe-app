import { Col, ListGroup, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { RecipeRating } from "../../Rating/RecipeRating";
import { RecipeOptionsDropdown } from "../../Recipe Header/RecipeHeaderButtons";

export function RecipeListItem({
  recipe,
  refetch = () => {
    return;
  },
}) {
  const { recipeId, name } = recipe;
  const { collectionId } = useParams();
  console.log(collectionId);

  console.log(recipe);

  return (
    <ListGroup.Item className="mt-1 recipe-list-item d-flex align-items-center  ">
      <Col className="p-0 m-0 d-flex flex-wrap">
        <Col
          className="p-0 m-0 d-flex align-items-center me-auto"
          xs={12}
          md="auto"
        >
          <Link to={`/recipes/${recipeId}`} style={{ display: "contents" }}>
            {recipe.thumbnailLink && (
              <Col xs="auto" className="me-1">
                <img
                  className="recipe-list-thumbnail"
                  src={`${recipe.thumbnailLink}`}
                />
              </Col>
            )}

            <Col className="d-flex text-break">{name}</Col>
          </Link>
        </Col>

        <Col xs="auto" className="align-items-end align">
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
      </Col>
      <Col xs="auto" className="d-flex mb-0 pb-0">
        <RecipeOptionsDropdown recipe={recipe}>
          <RecipeOptionsDropdown.EditRecipeButton />
          <RecipeOptionsDropdown.RemixButton />
          <RecipeOptionsDropdown.AddToMealPlannerButton />
          {collectionId ? (
            <RecipeOptionsDropdown.RemoveFromCollectionButton />
          ) : (
            <RecipeOptionsDropdown.AddRecipeToCollectionModal />
          )}
          <RecipeOptionsDropdown.DeleteRecipeButton
            onSuccess={() => {
              refetch();
            }}
          />
        </RecipeOptionsDropdown>
      </Col>
    </ListGroup.Item>
  );
}
