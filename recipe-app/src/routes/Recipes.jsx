import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Stack from "react-bootstrap/Stack";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { getRecipeById } from "../../db/queries";
import ErrorHandler from "../Components/Errors/NotFound.jsx";
import Loading from "../Components/Loading";
import { NutritionFacts } from "../Components/Recipes/NutritionFacts/NutritionFacts.jsx";
import { RecipeForm } from "../Components/Recipes/RecipeForm.jsx";
import { useAuth0 } from "@auth0/auth0-react";

export default function Recipe() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState();
  const { isAuthenticated } = useAuth0();

  const {
    data: loadedRecipe,
    isError,
    isLoading,
    error,
    isFetched,
    refetch,
  } = useQuery({
    queryKey: [`Recipe${recipeId}`],
    queryFn: async () => {
      return await getRecipeById(recipeId);
    },
    retry: 2,
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

  if (isError) {
    console.log(error);
    return <ErrorHandler error={error} />;
  }

  if (recipe && isFetched) {
    return (
      <>
        <Helmet>
          <title>{recipe.name}</title>
        </Helmet>
        <RecipeForm recipe={recipe} setRecipe={setRecipe}>
          <RecipeForm.RecipeHeaderImage />
          <Row className="pt-3">
            <RecipeForm.RecipeHeader
              buttons={
                <RecipeForm.RecipeHeaderButtons>
                  <RecipeForm.EditRecipeButton />
                  <RecipeForm.RemixButton />
                  <RecipeForm.AddRecipeToCollectionModal />
                  <RecipeForm.AddToMealPlannerButton />
                </RecipeForm.RecipeHeaderButtons>
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
              />
              <RecipeForm.DirectionList />
            </Col>
            <Col xl>
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
