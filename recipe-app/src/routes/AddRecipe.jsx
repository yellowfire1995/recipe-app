import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getRecipeById, newRecipe } from "../../db/queries";
import { NutritionFacts } from "../Components/Recipes/NutritionFacts/NutritionFacts";
import { ShowOriginalingredientSwitch } from "../Components/Recipes/Recipe Header/ShowOriginalIngredientSwitch";
import { RecipeForm } from "../Components/Recipes/RecipeForm";
import { queryClient } from "../main";

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
          <RecipeForm.EditableRecipeHeader />
          <Row>
            <Col md>
              <RecipeForm.EditableIngredientTextbox
                setIngredientList={setIngredientList}
              />
            </Col>
            <Col>
              <RecipeForm.IngredientList
                header={<RecipeForm.EditableHeaderItem />}
                item={<RecipeForm.EditableIngredientItem />}
                headerText={<>Ingredients </>}
                ingredientList={ingredientList}
                setIngredientList={setIngredientList}
                buttons={<RecipeForm.AddToIngredientListButtons />}
                optionalIngredientHeader={<ShowOriginalingredientSwitch />}
              />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md>
              <RecipeForm.EditableDirectionTextbox />
            </Col>
            <Col>
              <RecipeForm.EditableDirectionList />
            </Col>
          </Row>
          <Row className="mt-3 mb-1">
            <Col className="d-flex">
              <Button
                type="submit"
                className="flex-grow-1"
                style={{ height: "3rem" }}
              >
                Save Recipe
              </Button>
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
}
