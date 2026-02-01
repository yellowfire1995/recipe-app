import Col from "react-bootstrap/esm/Col.js";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { getRecipeCards } from "../../db/queries";
import { MultiRecipeViewer } from "../Components/Recipes/MultiRecipeViewer/MultiRecipeViewer";

export default function CollectionRecipesPage() {
  const { collectionId } = useParams();

  

  return (
    <>
      <Helmet>
        <title>CookbookCalc | Collections</title>
      </Helmet>
      <Container className="mt-3 px-0" fluid="lg">
        <Row className="px-0">
          <Col className="justify-content-center px-0">
            <MultiRecipeViewer
              query={getRecipeCards}
              queryParams={{ collectionId: collectionId }}
              queryKey={`Collection${collectionId}`}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}
