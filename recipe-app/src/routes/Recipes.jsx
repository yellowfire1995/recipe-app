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

export default function Recipe() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState();

  const {
    data: loadedRecipe,
    isError,
    isLoading,
    error,
    isFetched,
  } = useQuery({
    queryKey: [`Recipe${recipeId}`],
    queryFn: async () => await getRecipeById(recipeId),
    retry: 2,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isFetched) {
      setRecipe(loadedRecipe[0]);
    }
  }, [loadedRecipe, isFetched]);

  if (isError) {
    return <ErrorHandler error={error} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (recipe && isFetched) {
    return (
      <>
        <Helmet>
          <title>{recipe.name}</title>
        </Helmet>
        <RecipeForm recipe={recipe}>
          <RecipeForm.RecipeHeaderImage />
          <Row className="pt-3">
            <RecipeForm.RecipeHeader
              price={<RecipeForm.RecipePrice />}
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
            <Col lg="8" className="flex-shrink-1 ">
              <RecipeForm.IngredientList
                header={<RecipeForm.IngredientListHeader />}
                item={<RecipeForm.IngredientListItem />}
              />
              <RecipeForm.DirectionList />
            </Col>
            <Col lg>
              <NutritionFacts recipe={{ recipe, setRecipe }}>
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
