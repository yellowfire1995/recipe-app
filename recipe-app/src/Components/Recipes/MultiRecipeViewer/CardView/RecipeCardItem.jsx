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
  return (
    <>
      <Container
        id={id + "" + collectionId}
        className="mb-3  scrollable d-flex text-center recipe-card align-self-stretch  justify-content-center flex-wrap align-content-start"
        key={recipe.recipeId}
        {...props}
      >
        <Container className="card-dropdown">
          <RecipeOptionsDropdown recipe={recipe} refetch={() => refetch()} />
        </Container>
        <Container className="rating-background">
          <RecipeRating recipe={recipe} refetch={refetch} />
        </Container>
        <Link
          to={`/recipes/${recipe.recipeId}`}
          className="d-flex p-2 text-decoration-none rounded flex-wrap text-body"
        >
          <Card
            className="d-flex border-0 shadow recipe-card-background"
            style={{
              backgroundImage: `url(${recipe.thumbnailLink})`,
            }}
          >
            <Container className="justify-content-center text-center filler-text my-auto">
              {recipe.thumbnail ? "" : recipe.name}
            </Container>
          </Card>
        </Link>

        <p
          className="d-flex align-self-start pt-1 text-secondary-subtle text-break recipe-card-title"
          style={{
            maxWidth: "15rem",
          }}
        >
          {recipe.name}
        </p>
      </Container>
    </>
  );
}
