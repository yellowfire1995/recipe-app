import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import Col from "react-bootstrap/esm/Col";
import ImportIngredientsList from "../Components/importIngredientList";
import DirectionsList from "../Components/directionslist";
import CuisineSelector from "../Components/cuisineselector";
import CategorySelector from "../Components/categoryselector";
import Row from "react-bootstrap/esm/Row";

import { parseDirections, scrapeRecipe } from "../../db/queries";
import { parseIngredients } from "../../db/queries";
import Container from "react-bootstrap/esm/Container";
import { newRecipe } from "../../db/queries";
import httpClient from "../../db/axiosConfig";
import { useAuth0 } from "@auth0/auth0-react";
import { auth0Audience } from "../../env/env";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../main";
import InputGroup from "react-bootstrap/InputGroup";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ImportRecipeModal from "../Components/ImportRecipeModal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import "react-bootstrap-typeahead/css/Typeahead.css";
import AddPhotoModal from "../Components/AddPhotoModal";

export default function ImportRecipe() {
  const { user, isAuthenticated, isLoading } = useAuth0();
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
    img_url: "/default.png",
    servings: 1,
    cuisine: [],
    ingredients: [],
    directions: [],
    category: [],
  });

  const mutation = useMutation({
    mutationFn: () => {
      return newRecipe(updatedRecipe, userData);
    },
    onError: () => {
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
    const ingredientString = scrapedData.recipeIngredient.join("\r\n");
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
    setUpdatedRecipe({
      ...updatedRecipe,
      directions: directions,
      img_url: scrapedData.image?.url,
      name: scrapedData.name ? scrapedData.name : "",
      ingredients: choices.map((choice) => choice[0]),
    });

    setIngredientList(choices);
  }

  async function getIngredientChoices() {
    const choices = await parseIngredients(ingredients);

    setUpdatedRecipe({
      ...updatedRecipe,
      ingredients: choices.map((choice) => choice[0]),
    });
    console.log(choices);

    return choices;
  }

  return (
    <Container
      md
      fluid="lg"
      className="shadow d-flex p-3 mt-2 bg-body-tertiary mw-50"
    >
      <Container fluid>
        <Row>
          <ImportRecipeModal
            updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
            handleImport={handleImport}
          />
        </Row>
        <Form.Group onSubmit={mutation.mutate} className="w-100">
          <Row className="p-2 justify-content-center ">
            <AddPhotoModal updatedRecipe={[updatedRecipe, setUpdatedRecipe]} />
            <Col md>
              <Row className="mb-1">
                <FloatingLabel label="Recipe name">
                  <Form.Control
                    size="lg"
                    required
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
                </FloatingLabel>
              </Row>

              <Row className="mb-1">
                <FloatingLabel id="servings" label="Servings">
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
                <Col className="">
                  {" "}
                  <FloatingLabel id="Yield number" label="Yield (optional)">
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
                </Col>
                <Col xs={10} className="">
                  {" "}
                  <FloatingLabel
                    id="Yield Description"
                    label="Yield Description (optional)"
                  >
                    <Form.Control
                      required
                      type="text"
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

          <Row className="mt-4">
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
                    className="flex-grow-1 text-body border-0"
                    variant="primary"
                    onClick={async () => {
                      console.log("importing...");
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
                    <ImportIngredientsList
                      ingredientList={[ingredientList, setIngredientList]}
                      updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
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
              {/* <Button
              type="button"
              onClick={() => console.log(updatedRecipe)}
              className="p-1"
            >
              Test
            </Button> */}
            </Col>
          </Row>
        </Form.Group>
      </Container>
    </Container>
  );
}
