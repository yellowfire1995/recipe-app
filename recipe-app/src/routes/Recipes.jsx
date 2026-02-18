import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Stack from "react-bootstrap/Stack";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { useNavigate, useParams } from "react-router-dom";
import { getRecipeById } from "../../db/queries";
import AppErrorPage from "../Components/Errors/AppErrorPage.jsx";
import Loading from "../Components/Loading";
import { NutritionFacts } from "../Components/Recipes/NutritionFacts/NutritionFacts.jsx";
import { RecipeForm } from "../Components/Recipes/RecipeForm.jsx";

export default function Recipe() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState();
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const {
    data: loadedRecipe,
    isError,
    error,
    isLoading,
    isFetched,
    refetch,
  } = useQuery({
    queryKey: [`Recipe${recipeId}`],
    queryFn: async () => {
      return await getRecipeById(recipeId);
    },
    retry: false,
    staleTime: 1000 * 60 * 60 * 24,
  });

  useEffect(() => {
    refetch();
  }, [refetch, isAuthenticated]);

  useEffect(() => {
    if (isFetched && !isError && loadedRecipe) {
      setRecipe(loadedRecipe[0]);
    }
  }, [loadedRecipe, isFetched, isError, isAuthenticated]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <AppErrorPage error={error} />;
  }

  if (recipe && isFetched) {
    return (
      <>
        <title>{recipe.name}</title>

        <RecipeForm recipe={recipe} setRecipe={setRecipe}>
          <RecipeForm.RecipeHeaderImage />
          <Row className="pt-3">
            <RecipeForm.RecipeHeader
              buttons={
                <RecipeForm.RecipeHeaderButtons
                  recipe={recipe}
                  text={recipe.name}
                  onDeleteSuccess={() => navigate("/recipes")}
                />
              }
              credit={<RecipeForm.RecipeCredit />}
            />
          </Row>
          <Row>
            <Stack direction="horizontal" gap={1}>
              <RecipeForm.CuisineBadge />
              <RecipeForm.CategoryBadge />
            </Stack>
          </Row>
          <Row>
            <Col xl="8" className="flex-shrink-1 ">
              <RecipeForm.IngredientList
                header={<RecipeForm.IngredientListHeader />}
                item={<RecipeForm.IngredientListItem />}
                price={<RecipeForm.RecipePrice />}
                showScale
              />
              <RecipeForm.DirectionList />
            </Col>
            <Col xl className="d-flex justify-content-center">
              <NutritionFacts>
                <NutritionFacts.Header />
                <NutritionFacts.Table />
              </NutritionFacts>
            </Col>
          </Row>
        </RecipeForm>
      </>
    );
  }
}
