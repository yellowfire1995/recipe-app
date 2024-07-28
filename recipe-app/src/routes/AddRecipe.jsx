import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import "react-bootstrap-typeahead/css/Typeahead.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getRecipeById, newRecipe } from "../../db/queries";
import CategorySelector from "../Components/Recipes/Multipurpose/categoryselector";
import CuisineSelector from "../Components/Recipes/Multipurpose/cuisineselector";
import { queryClient } from "../main";
import { RecipeForm } from "../Components/Recipes/RecipeForm";
import { NutritionFacts } from "../Components/Recipes/NutritionFacts/NutritionFacts";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

export default function AddRecipe() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const SavingError = () =>
    toast.error("Error saving recipe, please try again!");

  const [ingredientList, setIngredientList] = useState([]);
  const [recipe, setRecipe] = useState({
    name: "",
    imgUrl: "",
    servings: 1,
    cuisine: [],
    ingredients: [],
    directions: [],
    category: [],
    public: true,
  });

  const recipeFetch = useQuery({
    queryKey: [`RecipeCopy${params.get("copy")}`],
    queryFn: async () => {
      const recipe = await getRecipeById(params.get("copy"));

      return { ...recipe[0], name: `Copy of ${recipe[0].name}` };
    },
    staleTime: Infinity,
    enabled: params.get("copy") != undefined,
  });

  useEffect(() => {
    if (recipeFetch.status === "success") {
      setRecipe(recipeFetch.data);
    }
  }, [recipeFetch.status, recipeFetch.data]);

  const mutation = useMutation({
    mutationFn: () => {
      return newRecipe(recipe);
    },
    onError: (error) => {
      console.log(error);
      SavingError();
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: ["AllRecipes"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["MyRecipes"],
        refetchType: "all",
      });
      navigate(`/recipes/${data}`);
    },
  });

  return (
    <>
      <Helmet>
        <title>New Recipe</title>
      </Helmet>
      <RecipeForm recipe={recipe} setRecipe={setRecipe}>
        <Form
          onSubmit={(e) => {
            mutation.mutate(e);
            e.preventDefault();
          }}
          encType="multipart/form-data"
        >
          <Row className="mt-3 d-flex">
            <Col className="d-flex justify-content-end">
              <RecipeForm.DeleteRecipeIcon />
            </Col>
          </Row>{" "}
          <RecipeForm.ImportRecipeButton
            setIngredientList={setIngredientList}
          />
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
          <Row className="">
            <Col md>
              <RecipeForm.EditableIngredientTextbox
                setIngredientList={setIngredientList}
              />
            </Col>
            <Col>
              <RecipeForm.IngredientList
                header={<RecipeForm.EditableHeaderItem />}
                item={<RecipeForm.EditableIngredientItem />}
                ingredientList={ingredientList}
                setIngredientList={setIngredientList}
                buttons={<RecipeForm.AddToIngredientListButtons />}
              />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md>
              <Row>
                <Col>
                  <RecipeForm.EditableDirectionTextbox />
                </Col>
                <Col>
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
                  Save Recipe
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
}
