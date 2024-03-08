import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";

export default function RecipeCardData(props) {
  let recipes = props.recipes;
  return (
    <Container className="d-flex flex-wrap justify-content-center col">
      {recipes.map((recipe) => {
        return (
          <Link to={`/recipes/${recipe.recipe_id}`} key={recipe.recipe_id}>
            <Card
              className={`card text-center mx-2 border-0 `}
              style={{ width: "18rem" }}
            >
              <Image
                src={recipe.img_url}
                roundedCircle
                className="object-fit-cover mx-auto"
                style={{ height: "200px", width: "200px" }}
              />

              <Card.Body>
                <Card.Title>
                  {recipe.name}
                  <br></br>
                </Card.Title>
              </Card.Body>
            </Card>
          </Link>
        );
      })}
    </Container>
  );
}
