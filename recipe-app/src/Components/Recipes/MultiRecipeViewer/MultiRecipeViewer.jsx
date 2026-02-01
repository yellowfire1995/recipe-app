import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { getMyRecipeCards } from "../../../../db/queries";
import Loading from "../../Loading";
import { RecipeSearchOptionsBar } from "../RecipeSearchOptionsBar";
import { CardItemsContainer } from "./CardView/CardItemsContainer";
import { ListItemsContainer } from "./ListView/ListItemsContainer";
import { RecipeListContext } from "./MultiRecipeContext";

export function MultiRecipeViewer({
  query = getMyRecipeCards,
  queryKey = "MyRecipes",
  listViewDefault = false,
  queryParams = {},
  ...props
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");
  const search = searchParams.get("search");
  const pageSize = searchParams.get("pageSize");
  const sort = searchParams.get("sort");
  const [isListView, setIsListView] = useState(listViewDefault);

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
        queryParams,
      }),
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    <Row>
      <Col>
        <p>An error occured! Please try again.</p>
      </Col>
    </Row>;
  }

  if (data && isFetched && !isError) {
    const { recipes, lastPage } = data;

    return (
      <RecipeListContext.Provider
        value={{
          isLoading,
          refetch,
          recipes,
          lastPage,
          isError,
        }}
      >
        <Container fluid="xxl" className="recipe-list" {...props}>
          <RecipeSearchOptionsBar
            isListView={isListView}
            setIsListView={setIsListView}
          />
          <Row>
            {isListView ? <ListItemsContainer /> : <CardItemsContainer />}
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
