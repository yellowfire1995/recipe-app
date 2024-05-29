import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";

export default function RecipeCardData(props) {
  const cards = props.cards;

  if (cards.length < 1) {
    return <div>No Recipes found.</div>;
  }

  return (
    <>
      {cards.map((recipe, index) => {
        return (
          <Link
            to={`/recipes/${recipe.recipe_id}`}
            className="d-flex p-2 text-decoration-none rounded flex-wrap text-body"
            key={recipe.key || recipe.recipe_id}
          >
            <Container
              className="  scrollable d-flex text-center recipecard align-self-stretch  justify-content-center flex-wrap align-content-start"
              style={{ width: "15rem", height: "17rem" }}
              id={`slide-${
                props.collection ? props.collection.id : ""
              }-${index}`}
            >
              <Card
                className="d-flex border-0 shadow"
                style={{
                  backgroundImage: `url(${recipe.thumbnail})`,
                  backgroundPosition: "50% 50%",
                  backgroundSize: "cover",
                  width: "15rem",
                  height: "13rem",
                }}
              ></Card>
              <p
                className="d-flex align-self-start pt-1 text-secondary-subtle"
                // style={{color: "#48423C"}}
              >
                {recipe.name}
              </p>
            </Container>
          </Link>
        );
      })}
    </>
  );
}
