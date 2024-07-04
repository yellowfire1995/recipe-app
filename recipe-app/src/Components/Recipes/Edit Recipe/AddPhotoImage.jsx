import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { useRecipeContext } from "../RecipeContextProvider";

export function AddPhotoImage() {
  const { recipe } = useRecipeContext();

  return (
    <Row>
      <Col className="text-start p-0">
        <img
          src={recipe.imgUrl}
          style={{
            width: "9rem",
            height: "9rem",
            backgroundColor: "rgb(0,0,0,.3)",
            objectFit: "cover",
          }}
        />
      </Col>
    </Row>
  );
}
