import { Form as ReactForm, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import Col from "react-bootstrap/esm/Col";
import IngredientsList from "../Components/ingredientslist";
import DirectionsList from "../Components/directionslist";
import CuisineSelector from "../Components/cuisineselector";
import CategorySelector from "../Components/categoryselector";
import Row from "react-bootstrap/esm/Row";
import CardImg from "react-bootstrap/esm/CardImg";
import { parseDirections } from "../../db/queries";
import { parseIngredients } from "../../db/queries";
import Container from "react-bootstrap/esm/Container";
import { newRecipe } from "../../db/queries";

export default function ImportRecipe() {
  const recipe = {
    name: "",
    img_url: "",
    servings: 1,
    cuisine: [],
    ingredients: [],
    directions: [],
    category: [],
  };
  const [ingredients, setIngredients] = useState("");
  const [directions, setDirections] = useState("");
  const [directionList, setDirectionList] = useState(recipe);
  const [ingredientList, setIngredientList] = useState(recipe);
  const [updatedRecipe, setUpdatedRecipe] = useState(recipe);

  const navigate = useNavigate();

  async function handleSubmit() {
    try {
      const recipeId = await newRecipe(updatedRecipe);
      navigate(`/recipes/${recipeId}`);
    } catch (err) {
      console.error(1, err);
    }
  }

  function directionCallBack(childData) {
    setUpdatedRecipe({ ...updatedRecipe, directions: childData });
  }

  function cuisineCallBack(childData) {
    setUpdatedRecipe({ ...updatedRecipe, cuisine: childData });
  }

  function categoryCallBack(childData) {
    setUpdatedRecipe({ ...updatedRecipe, category: childData });
  }

  function ingredientCallBack(childData) {
    setUpdatedRecipe({ ...updatedRecipe, ingredients: childData });
  }

  return (
    <>
      <Container style={{ width: "100%" }} className="border shadow ">
        <Row>
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
            placeholder="Enter recipe url..."
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
              <ReactForm onSubmit={handleSubmit}>
                <input
                  type="text"
                  // name="name"
                  value={updatedRecipe.name}
                  placeholder="Enter recipe name"
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
              </ReactForm>
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
        <Row className="pt-3">
          <CategorySelector recipe={recipe} handleCallBack={categoryCallBack} />{" "}
          <CuisineSelector recipe={recipe} handleCallBack={cuisineCallBack} />
        </Row>
        <Row>
          <Col>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Enter recipe ingredients</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Enter ingredient list - one ingredient per line"
              />
              <Button
                variant="primary"
                onClick={async () => {
                  setIngredientList({
                    ...recipe,
                    ingredients: await parseIngredients(ingredients),
                  });
                }}
              >
                Import Ingredients
              </Button>
            </Form.Group>
            <IngredientsList
              recipe={ingredientList}
              handleCallBack={ingredientCallBack}
            />
          </Col>
          <Col>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Enter Recipe Directions</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                value={directions}
                onChange={(e) => setDirections(e.target.value)}
                placeholder="Enter directions"
              />
              <Button
                variant="primary"
                onClick={async () => {
                  setDirectionList({
                    ...recipe,
                    directions: await parseDirections(directions),
                  });
                }}
              >
                Import Directions
              </Button>
            </Form.Group>
            <DirectionsList
              recipe={directionList}
              handleCallBack={directionCallBack}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}
