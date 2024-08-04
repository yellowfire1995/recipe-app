import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {
  parseDirections,
  parseIngredients,
  scrapeRecipe,
} from "../../../../db/queries";
import { useRecipeContext } from "../RecipeContextProvider";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

async function handleImport({
  scrapedData,
  recipe,
  setRecipe,
  setIngredientList,
}) {
  const ingredientString = scrapedData.recipeIngredient.join("\r\n");

  const directionString =
    typeof scrapedData.recipeInstructions == "string"
      ? scrapedData.recipeInstructions
      : scrapedData.recipeInstructions
          .map((direction) => direction.text)
          .join("\r\n");

  const choices = await parseIngredients(ingredientString);
  const directions = await parseDirections(directionString);

  let servings = 1;

  if (scrapedData.recipeYield.length > 0) {
    try {
      servings = parseInt(scrapedData.recipeYield[0]);
    } catch (error) {
      servings = 1;
    }
  }

  setRecipe({
    ...recipe,
    directions: directions,
    img_url: scrapedData.image?.url,
    name: scrapedData.name ? scrapedData.name : "",
    ingredients: choices.map((choice) => {
      return { ...choice[0], searchArray: choice };
    }),
    servings: servings,
    ingredientText: ingredientString,
    directionText: directionString,
  });

  setIngredientList(choices);
}

export function ImportRecipeButton({ setIngredientList }) {
  const { recipe, setRecipe } = useRecipeContext();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      return await scrapeRecipe(document.getElementById("importURL").value);
    },
    onError: () =>
      toast.error("Error importing recipe, please try again later."),
    onSuccess: (data) => {
      setRecipe({
        ...recipe,
        url: document.getElementById("importURL").value,
      });
      handleImport({
        scrapedData: data,
        recipe,
        setRecipe,
        setIngredientList,
      });
      handleClose();
    },
  });

  return (
    <>
      <Row>
        <Col>
          <Button variant="primary" className="w-100" onClick={handleShow}>
            Add Recipe from Link
          </Button>
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Import Recipe</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Control
            className=""
            type="text"
            id="importURL"
            placeholder="Enter URL"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="button" onClick={mutateAsync}>
            {isPending ? "Importing..." : "Import"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ImportRecipeButton;
