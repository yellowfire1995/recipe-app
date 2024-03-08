import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import ListGroup from "react-bootstrap/ListGroup";
import CardImg from "react-bootstrap/esm/CardImg";
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import { getRecipeById } from "../../db/queries";
import { getNutritionInfo } from "../../db/queries";
import AddPricePopup from "../Components/priceaddpopup";
import { NutritionFacts } from "../Components/NutritionFacts";

export async function loader({ params }) {
  const activeRecipe = await getRecipeById(params.recipeId);
  const nutrition = await getNutritionInfo(params.recipeId);

  return [activeRecipe, nutrition];
}

export default function Recipe() {
  const [activeRecipe, nutrition] = useLoaderData();
  const recipe = activeRecipe[0];
  const navigate = useNavigate();
  const [servings, setServings] = useState(recipe.servings);
  const servs = servings / recipe.servings;
  const [checkedArray, setCheckedArray] = useState([]);
  const { user } = useAuth0();
  const [activeModal, setActiveModal] = useState();

  const recipePrice = (
    Math.round(
      recipe.ingredients
        .map((ingredient) => ingredient.price * ingredient.amt * servs)
        .reduce((partialSum, a) => partialSum + a, 0) * 100
    ) / 100
  ).toFixed(2);

  function handleCheck(ingredientId) {
    !checkedArray.includes(ingredientId)
      ? setCheckedArray([...checkedArray, ingredientId])
      : setCheckedArray(
          checkedArray.filter((idInclude) => idInclude !== ingredientId)
        );
  }

  return (
    <>
      <Container style={{ width: "100%" }} className="border shadow ">
        <Row>
          <Button
            variant="outline-primary"
            onClick={() => {
              navigate(-1);
            }}
          >
            {`< Back`}
          </Button>
        </Row>
        <Row>
          {" "}
          <CardImg
            src={recipe.img_url}
            style={{ width: "100%", height: "200px" }}
            className="object-fit-cover"
          />
        </Row>
        <Row className="pt-3">
          <Col>
            <h2>
              {recipe.name} ${recipePrice} (
              {(recipePrice / servings).toFixed(2)}/serving){" "}
              {user.sub === recipe.author ? (
                <Link to={`/recipes/${recipe.recipe_id}/edit`}>
                  <Button className="p-1">Edit Recipe</Button>
                </Link>
              ) : null}
            </h2>
          </Col>
          <Col className="text-end">
            <a href={recipe.url}>Original Recipe</a>
            <br />
            {recipe.nickname}'s recipe
          </Col>
        </Row>
        <Row>
          {" "}
          <Stack direction="horizontal" gap={1}>
            {recipe.cuisine.map((cuisine) => {
              return (
                <Badge bg="primary" key={cuisine.id}>
                  {cuisine.cuisine}
                </Badge>
              );
            })}

            {recipe.category.map((category) => {
              return (
                <Badge bg="primary" key={category.id}>
                  {category.category}
                </Badge>
              );
            })}
          </Stack>
        </Row>
        <Row>
          <Col>
            <ListGroup className="">
              <span className="h3">
                {" "}
                Ingredients <br />{" "}
              </span>
              {recipe.ingredients.map((ingredient) => {
                return (
                  <div className="form-check" key={ingredient.id}>
                    <AddPricePopup
                      show={activeModal == ingredient.id ? true : false}
                      onHide={() => setActiveModal()}
                      ingredient={ingredient}
                    />
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={ingredient.id}
                      onClick={() => handleCheck(ingredient.id)}
                    />
                    <label
                      className={`form-check-label text-lowercase ${
                        checkedArray.includes(ingredient.id)
                          ? "text-decoration-line-through"
                          : ""
                      }`}
                      htmlFor={ingredient.id}
                    >
                      <div className="d-inline fw-semibold">{`${Math.round(
                        ingredient.amt * servs
                      )} grams`}</div>
                      {` ${ingredient.ingredient}`}{" "}
                      {`(${
                        Math.round(ingredient.engAmt * servs * 100) / 100 +
                        " " +
                        ingredient.engLabel
                      }) - $${(
                        Math.round(
                          ingredient.price * ingredient.amt * servs * 100
                        ) / 100
                      ).toFixed(2)}`}{" "}
                    </label>
                    <AttachMoneyIcon
                      type="button"
                      onClick={() => setActiveModal(ingredient.id)}
                      style={{
                        color: `${ingredient.package_cost ? "black" : "red"}`,
                      }}
                    />
                  </div>
                );
              })}
            </ListGroup>
          </Col>
          <Col>
            <ListGroup variant="flush">
              <span className="h3"> Directions </span>
              <ol>
                {recipe.directions.map((direction) => {
                  return (
                    <p key={direction.id}>
                      <li>{`${direction.step}`}</li>
                    </p>
                  );
                })}
              </ol>
            </ListGroup>
          </Col>
          <Col>
            <>
              <section className="performance-facts">
                <header className="performance-facts__header">
                  <h1 className="performance-facts__title">Nutrition Facts</h1>
                  <p>
                    Servings per Recipe
                    <input
                      type="number"
                      id="servings"
                      min="0"
                      value={servings}
                      onChange={(event) => setServings(event.target.value)}
                      style={{ width: "3rem" }}
                      className="me-2"
                    />
                  </p>
                </header>
                {nutrition ? <NutritionFacts nutrition={nutrition} /> : null}
              </section>
            </>
          </Col>
        </Row>
      </Container>
    </>
  );
}
