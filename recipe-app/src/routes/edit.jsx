import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { editRecipe, getRecipeById } from "../../db/queries";
import { roles } from "../../env/env.js";
import ErrorHandler from "../Components/Errors/NotFound.jsx";
import Loading from "../Components/Loading";
import { NutritionFacts } from "../Components/Recipes/NutritionFacts/NutritionFacts.jsx";
import { ShowOriginalingredientSwitch } from "../Components/Recipes/Recipe Header/ShowOriginalIngredientSwitch.jsx";
import { RecipeForm } from "../Components/Recipes/RecipeForm.jsx";

export const RecipeContext = createContext();

export default function Edit() {
  const { recipeId } = useParams();
  const [ingredientList, setIngredientList] = useState([]);
  const [recipe, setRecipe] = useState();
  const navigate = useNavigate();
  const { user } = useAuth0();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth0();
  const SavingError = () =>
    toast.error("Error saving recipe, please try again!");

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

  const { mutate, isPending } = useMutation({
    mutationFn: (e) => {
      e.preventDefault();
      return editRecipe({ e, recipe });
    },
    onError: (error) => {
      console.log(error);
      SavingError();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["AllRecipes"],
        refetchType: "all",
      });
      await queryClient.invalidateQueries({
        queryKey: ["MyRecipes"],
        refetchType: "all",
      });
      await queryClient.invalidateQueries({
        queryKey: [`Recipe${recipeId}`],
        refetchType: "all",
      });
      navigate(`/recipes/${recipeId}`);
    },
  });

  if (isError) {
    return <ErrorHandler error={error} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (
    recipe &&
    isFetched &&
    (user.sub === recipe.author || user[roles]?.includes("Admin"))
  ) {
    return (
      <>
        <Helmet>
          <title>Edit {recipe.name}</title>
        </Helmet>
        <RecipeForm recipe={recipe} setRecipe={setRecipe}>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              mutate(e);
            }}
            encType="multipart/form-data"
          >
            <RecipeForm.EditableRecipeHeader />
            <Row className="mt-4">
              <Col md>
                <Row>
                  <Col>
                    <RecipeForm.IngredientList
                      header={<RecipeForm.EditableHeaderItem />}
                      item={<RecipeForm.EditableIngredientItem />}
                      ingredientList={ingredientList}
                      setIngredientList={setIngredientList}
                      buttons={<RecipeForm.AddToIngredientListButtons />}
                      optionalIngredientHeader={
                        <ShowOriginalingredientSwitch />
                      }
                    />
                    <RecipeForm.EditableDirectionList />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="mt-3 mb-1">
              <Col className="d-flex">
                <Button
                  type="submit"
                  className="flex-grow-1"
                  style={{ height: "3rem" }}
                >
                  {isPending ? "Saving..." : "Save Recipe"}
                </Button>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col className="d-flex">
                <RecipeForm.DeleteRecipeButton
                  recipe={recipe}
                  onSettled={() => navigate("/recipes")}
                  style={{ height: "3rem" }}
                  className="w-100 btn-danger"
                />
              </Col>
            </Row>

            <Row className="d-flex justify-content-center">
              <Col xs="auto">
                <NutritionFacts>
                  <NutritionFacts.Table />
                </NutritionFacts>
              </Col>
            </Row>
          </Form>
        </RecipeForm>
      </>
    );
  } else {
    return <div> Unauthorized</div>;
  }
}
