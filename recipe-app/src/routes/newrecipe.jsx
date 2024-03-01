import { Form as ReactForm, useNavigate } from "react-router-dom";
import CardImg from "react-bootstrap/esm/CardImg";
import Container from "react-bootstrap/esm/Container";
import { useEffect, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/Button";
import _ from "lodash";
import axios from "axios";
import IngredientsList from "../Components/ingredientslist";
import DirectionsList from "../Components/directionslist";
import CuisineSelector from "../Components/cuisineselector";
import CategorySelector from "../Components/categoryselector";
import { newRecipe } from "../../db/queries";

export default function NewRecipe() {
  const recipe = {
    name: "",
    img_url: "",
    servings: 1,
    cuisine: [],
    ingredients: [],
    directions: [],
    category: [],
  };
  const navigate = useNavigate();
  const [updatedRecipe, setUpdatedRecipe] = useState(recipe);

  async function handleSubmit() {
    try {
      const recipeId = await newRecipe(updatedRecipe);
      navigate(`/recipes/${recipeId}`);
    } catch (err) {
      console.error(1, err);
    }
  }

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
    console.log(updatedRecipe);
  }

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
        <ReactForm onSubmit={handleSubmit}>
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
          </Row>
          <Row className="d-inline">
            <Container>
              <h2>
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
}
