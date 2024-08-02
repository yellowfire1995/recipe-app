import { useQuery } from "@tanstack/react-query";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col.js";
import Container from "react-bootstrap/esm/Container.js";
import Row from "react-bootstrap/esm/Row";
import { useSearchParams } from "react-router-dom";
import Loading from "../../Loading.jsx";
import RecipeCardData from "./RecipeCard.jsx";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { RecipeSearchOptionsBar } from "../RecipeSearchOptionsBar.jsx";

export default function RecipeCards(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");
  const search = searchParams.get("search");
  const pageSize = searchParams.get("pageSize");
  const sort = searchParams.get("sort");
  const [recipeCards, setRecipeCards] = useState();
  const { isAuthenticated } = useAuth0();

  const previousPageParams = {
    ...Object.fromEntries(searchParams),
    page: page ? (parseInt(page) - 1).toString() : "2",
  };

  const nextPageParams = {
    ...Object.fromEntries(searchParams),
    page: page ? (parseInt(page) + 1).toString() : "2",
  };

  const { isLoading, refetch, data, isError, isFetched } = useQuery({
    queryKey: [props.queryKey, page, search, pageSize, sort],
    queryFn: async () =>
      await props.fetcher({
        page: page,
        search: search,
        pageSize: pageSize,
        sort: sort,
      }),
  });

  useEffect(() => {
    refetch();
  }, [refetch, isAuthenticated]);

  useEffect(() => {
    if (isFetched && !isError && data) {
      setRecipeCards(data.data);
    }
  }, [data, isFetched, isError, isAuthenticated]);

  if (isError) {
    return <div>An error has occured</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (recipeCards && isFetched) {
    return (
      <>
        (
        <Container>
          <RecipeSearchOptionsBar />
          <Row>
            <Col className="d-flex flex-wrap justify-content-center">
              <RecipeCardData
                cards={recipeCards}
                setCards={setRecipeCards}
                refetch={refetch}
              />
            </Col>
          </Row>
          <Row className="w-100">
            <Col className="justify-content-evenly d-flex">
              <Button
                className={`${
                  parseInt(page) < 2 || page == null ? "d-none" : " "
                }`}
                onClick={() => setSearchParams(previousPageParams)}
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
        )
      </>
    );
  }
}
