import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { Accordion, ListGroup, ListGroupItem } from "react-bootstrap";
import Col from "react-bootstrap/esm/Col.js";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { Link } from "react-router-dom";
import { getCollectionNames } from "../../db/queries";
import { roles } from "../../env/env";
import DeleteCollectionModal from "../Components/Collections/DeleteCollectionModal";
import MakePublicIcon from "../Components/Collections/MakePublicIcon";
import Loading from "../Components/Loading";

export default function MyCollections() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["Collections"],
    queryFn: () => getCollectionNames(),
  });

  const { user } = useAuth0();
  const isAdmin = user[roles].includes("Admin");

  if (isError) {
    return <div>Recipe not found</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!isLoading && !isError && data) {
    return (
      <>
        <title>CookbookCalc | Collections</title>

        <Container className="mt-3 px-0" fluid="lg">
          <Row className="px-0">
            <Col className="justify-content-center px-0">
              <Accordion className="collection-accordion align-items-center">
                {data.length > 0 ? (
                  data.map((collection) => {
                    return (
                      <ListGroup key={collection.id}>
                        <ListGroupItem className="d-flex flex-wrap">
                          <Col className="d-flexr">
                            <Link
                              style={{ display: "contents" }}
                              to={`/collections/${collection.id}`}
                            >
                              <h3 className="m-0 align-items-center">
                                {collection.name}({collection.count})
                              </h3>
                            </Link>
                          </Col>
                          <Col className="d-flex text-nowrap" xs="auto">
                            {isAdmin && (
                              <MakePublicIcon collection={collection} />
                            )}

                            <DeleteCollectionModal collection={collection} />
                          </Col>
                        </ListGroupItem>
                      </ListGroup>
                    );
                  })
                ) : (
                  <h2 className="text-center mt-2"> No Collections Found </h2>
                )}
              </Accordion>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
