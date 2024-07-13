import { getCollectionRecipes } from "../../db/queries";
import Col from "react-bootstrap/esm/Col.js";
import Row from "react-bootstrap/esm/Row";
import Container from "react-bootstrap/esm/Container";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Components/Loading";
import DeleteCollectionModal from "../Components/Collections/DeleteCollectionModal";
import CollectionScroller from "../Components/Collections/CollectionScroller";
import EditCollectionRecipes from "../Components/Collections/EditCollectionRecipes";
import { Helmet } from "react-helmet-async";

export default function Collections() {
  const collections = useQuery({
    queryKey: ["Collections"],
    queryFn: () => getCollectionRecipes(),
  });

  if (collections.isError) {
    return <div>Recipe not found</div>;
  }

  if (collections.isLoading) {
    return <Loading />;
  }

  if (!collections.isLoading) {
    return (
      <>
        <Helmet>
          <title>CookbookCalc | Collections</title>
        </Helmet>
        <Container className="mt-3">
          <Row>
            <Col className="justify-content-center">
              {collections.data.length > 0 ? (
                collections.data.map((collection) => {
                  return (
                    <Row className="d-flex" key={collection.id}>
                      <h5>
                        {collection.name}{" "}
                        <DeleteCollectionModal collection={collection} />
                        <EditCollectionRecipes collection={collection} />
                      </h5>
                      <CollectionScroller collection={collection} />
                    </Row>
                  );
                })
              ) : (
                <h2 className="text-center mt-2"> No Collections Found </h2>
              )}
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
