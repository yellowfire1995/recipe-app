import { useQuery } from "@tanstack/react-query";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col.js";
import Container from "react-bootstrap/esm/Container.js";
import Row from "react-bootstrap/esm/Row";
import { useSearchParams } from "react-router-dom";
import Loading from "../../Loading.jsx";
import RecipeCardData from "./RecipeCard.jsx";
import { useEffect } from "react";

export default function RecipeCards(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");
  const searchQuery = searchParams.get("search");

  const previousPageParams =
    searchQuery == null
      ? {
          page: page ? (parseInt(page) - 1).toString() : "2",
        }
      : {
          page: page ? (parseInt(page) - 1).toString() : "2",
          search: searchQuery,
        };

  const nextPageParams =
    searchQuery == null
      ? {
          page: page ? (parseInt(page) + 1).toString() : "2",
        }
      : {
          page: page ? (parseInt(page) + 1).toString() : "2",
          search: searchQuery,
        };

  const { isLoading, refetch, isAuthenticated, data, isError } = useQuery({
    queryKey: [props.queryKey, page, searchQuery],
    queryFn: async () =>
      await props.fetcher({
        page: page,
        search: searchQuery,
      }),
  });

  useEffect(() => {
    refetch();
  }, [refetch, isAuthenticated]);

  if (isError) {
    return <div>An error has occured</div>;
  }

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Container>
          <Row>
            <Col className="d-flex flex-wrap justify-content-center">
              <RecipeCardData cards={data.data} />
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
      )}
    </>
  );
}
