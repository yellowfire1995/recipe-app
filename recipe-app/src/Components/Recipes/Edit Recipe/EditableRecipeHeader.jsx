import { Col, Row } from "react-bootstrap";
import { RecipeForm } from "../RecipeForm";

export function EditableRecipeHeader({ recipe, setRecipe }) {
  return (
    <>
      <Row>
        <Col>
          <RecipeForm.EditableUrlField />
        </Col>
      </Row>
      <Row className="m-1 justify-content-center">
        <RecipeForm.AddPhoto
          style={{
            width: "10rem",
            height: "12rem",
          }}
          className="photo-add ps-2"
        />
        <Col md>
          <Row className="mb-1">
            <RecipeForm.EditableNameField />
          </Row>

          <Row className="mb-1">
            <RecipeForm.EditableServingsField />
          </Row>
          <Row>
            <Col className="p-0 mb-1 me-md-2">
              <RecipeForm.EditableYieldNumber />
            </Col>
            <Col lg={8} className="p-0">
              <RecipeForm.EditableYieldDescription />
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="mx-1">
        <Col md className="mb-1 me-md-1 p-0 ms-0">
          <RecipeForm.CategorySelector updatedRecipe={[recipe, setRecipe]} />
        </Col>
        <Col md className="p-0 ms-md-1">
          <RecipeForm.CuisineSelector updatedRecipe={[recipe, setRecipe]} />
        </Col>
      </Row>
      <Row className="px-0 py-2">
        <Col className="align-content-center d-flex">
          <RecipeForm.EditableVisibilityCheckbox />
        </Col>
      </Row>
    </>
  );
}
