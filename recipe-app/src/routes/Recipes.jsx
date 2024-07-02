import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import CardImg from "react-bootstrap/esm/CardImg";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getRecipeById } from "../../db/queries";
import AddRecipeToCollectionModal from "../Components/Collections/AddRecipeToCollectionModal.jsx";
import ErrorHandler from "../Components/Errors/NotFound.jsx";
import Loading from "../Components/Loading";
import AddToMealPlannerButton from "../Components/Planner/AddToMealPlannerButton.jsx";
import { NutritionFacts } from "../Components/Recipes/NutritionFacts/NutritionFacts.jsx";
import { Recipe2 } from "../Components/Recipes/Recipe.jsx";
import { RecipePrice } from "../Components/Recipes/View Recipe/RecipePrice.jsx";

export default function Recipe() {
  const { recipeId } = useParams();

  const {
    data: loadedRecipe,
    isError,
    isLoading,
    error,
    isFetched,
  } = useQuery({
    queryKey: [`Recipe${recipeId}`],
    queryFn: () => getRecipeById(recipeId),
    retry: 2,
    staleTime: Infinity,
  });

  const { user } = useAuth0();
  const [arecipe, setRecipe] = useState();
  const navigate = useNavigate();

  if (isError) {
    return <ErrorHandler error={error} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  const [recipe] = loadedRecipe;

  return (
    <>
      <Helmet>
        <title>{recipe.name}</title>
      </Helmet>
      <Container fluid="lg" className="d-flex mt-4">
        <Col className=" ">
          <Recipe2 recipe={recipe}>
            <Row className={`${recipe.imgUrl ? "" : "d-none"}`}>
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
                  {recipe.name} - <RecipePrice />
                  {user.sub === recipe.author ? (
                    <Link to={`/recipes/${recipe.recipe_id}/edit`}>
                      <Button className="p-1">Edit Recipe</Button>
                    </Link>
                  ) : null}
                  {/* <AddRecipeToCollectionModal params={params} />
                    <AddToMealPlannerButton params={params} /> */}
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate(`/newrecipe?copy=${recipe.recipe_id}`)
                    }
                  >
                    Remix Recipe
                  </Button>
                </h2>
              </Col>
              <Col className="text-end">
                <Recipe2.RecipeCredit />
              </Col>
              <hr />
            </Row>
            <Row>
              <Stack direction="horizontal" gap={1}>
                <Recipe2.CuisineBadge />
                <Recipe2.CategoryBadge />
              </Stack>
            </Row>
            <Row>
              <Col lg="8" className="flex-shrink-1 ">
                <Recipe2.IngredientList />
                <Recipe2.DirectionList />
              </Col>
              <Col lg>
                <NutritionFacts recipe={{ recipe, setRecipe }}>
                  <NutritionFacts.Header />
                  <NutritionFacts.Table />
                </NutritionFacts>
              </Col>
            </Row>
          </Recipe2>
        </Col>
      </Container>
    </>
  );
}
