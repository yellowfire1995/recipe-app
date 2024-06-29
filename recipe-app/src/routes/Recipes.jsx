import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Stack from "react-bootstrap/Stack";
import CardImg from "react-bootstrap/esm/CardImg";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getNutritionInfo, getRecipeById } from "../../db/queries";
import AddPriceModal from "../Components/Recipes/Multipurpose/AddPriceModal.jsx";
import AddRecipeToCollectionModal from "../Components/Collections/AddRecipeToCollectionModal.jsx";
import ErrorHandler from "../Components/Errors/NotFound.jsx";
import Loading from "../Components/Loading";
import { NutritionFacts } from "../Components/Recipes/Multipurpose/NutritionFacts.jsx";
import AddToMealPlannerButton from "../Components/Planner/AddToMealPlannerButton.jsx";

export async function loader({ params }) {
  const activeRecipe = await getRecipeById(params.recipeId);
  const nutrition = await getNutritionInfo(params.recipeId);

  return [activeRecipe, nutrition];
}

export default function Recipe() {
  const params = useParams();

  const recipeFetch = useQuery({
    queryKey: [`Recipe${params.recipeId}`],
    queryFn: () => getRecipeById(params.recipeId),
    retry: 1,
    staleTime: 120000,
  });

  let recipe = [];

  const navigate = useNavigate();
  const [checkedArray, setCheckedArray] = useState([]);
  const { user } = useAuth0();
  const [activeModal, setActiveModal] = useState();
  const [servings, setServings] = useState();

  if (recipeFetch.isError) {
    return <ErrorHandler error={recipeFetch.error} />;
  }

  if (recipeFetch.isLoading) {
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

  console.log(recipe);
  return (
    <>
      <Helmet>
        <title>{recipe.name}</title>
      </Helmet>
      <Container fluid="lg" className="d-flex mt-4">
        <Col className=" ">
          <Row className={`${recipe.imgUrl ? "" : "d-none"}`}>
            {" "}
            <CardImg
              as="img"
              src={recipe.imgUrl}
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
                <AddRecipeToCollectionModal params={params} />
                <AddToMealPlannerButton params={params} />
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
                  if (ingredient.isGroupHeader) {
                    return (
                      <h4 key={ingredient.id}>
                        {ingredient.description.toUpperCase()}
                      </h4>
                    );
                  }
                  return (
                    <div className="form-check" key={ingredient.id}>
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
                      <AddPriceModal ingredient={ingredient} />
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
              {recipe.ingredients.length > 0 ? (
                <NutritionFacts
                  recipe={recipe}
                  header={true}
                  servings={[servings, setServings]}
                />
              ) : (
                ""
              )}
            </Col>
          </Row>
        </Col>
      </Container>
    </>
  );
}
