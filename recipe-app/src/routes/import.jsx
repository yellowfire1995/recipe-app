import { Form as ReactForm, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import Col from "react-bootstrap/esm/Col";
import ImportIngredientsList from "../Components/importIngredientList";
import DirectionsList from "../Components/directionslist";
import CuisineSelector from "../Components/cuisineselector";
import CategorySelector from "../Components/categoryselector";
import Row from "react-bootstrap/esm/Row";
import CardImg from "react-bootstrap/esm/CardImg";
import { parseDirections, scrapeRecipe } from "../../db/queries";
import { parseIngredients } from "../../db/queries";
import Container from "react-bootstrap/esm/Container";
import { newRecipe } from "../../db/queries";
import httpClient from "../../db/axiosConfig";
import { useAuth0 } from "@auth0/auth0-react";
import { auth0Audience } from "../../env/env";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../main";
import { getMyRecipeCards } from "../../db/queries";
import { getRecipeCards } from "../../db/queries";

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
    <>
      <Container style={{ width: "100%" }} className="border shadow ">
        <ReactForm onSubmit={mutation.mutate}>
          <Row>
            <CardImg
              src={updatedRecipe.img_url}
              style={{ width: "100%", height: "200px" }}
              className="object-fit-cover"
            />

            <input
              required
              type="text"
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
              name="importURL"
              value={updatedRecipe.url}
              placeholder="Enter recipe url..."
              onChange={(e) =>
                setUpdatedRecipe({
                  ...updatedRecipe,
                  url: e.target.value,
                })
              }
            />

            <Button
              size="sm"
              onClick={async () =>
                handleImport(await scrapeRecipe(updatedRecipe.url))
              }
            >
              Import
            </Button>
          </Row>
          <Row className="d-inline">
            <Container>
              <h2>
                <input
                  required
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
                <Button
                  type="button"
                  onClick={() => console.log(updatedRecipe.ingredients)}
                  className="p-1"
                >
                  Test
                </Button>
              </h2>

              <label id="servings">Default Servings </label>
              <input
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
                style={{ width: "3rem" }}
                className="me-2"
                // name="servings"
              />
            </Container>
          </Row>
          <Row className="pt-3">
            <CategorySelector
              updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
            />{" "}
            <CuisineSelector
              updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
            />
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
                    console.log("importing...");
                    setIngredientList(await getIngredientChoices());
                  }}
                >
                  Import Ingredients
                </Button>
              </Form.Group>
              <ImportIngredientsList
                ingredientList={[ingredientList, setIngredientList]}
                updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
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
                    setUpdatedRecipe({
                      ...updatedRecipe,
                      directions: await parseDirections(directions),
                    });
                  }}
                >
                  Import Directions
                </Button>
              </Form.Group>
              <DirectionsList
                updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
              />
            </Col>
          </Row>
        </ReactForm>
      </Container>
    </>
  );
}
