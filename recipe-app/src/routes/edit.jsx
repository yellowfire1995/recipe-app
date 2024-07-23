import { useNavigate, useParams } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import { createContext, useEffect, useState } from "react";
import { getRecipeById } from "../../db/queries";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/Button";
import CuisineSelector from "../Components/Recipes/Multipurpose/cuisineselector.jsx";
import CategorySelector from "../Components/Recipes/Multipurpose/categoryselector.jsx";
import { editRecipe } from "../../db/queries";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../Components/Loading";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import { NutritionFacts } from "../Components/Recipes/NutritionFacts/NutritionFacts.jsx";
import { RecipeForm } from "../Components/Recipes/RecipeForm.jsx";
import ErrorHandler from "../Components/Errors/NotFound.jsx";
import { toast } from "react-toastify";

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

  if (recipe && isFetched && user.sub === recipe.author) {
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
            <Row className="mt-3 d-flex">
              <Col className="d-flex justify-content-end">
                <RecipeForm.DeleteRecipeIcon />
              </Col>
            </Row>
            <Row className="mt-1 justify-content-center mx-1 mb-1 ">
              <RecipeForm.AddPhoto
                style={{
                  width: "10rem",
                  height: "12rem",
                }}
                className="photo-add ps-2"
              />
              <Col md>
                <Row className="mb-1">
                  <RecipeForm.EditableNameField />
                </Row>

                <Row className="mb-1">
                  <RecipeForm.EditableServingsField />
                </Row>
                <Row className="d-flex">
                  <Col className="ps-0">
                    <RecipeForm.EditableYieldNumber />
                  </Col>
                  <Col xs={10} className="p-0">
                    <RecipeForm.EditableYieldDescription />
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row className="">
              <Col md className="">
                <CategorySelector updatedRecipe={[recipe, setRecipe]} />
              </Col>{" "}
              <Col md className="">
                <CuisineSelector updatedRecipe={[recipe, setRecipe]} />
              </Col>
            </Row>
            <Row className="px-0 py-2">
              <Col className="align-content-center d-flex">
                <RecipeForm.EditableVisibilityCheckbox />
              </Col>
            </Row>
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
                    />
                    <RecipeForm.EditableDirectionList />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="mt-3 mb-1">
              <Col>
                <Container className="d-flex">
                  <Button
                    type="submit"
                    className="flex-grow-1"
                    style={{ height: "3rem" }}
                  >
                    {isPending ? "Saving..." : "Save Recipe"}
                  </Button>
                </Container>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col lg={6}>
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
