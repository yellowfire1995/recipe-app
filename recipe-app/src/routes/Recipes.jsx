import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import Loading from "../Components/Loading";

export async function loader({ params }) {
  const activeRecipe = await getRecipeById(params.recipeId);
  const nutrition = await getNutritionInfo(params.recipeId);

  return [activeRecipe, nutrition];
}

export default function Recipe() {
  const params = useParams();
  const nutrition = useQuery({
    queryKey: [`Nutrition${params.recipeId}`],
    queryFn: () => getNutritionInfo(params.recipeId),
  });

  const recipeFetch = useQuery({
    queryKey: [`Recipe${params.recipeId}`],
    queryFn: () => getRecipeById(params.recipeId),
  });

  let recipe = [];

  const navigate = useNavigate();
  const [checkedArray, setCheckedArray] = useState([]);
  const { user } = useAuth0();
  const [activeModal, setActiveModal] = useState();
  const [servings, setServings] = useState();

  if (recipeFetch.isError || nutrition.isError) {
    return <div>Recipe not found</div>;
  }

  if (recipeFetch.isLoading || nutrition.isLoading) {
    return <Loading />;
  }

  recipe = recipeFetch.data[0];
  const servs = (servings ?? recipe.servings) / recipe.servings;

  const recipePrice = (
    Math.round(
      recipe?.ingredients
        .map((ingredient) => ingredient.price * ingredient.quantity * servs)
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
    <Container md fluid="lg" className="d-flex mt-4">
      <Col className=" ">
        <Row>
          {" "}
          <CardImg
            as="img"
            src={recipe.img_url}
            style={{ height: "12rem" }}
            className="object-fit-cover my-1 recipecardimg"
          />
        </Row>

        <Row className="pt-3">
          <Col lg={10}>
            <h2>
              {recipe.name} - ${recipePrice} ($
              {(recipePrice / (servings ?? recipe.servings)).toFixed(2)}
              /serving){" "}
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
          <hr />
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
          <Col lg="8" className="flex-shrink-1 ">
            <ListGroup>
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
                      <div className="d-inline fw-semibold">
                        {ingredient.userG
                          ? Math.round(
                              ingredient.userG *
                                ingredient.quantity *
                                servs *
                                100
                            ) /
                              100 +
                            " " +
                            ingredient.userLabel
                          : ingredient.gramConversion
                          ? `${
                              Math.round(
                                ingredient.gramConversion *
                                  ingredient.quantity *
                                  servs *
                                  100
                              ) /
                                100 +
                              " " +
                              ingredient.engLabel
                            }`
                          : `${Math.round(ingredient.quantity * servs)} g`}
                      </div>
                      {ingredient.gramConversion || ingredient.userG
                        ? ` (${Math.round(ingredient.quantity * servs)} g)`
                        : ""}
                      {` ${ingredient.description}`}{" "}
                      {`- $${(
                        Math.round(
                          ingredient.price * ingredient.quantity * servs * 100
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
          <Col lg>
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
                      value={servings ?? recipe.servings}
                      onChange={(event) => setServings(event.target.value)}
                      style={{ width: "3rem" }}
                      className="me-2"
                    />
                  </p>
                </header>
                {nutrition.data ? (
                  <NutritionFacts nutrition={nutrition.data} />
                ) : (
                  <Loading />
                )}
              </section>
            </>
          </Col>
        </Row>
      </Col>
    </Container>
  );
}
