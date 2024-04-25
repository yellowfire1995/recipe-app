import {
  Form as ReactForm,
  redirect,
  useNavigate,
  useParams,
} from "react-router-dom";
import CardImg from "react-bootstrap/esm/CardImg";
import Container from "react-bootstrap/esm/Container";
import { useEffect, useState } from "react";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../main";
import Loading from "../Components/Loading";
import Form from "react-bootstrap/Form";
import AddPhotoModal from "../Components/AddPhotoModal";
import FloatingLabel from "react-bootstrap/FloatingLabel";

export default function Edit() {
  const params = useParams();
  const [searchList, setSearchList] = useState([]);
  const [ingredientList, setIngredientList] = useState([]);
  const [updatedRecipe, setUpdatedRecipe] = useState();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0();

  const recipeFetch = useQuery({
    queryKey: [`Recipe${params.recipeId}`],
    queryFn: () => getRecipeById(params.recipeId),
  });

  useEffect(() => {
    if (recipeFetch.status === "success") {
      setUpdatedRecipe(recipeFetch.data[0]);
    }
  }, [recipeFetch.status, recipeFetch.data]);

  const editor = useMutation({
    mutationFn: (e) => {
      return editRecipe(e, updatedRecipe);
    },
    onError: () => {
      alert("Error occured! Please try again");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["AllRecipes"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["MyRecipes"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: [`Recipe${params.recipeId}`],
        refetchType: "all",
      });
      navigate(`/recipes/${updatedRecipe.recipe_id}`);
    },
  });

  if (recipeFetch.isLoading || typeof updatedRecipe == "undefined") {
    return <Loading />;
  } else if (user.sub == updatedRecipe.author && isAuthenticated) {
    return (
      <Container md fluid="lg" className="d-flex mt-4">
        <Container fluid>
          <Form
            onSubmit={(e) => {
              editor.mutate(e);
              e.preventDefault();
            }}
            encType="multipart/form-data"
          >
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
                            yieldNumber: e.target.valueAsNumber,
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
            <Row className="p-1">
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
                    {updatedRecipe.ingredients.length > 0 ? (
                      <IngredientsList
                        updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
                        ingredientList={[ingredientList, setIngredientList]}
                        searchList={[searchList, setSearchList]}
                      />
                    ) : null}

                    <DirectionsList
                      updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
                    />
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

                  <Button
                    type="button"
                    onClick={() => console.log(updatedRecipe)}
                    className="p-1"
                  >
                    Test
                  </Button>
                  <DeleteButton
                    recipe={updatedRecipe}
                    recipeId={params.recipeId}
                  />
                </Container>
              </Col>
            </Row>
          </Form>
        </Container>
      </Container>
    );
  } else {
    return <div> Unauthorized</div>;
  }
}
