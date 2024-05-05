import RecipeCardData from "./RecipeCard.jsx";
import { useQuery } from "@tanstack/react-query";
import Loading from "./Loading.jsx";
import {
  Link,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import Row from "react-bootstrap/esm/Row";
import Container from "react-bootstrap/esm/Container.js";
import Col from "react-bootstrap/esm/Col.js";
import Button from "react-bootstrap/esm/Button";
import { getCollectionRecipes } from "../../db/queries.js";

export default function RecipeCards(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");
  const searchQuery = searchParams.get("search");

  console.log(searchQuery == null);

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

  console.log(nextPageParams);

  const cardsQuery = useQuery({
    queryKey: [props.queryKey, page, searchQuery],
    queryFn: async () =>
      await props.fetcher({
        page: page,
        search: searchQuery,
      }),
  });

  if (cardsQuery.isError) {
    return <div>An error has occured</div>;
  }

  return (
    <>
      {cardsQuery.isLoading ? (
        <Loading />
      ) : (
        <Container>
          <Row>
            <Col className="d-flex flex-wrap justify-content-center">
              <RecipeCardData cards={cardsQuery.data.data} />
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
                className={`${cardsQuery.data.lastPage ? "d-none" : " "}`}
                onClick={() => setSearchParams(nextPageParams)}
              >
                Next page
              </Button>
              <Button onClick={getCollectionRecipes}> Test</Button>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}
