import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { RecipeRating } from "../../Rating/RecipeRating";
import { RecipeOptionsDropdown } from "../../Recipe Header/Buttons/RecipeHeaderButtons";

export function RecipeCardItem({
  recipe = {},
  refetch = () => {
    return;
  },
  id = "",
  collectionId = "",
  ...props
}) {
  const { recipeId, thumbnailLink, thumbnail, name, ratingCount, rating } =
    recipe;

  return (
    <Container
      id={id + "" + collectionId}
      className="d-flex recipe-card rounded align-self-stretch text-center justify-content-center flex-wrap align-content-start m-2 p-0"
      key={recipeId}
      {...props}
    >
      <Container
        className={`card-private-icon m-0 d-flex align-items-center justify-content-center ${
          recipe.public && "d-none"
        }`}
      >
        <VisibilityOffIcon />
      </Container>
      <Container className="card-dropdown p-0">
        <RecipeOptionsDropdown
          recipe={recipe}
          refetch={() => refetch()}
          text={
            <AddCircleOutlinedIcon
              className="recipe-card-dropdown-button"
              fontSize="large"
            />
          }
        />
      </Container>

      <Link
        to={`/recipes/${recipeId}`}
        className="d-flex  text-decoration-none rounded-top flex-wrap text-body w-100 recipe-card-image-link"
      >
        <Card
          className="d-flex rounded-top rounded-bottom-0 recipe-card-background"
          style={{
            backgroundImage: `url(${thumbnailLink})`,
          }}
        >
          <Container className="justify-content-center text-center filler-text my-auto">
            {thumbnail ? "" : name}
          </Container>
        </Card>
      </Link>

      <Link
        to={`/recipes/${recipeId}`}
        className="fs-5 fw-semibold text-capitalize text-reset text-decoration-none"
      >
        {name}
      </Link>
      <Container className="rating-background m-0 p-0 d-flex justify-content-center align-items-center">
        {ratingCount > 0 && (
          <RecipeRating
            recipe={recipe}
            refetch={refetch}
            size="small"
            value={rating}
            showCount={true}
          />
        )}
      </Container>
    </Container>
  );
}
