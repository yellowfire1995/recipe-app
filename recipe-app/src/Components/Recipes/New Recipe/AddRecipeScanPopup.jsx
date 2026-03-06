import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import {
  parseDirections,
  parseIngredients,
  photoImport,
} from "../../../../db/queries";
import { useRecipeContext } from "../RecipeContextProvider";

async function handleScan({
  ingredientString,
  directionString,
  name,
  servings,
  recipe,
  setRecipe,
}) {
  const choices = ingredientString
    ? await parseIngredients(ingredientString)
    : null;
  const directions = directionString
    ? await parseDirections(directionString)
    : null;

  setRecipe({
    ...recipe,
    directions: directions,
    name: name ? name : "",
    ingredients: choices.map((choice) => {
      return { ...choice[0], searchArray: choice };
    }),
    servings: servings ? servings : 1,
    ingredientText: ingredientString,
    directionText: directionString,
  });
}

function handleDeleteImage({ fileArray, setFileArray, imageIndex }) {
  const filteredArray = fileArray.filter((file, index) => index !== imageIndex);
  setFileArray(filteredArray);
}

export function AddRecipeScanPopup({ setShowPopup, showPopup }) {
  const { recipe, setRecipe } = useRecipeContext();
  const [fileArray, setFileArray] = useState([]);

  const handleClose = () => {
    setShowPopup(!showPopup);
    setFileArray([]);
  };

  const handleShow = () => {
    document.getElementById("recipeFile").click();
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await photoImport({
        scanArray: fileArray,
      });
      handleScan({
        name: data?.name || null,
        servings: data.servings || 1,
        ingredientString: data.ingredientString,
        directionString: data.directionString,
        setRecipe,
        recipe,
      });
    },
    onError: () => {
      toast.error("Error scanning recipe, please try again later.");
    },
    onSuccess: async () => {
      setShowPopup(false);
      setFileArray([]);
    },
  });

  return (
    <Modal
      show={showPopup}
      onHide={handleClose}
      onShow={handleShow}
      animation={true}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Import Via Photo</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Container>
          <Row className="justify-content-center">
            {fileArray.map((scan, idx) => {
              const preview = URL.createObjectURL(scan);
              return (
                <div
                  className="recipe-scan-image"
                  key={idx}
                  onClick={() =>
                    handleDeleteImage({
                      fileArray,
                      setFileArray,
                      imageIndex: idx,
                    })
                  }
                >
                  <img src={preview} style={{ width: "100px" }} />
                </div>
              );
            })}
          </Row>
          <Row className="align-items-center">
            <Col xs={10} className="d-flex">
              <Form.Control
                id="recipeFile"
                onChange={(e) => {
                  if (e.target.files) {
                    setFileArray(fileArray.concat(Array.from(e.target.files)));
                  }
                }}
                className=""
                type="file"
                name="uploadFile"
                accept="image/*"
                multiple
                hidden
              />
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            document.getElementById("recipeFile").value = "";
            setFileArray([]);
          }}
        >
          Clear
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            document.getElementById("recipeFile").click();
          }}
        >
          Add Photo(s)
        </Button>
        <Button
          variant="primary"
          htmlFor="photoUrl"
          type="button"
          disabled={fileArray.length < 1}
          onClick={mutateAsync}
        >
          {isPending ? "Loading..." : "Continue"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
