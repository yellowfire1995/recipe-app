import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import "react-bootstrap-typeahead/css/Typeahead.css";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import httpClient from "../../db/axiosConfig";
import { newRecipe, parseDirections, parseIngredients } from "../../db/queries";
import { auth0Audience } from "../../env/env";
import ImportRecipeModal from "../Components/Recipes/New Recipe/ImportRecipeModal";
import AddPhotoModal from "../Components/Recipes/Edit Recipe/AddPhotoModal";
import IngredientsList from "../Components/Recipes/Multipurpose/Ingredient List/IngredientsList";
import { NutritionFacts } from "../Components/Recipes/Multipurpose/NutritionFacts";
import CategorySelector from "../Components/Recipes/Multipurpose/categoryselector";
import CuisineSelector from "../Components/Recipes/Multipurpose/cuisineselector";
import DirectionsList from "../Components/Recipes/Multipurpose/directionslist";
import { queryClient } from "../main";

export default function AddRecipe() {
  const { user } = useAuth0();
  const { getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        let response = await httpClient.get(
          `${auth0Audience}users/${user.sub}`
        );
        setUserData(response.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [getAccessTokenSilently]);

  const [ingredients, setIngredients] = useState("");
  const [directions, setDirections] = useState("");
  const [ingredientList, setIngredientList] = useState([]);
  const [updatedRecipe, setUpdatedRecipe] = useState({
    name: "",
    imgUrl: "",
    servings: 1,
    cuisine: [],
    ingredients: [],
    directions: [],
    category: [],
    public: true,
  });

  const mutation = useMutation({
    mutationFn: () => {
      return newRecipe(updatedRecipe, userData);
    },
    onError: (e) => {
      alert("Please try again!");
    },
    onSuccess: (data) => {
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

  async function handleImport(scrapedData) {
    console.log(scrapedData);
    const ingredientString = scrapedData.recipeIngredient.join("\r\n");
    console.log(ingredientString);
    const directionString =
      typeof scrapedData.recipeInstructions == "string"
        ? scrapedData.recipeInstructions
        : scrapedData.recipeInstructions
            .map((direction) => direction.text)
            .join("\r\n");

    setIngredients(ingredientString);
    setDirections(directionString);
    const choices = await parseIngredients(ingredientString);
    const directions = await parseDirections(directionString);

    let servings = 1;

    if (scrapedData.recipeYield.length > 0) {
      try {
        servings = parseInt(scrapedData.recipeYield[0]);
        console.log(servings);
      } catch (error) {
        servings = 1;
      }
    }

    setUpdatedRecipe({
      ...updatedRecipe,
      directions: directions,
      img_url: scrapedData.image?.url,
      name: scrapedData.name ? scrapedData.name : "",
      ingredients: choices.map((choice) => choice[0]),
      servings: servings,
    });

    setIngredientList(choices);
  }

  async function getIngredientChoices() {
    const choices = await parseIngredients(ingredients);

    setUpdatedRecipe({
      ...updatedRecipe,
      ingredients: choices.map((choice) => choice[0]),
    });

    return choices;
  }

  return (
    <>
      <Container md="true" fluid="lg" className="d-flex mt-4">
        <Container fluid>
          <Form
            onSubmit={(e) => {
              mutation.mutate(e);
              e.preventDefault();
            }}
            encType="multipart/form-data"
          >
            <Row>
              <Col className="">
                <ImportRecipeModal
                  updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
                  handleImport={handleImport}
                />
              </Col>
            </Row>

            <Row className="mt-1 justify-content-center mx-1 mb-1 ">
              <AddPhotoModal
                updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
              />
              <Col md>
                <Row className="mb-1">
                  <FloatingLabel label="Recipe name" className="p-0">
                    <Form.Control
                      size="lg"
                      required
                      minLength="2"
                      type="text"
                      value={updatedRecipe.name}
                      onChange={(e) =>
                        setUpdatedRecipe({
                          ...updatedRecipe,
                          name: e.target.value,
                        })
                      }
                    />
                  </FloatingLabel>
                </Row>

                <Row className="mb-1">
                  <FloatingLabel id="servings" label="Servings" className="p-0">
                    <Form.Control
                      required
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
                    />
                  </FloatingLabel>
                </Row>
                <Row className="d-flex">
                  <Col className="ps-0">
                    {" "}
                    <FloatingLabel id="Yield number" label="Yield (optional)">
                      <Form.Control
                        type="number"
                        id="yieldNumber"
                        min="0"
                        class
                        value={updatedRecipe.yieldNumber}
                        onChange={(e) =>
                          setUpdatedRecipe({
                            ...updatedRecipe,
                            yieldNumber: isNaN(e.target.valueAsNumber)
                              ? null
                              : e.target.valueAsNumber,
                          })
                        }
                      />
                    </FloatingLabel>
                  </Col>
                  <Col xs={10} className="p-0">
                    {" "}
                    <FloatingLabel
                      id="Yield Description"
                      label="Yield Description (optional)"
                      className="p-0"
                    >
                      <Form.Control
                        type="text"
                        id="yieldDescription"
                        min="0"
                        value={updatedRecipe.yieldDescription}
                        onChange={(e) =>
                          setUpdatedRecipe({
                            ...updatedRecipe,
                            yieldDescription: e.target.value,
                          })
                        }
                      />
                    </FloatingLabel>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row className="">
              <Col md className="">
                <CategorySelector
                  updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
                />
              </Col>{" "}
              <Col md className="">
                <CuisineSelector
                  updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
                />
              </Col>
            </Row>
            <Row className="px-0 py-2">
              <Col className="align-content-center d-flex">
                <h5 className="pe-2">Visibility: </h5>
                <Form.Check
                  inline
                  type="checkbox"
                  checked={updatedRecipe.public}
                  onChange={(e) =>
                    setUpdatedRecipe({
                      ...updatedRecipe,
                      public: true,
                    })
                  }
                  label="Public"
                />
                <Form.Check
                  inline
                  type="checkbox"
                  checked={!updatedRecipe.public}
                  onChange={(e) =>
                    setUpdatedRecipe({
                      ...updatedRecipe,
                      public: false,
                    })
                  }
                  label="Private"
                />
              </Col>
            </Row>
            <Row className="">
              <Col md>
                <Row>
                  <Col>
                    <h3> Ingredients </h3>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {" "}
                    <Form.Control
                      required
                      as="textarea"
                      className="table-active"
                      rows={10}
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      placeholder="Enter ingredients- one ingredient per line:&#10;1 cup flour&#10;2 ounces butter, softened "
                    />
                  </Col>
                </Row>
                <Row>
                  <Col className="d-flex">
                    <Button
                      className="flex-grow-1 bg-color-red border-0"
                      variant="primary"
                      onClick={async () => {
                        setIngredientList(await getIngredientChoices());
                      }}
                    >
                      Add Ingredients
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {updatedRecipe.ingredients.length > 0 ? (
                      <IngredientsList
                        updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
                        ingredientList={[ingredientList, setIngredientList]}
                      />
                    ) : null}
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Col>
                    <h3> Directions </h3>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Control
                      required
                      as="textarea"
                      rows={10}
                      value={directions}
                      onChange={(e) => setDirections(e.target.value)}
                      placeholder="Enter directions"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col className="d-flex">
                    <Button
                      variant="primary"
                      className="flex-grow-1"
                      onClick={async () => {
                        setUpdatedRecipe({
                          ...updatedRecipe,
                          directions: await parseDirections(directions),
                        });
                      }}
                    >
                      Add Directions
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {updatedRecipe.directions.length > 0 ? (
                      <DirectionsList
                        updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
                      />
                    ) : null}
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
                  Save Recipe
                </Button>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col lg={6}>
                <NutritionFacts recipe={updatedRecipe} header={false} />
              </Col>
            </Row>
          </Form>
        </Container>
      </Container>
    </>
  );
}
