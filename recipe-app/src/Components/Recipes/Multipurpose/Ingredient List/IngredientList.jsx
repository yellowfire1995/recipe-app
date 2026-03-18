import _ from "lodash";
import { useState } from "react";
import { Button, ButtonGroup, Col, Container, Row } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import { handleServingsUpdate } from "../../../../utils/NutritionFacts/handleServingsUpdate";
import { useRecipeContext } from "../../RecipeContextProvider";

function deleteIngredient(updatedRecipe, e) {
  const buttonId = e.target.id ? e.target.id : e.target.viewportElement.id;
  _.remove(
    updatedRecipe.ingredients,
    (ingredient) => ingredient.id === buttonId,
  );

  return { ...updatedRecipe };
}

function handleIngredientUpdate(recipe, e) {
  return {
    ...recipe,
    ingredients: recipe.ingredients.map((ingredient) => {
      if (ingredient.id === e.target.id) {
        const gramConversionDenominator =
          ingredient.userG || ingredient.gramConversion || 1;
        const quantityInput = isNaN(parseFloat(e.target.value))
          ? 0
          : parseFloat(e.target.value);

        return {
          ...ingredient,
          quantity: quantityInput / gramConversionDenominator,
        };
      } else {
        return { ...ingredient };
      }
    }),
  };
}

export function IngredientList({
  header,
  item,
  ingredientList,
  setIngredientList,
  buttons,
  price = "",
  headerText = "Ingredients",
  optionalIngredientHeader = "",
  showScale = false,
}) {
  const { recipe, setRecipe } = useRecipeContext();
  const {
    scaleFactor = 1,
    originalServings = recipe.servings,
    servings,
    scaleRatio = originalServings / servings,
  } = recipe;
  const [checkedArray, setCheckedArray] = useState([]);

  function handleCheck(ingredientId) {
    !checkedArray.includes(ingredientId)
      ? setCheckedArray([...checkedArray, ingredientId])
      : setCheckedArray(
          checkedArray.filter((idInclude) => idInclude !== ingredientId),
        );
  }

  const [initialDragIndex, setInitialDragIndex] = useState();
  const [draggedIngredient, setDraggedIngredient] = useState();

  function handleDragOver(index) {
    if (index !== initialDragIndex) {
      const ingredientsListCopy = recipe.ingredients.filter(
        (ingredient, index) => index !== initialDragIndex,
      );

      setInitialDragIndex(index);

      ingredientsListCopy.splice(parseInt(index), 0, draggedIngredient);

      setRecipe({
        ...recipe,
        ingredients: ingredientsListCopy,
      });
    }
  }

  function handleDragStart(index, ingredient) {
    setInitialDragIndex(index);
    setDraggedIngredient(ingredient);
  }

  function handleDragStop() {
    setInitialDragIndex();
  }

  function handleDragEnd() {
    setInitialDragIndex();
  }

  return (
    <>
      <ListGroup>
        <Row className="d-flex align-items-center">
          <Col xs="auto">
            <h3>
              {headerText} {price}
            </h3>

            {showScale && (
              <Container className="m-0 p-0 d-flex align-items-center">
                <h5 className="m-0 p-0">Scale:</h5>
                <ButtonGroup className="border">
                  <Button
                    size="sm"
                    style={{ width: "3rem" }}
                    active={recipe.servings === recipe.originalServings * 1.5}
                    onClick={() =>
                      setRecipe(
                        handleServingsUpdate({
                          servingsModifier: scaleRatio * 1.5,
                          recipe: {
                            ...recipe,
                            scaleFactor: scaleFactor + 1,
                          },
                        }),
                      )
                    }
                  >
                    1.5x
                  </Button>
                  <Button
                    disabled
                    className="mx-0 py-0"
                    style={{ paddingRight: ".02rem", paddingLeft: ".02rem" }}
                  />
                  <Button
                    size="sm"
                    style={{ width: "3rem" }}
                    active={recipe.servings === recipe.originalServings * 2}
                    onClick={() =>
                      setRecipe(
                        handleServingsUpdate({
                          servingsModifier: scaleRatio * 2,
                          recipe: {
                            ...recipe,
                            scaleFactor: scaleFactor + 1,
                          },
                        }),
                      )
                    }
                  >
                    2x
                  </Button>
                  <Button
                    disabled
                    className="mx-0 py-0"
                    style={{ paddingRight: ".02rem", paddingLeft: ".02rem" }}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      const originalServings =
                        recipe.originalServings || recipe.servings;
                      setRecipe(
                        handleServingsUpdate({
                          servingsModifier: originalServings / recipe.servings,
                          recipe: {
                            ...recipe,
                            scaleFactor: recipe.scaleFactor + 1 || 1,
                          },
                        }),
                      );
                    }}
                  >
                    Reset
                  </Button>
                </ButtonGroup>
              </Container>
            )}
          </Col>
          <Col className="p-0 d-flex">{optionalIngredientHeader}</Col>
        </Row>

        {recipe.ingredients.map((ingredient, index) => {
          if (ingredient.isGroupHeader) {
            header = {
              ...header,
              key: ingredient.id,
              props: {
                ingredient,
                index,
                handleDragStart,
                handleDragOver,
                handleDragStop,
                handleDragEnd,
                initialDragIndex,
                setInitialDragIndex,
                deleteIngredient,
                recipe,
                setRecipe,
              },
            };
            return header;
          }
          if (!ingredient.isGroupHeader) {
            item = {
              ...item,
              key: ingredient.id,
              props: {
                ingredient,
                index,
                handleDragStart,
                handleDragOver,
                handleDragStop,
                handleDragEnd,
                initialDragIndex,
                deleteIngredient,
                handleIngredientUpdate,
                recipe,
                setRecipe,
                ingredientList,
                setIngredientList,
                checkedArray,
                handleCheck,
              },
            };
            return item;
          }
        })}
      </ListGroup>
      {buttons}
    </>
  );
}
