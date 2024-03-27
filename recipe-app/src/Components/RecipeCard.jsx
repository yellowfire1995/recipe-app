import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

export default function RecipeCardData(props) {
  let pages = props.pages;

  return (
    <>
      {pages.map((page) => {
        return page.data.map((recipe) => {
          return (
            <Link
              to={`/recipes/${recipe.recipe_id}`}
              key={recipe.recipe_id}
              className="d-flex p-2 text-decoration-none"
            >
              <Card
                className={`text-center border-1 recipecard align-self-stretch`}
                style={{ width: "15rem" }}
              >
                <Image
                  src={recipe.img_url}
                  roundedCircle
                  className="object-fit-cover mx-auto pt-2"
                  style={{ height: "200px", width: "200px" }}
                />

                <Card.Body>
                  <Card.Title className="pb-2">{recipe.name}</Card.Title>
                </Card.Body>
              </Card>
            </Link>
          );
        });
      })}
    </>
  );
}
