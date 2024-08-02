import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import { RecipeListItem } from "./RecipeListItem";
import { RecipeListContext } from "./RecipeListContextProvider";
import { useQuery } from "@tanstack/react-query";
import { getMyRecipeCards } from "../../../../db/queries";
import { useEffect, useState } from "react";
import Loading from "../../Loading";
import { useSearchParams } from "react-router-dom";
import { RecipeSearchOptionsBar } from "../RecipeSearchOptionsBar";

export function RecipeList({
  query = getMyRecipeCards,
  queryKey = "MyRecipes",
  ...props
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");
  const search = searchParams.get("search");
  const pageSize = searchParams.get("pageSize");
  const sort = searchParams.get("sort");

  const previousPageParams = {
    ...Object.fromEntries(searchParams),
    page: page ? (parseInt(page) - 1).toString() : "2",
  };

  const nextPageParams = {
    ...Object.fromEntries(searchParams),
    page: page ? (parseInt(page) + 1).toString() : "2",
  };

  const { isLoading, refetch, data, isError, isFetched } = useQuery({
    queryKey: [queryKey, page, search, pageSize, sort],
    queryFn: async () =>
      await query({
        page: page,
        search: search,
        pageSize: pageSize,
        sort: sort,
      }),
  });

  const [myRecipes, setMyRecipes] = useState([]);

  useEffect(() => {
    if (data && isFetched && !isError) {
      setMyRecipes(data.recipes);
    }
  }, [data, isFetched, isError]);

  if (isLoading) {
    return <Loading />;
  }

  if (data) {
    const { recipes, lastPage } = data;

    return (
      <RecipeListContext.Provider
        value={{
          isLoading,
          refetch,
          recipes,
          lastPage,
          isError,
          isFetched,
          myRecipes,
          setMyRecipes,
        }}
      >
        <Container className="recipeList" {...props}>
          <RecipeSearchOptionsBar />
          <Row>
            <ListGroup {...props}>
              {recipes.map((recipe, index) => {
                return (
                  <RecipeListItem
                    key={`${index} ${page} ${recipe.recipeId}`}
                    recipe={recipe}
                  />
                );
              })}{" "}
            </ListGroup>
          </Row>

          <Row className="w-100">
            <Col className="justify-content-evenly d-flex">
              <Button
                className={`${
                  parseInt(page) < 2 || page == null ? "d-none" : " "
                }`}
                onClick={() => {
                  setSearchParams(previousPageParams);
                  refetch();
                }}
              >
                Previous Page
              </Button>
              <Button
                className={`${data.lastPage ? "d-none" : " "}`}
                onClick={() => setSearchParams(nextPageParams)}
              >
                Next page
              </Button>
            </Col>
          </Row>
        </Container>
      </RecipeListContext.Provider>
    );
  }
}
