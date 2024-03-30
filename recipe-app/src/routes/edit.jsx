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

export default function Edit() {
  const params = useParams();
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
      <>
        <Container fluid="lg" className="border shadow ">
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
            onSubmit={(e) => {
              editor.mutate(e);
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
                  <DeleteButton recipeId={params.recipeId} />
                  <button
                    type="button"
                    onClick={() => console.log(updatedRecipe)}
                  >
                    Test
                  </button>
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
                  updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
                />
              </Col>
              <Col>
                <CategorySelector
                  updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
                />{" "}
                <CuisineSelector
                  updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
                />
                <DirectionsList
                  updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
                />
              </Col>
            </Row>
          </ReactForm>
        </Container>
      </>
    );
  } else {
    return <div> Unauthorized</div>;
  }
}
