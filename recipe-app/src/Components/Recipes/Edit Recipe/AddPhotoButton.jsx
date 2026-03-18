import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { useRecipeContext } from "../RecipeContextProvider";

export function AddPhotoButton() {
  const { recipe } = useRecipeContext();

  return (
    <Row className="">
      <Col className="text-start p-0">
        <Button size="sm" style={{ width: "9rem" }}>
          <CameraAltIcon />{" "}
          {recipe.imgUrl || recipe.imgFile ? "Edit Photo" : "Add photo"}
        </Button>
      </Col>
    </Row>
  );
}
