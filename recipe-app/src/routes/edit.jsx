import {
  Form as ReactForm,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import CardImg from "react-bootstrap/esm/CardImg";
import Container from "react-bootstrap/esm/Container";
import { useState } from "react";
import { getRecipeById } from "../../db/queries";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/Button";
import _ from "lodash";
import IngredientsList from "../Components/ingredientslist";
import DirectionsList from "../Components/directionslist";
import CuisineSelector from "../Components/cuisineselector";
import CategorySelector from "../Components/categoryselector";
import DeleteButton from "../Components/deleterecipe";
import { editRecipe } from "../../db/queries";
import { useAuth0 } from "@auth0/auth0-react";

export async function loader({ params, request }) {
  const activeRecipe = await getRecipeById(params.recipeId);
  return [activeRecipe, params.recipeId];
}

export async function action(updatedRecipe, params) {
  console.log("action called");

  return redirect(`/recipes/${params.id}`);
}

export default function Edit() {
  const [activeRecipe, recipeId] = useLoaderData();
  const recipe = activeRecipe[0];
  const navigate = useNavigate();
  const [updatedRecipe, setUpdatedRecipe] = useState(recipe);
  const { user, isAuthenticated } = useAuth0();

  function ingredientCallBack(childdata) {
    setUpdatedRecipe({ ...updatedRecipe, ingredients: childdata });
  }

  function directionCallBack(childdata) {
    setUpdatedRecipe({ ...updatedRecipe, directions: childdata });
  }

  function cuisineCallBack(childdata) {
    setUpdatedRecipe({ ...updatedRecipe, cuisine: childdata });
  }

  function categoryCallBack(childdata) {
    setUpdatedRecipe({ ...updatedRecipe, category: childdata });
  }

  if (user.sub == recipe.author && isAuthenticated) {
    return (
      <>
        <Container style={{ width: "100%" }} className="border shadow ">
          <Row>
            <Button
              variant="outline-primary"
              onClick={() => {
                navigate(-1);
              }}
            >
              {`< Back`}
            </Button>
          </Row>
          <ReactForm
            onSubmit={async (e) => {
              await editRecipe(e, updatedRecipe),
                navigate(`/recipes/${updatedRecipe.recipe_id}`);
            }}
          >
            <Row>
              {" "}
              <CardImg
                src={updatedRecipe.img_url}
                style={{ width: "100%", height: "200px" }}
                className="object-fit-cover"
              />
              <input
                type="text"
                // name="name"
                value={updatedRecipe.img_url}
                placeholder="Enter img url..."
                onChange={(e) =>
                  setUpdatedRecipe({
                    ...updatedRecipe,
                    img_url: e.target.value,
                  })
                }
              />
              <input
                type="text"
                // name="name"
                value={updatedRecipe.url}
                placeholder="Enter img url..."
                onChange={(e) =>
                  setUpdatedRecipe({
                    ...updatedRecipe,
                    url: e.target.value,
                  })
                }
              />
            </Row>
            <Row className="d-inline">
              <Container>
                <h2>
                  <input
                    type="text"
                    // name="name"
                    value={updatedRecipe.name}
                    onChange={(e) =>
                      setUpdatedRecipe({
                        ...updatedRecipe,
                        name: e.target.value,
                      })
                    }
                  />

                  <Button type="submit" className="p-1">
                    Save Recipe
                  </Button>
                  <DeleteButton recipeId={recipeId} />
                </h2>

                <label id="servings">Default Servings </label>
                <input
                  type="number"
                  id="servings"
                  min="0"
                  value={updatedRecipe.servings}
                  onChange={(e) =>
                    setUpdatedRecipe({
                      ...updatedRecipe,
                      servings: e.target.value,
                    })
                  }
                  style={{ width: "3rem" }}
                  className="me-2"
                  // name="servings"
                />
              </Container>
            </Row>
            <Row>
              <Col className="">
                <IngredientsList
                  recipe={recipe}
                  handleCallBack={ingredientCallBack}
                />
              </Col>
              <Col>
                <CategorySelector
                  recipe={recipe}
                  handleCallBack={categoryCallBack}
                />{" "}
                <CuisineSelector
                  recipe={recipe}
                  handleCallBack={cuisineCallBack}
                />
                <DirectionsList
                  recipe={recipe}
                  handleCallBack={directionCallBack}
                />
              </Col>
            </Row>
          </ReactForm>
        </Container>
      </>
    );
  } else {
    <div> Unauthorized</div>;
  }
}
