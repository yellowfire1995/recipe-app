import { useMutation } from "@tanstack/react-query";
import { Col, FloatingLabel, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import {
  parseDirections,
  parseIngredients,
  scrapeRecipe,
} from "../../../../db/queries";
import { isValidHTML, isValidUrl } from "../../../utils/isValidUrl";
import { AddRecipeScan } from "../New Recipe/AddRecipeScan";
import { useRecipeContext } from "../RecipeContextProvider";

async function handleImport({ scrapedData, recipe, setRecipe, url }) {
  const ingredientString = scrapedData.recipeIngredient.join("\r\n");

  const directionString =
    typeof scrapedData.recipeInstructions === "string"
      ? scrapedData.recipeInstructions
      : scrapedData.recipeInstructions
          .map((direction) => direction.text)
          .join("\r\n");

  const choices = await parseIngredients(ingredientString);
  const directions = await parseDirections(directionString);

  let servings = 1;

  if (scrapedData.recipeYield) {
    try {
      servings = parseInt(scrapedData.recipeYield[0]);
    } catch {
      servings = 1;
    }
  }

  setRecipe({
    ...recipe,
    url: url,
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
}

export function EditableUrlField() {
  const { recipe, setRecipe } = useRecipeContext();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ url, html }) => {
      return await scrapeRecipe({
        url,
        html,
      });
    },
    onError: () =>
      toast.error("Error importing recipe, please try again later."),
    onSuccess: async (data) => {
      await handleImport({
        url: recipe.url,
        scrapedData: data,
        recipe,
        setRecipe,
      });
    },
  });

  return (
    <Row className="d-flex flex-wrap">
      <Col className="d-flex">
        <FloatingLabel label="Original recipe URL (optional)" className="w-100">
          <Form.Control
            id="importURL"
            size="lg"
            type="text"
            value={recipe.importBox || ""}
            onChange={(e) =>
              setRecipe({
                ...recipe,
                importBox: e.target.value,
              })
            }
          />
        </FloatingLabel>
      </Col>
      <Col md={2} className="d-flex ps-md-0 pe-md-0">
        <Button
          className="w-100"
          variant="primary"
          disabled={!isValidUrl(recipe.importBox)}
          type="button"
          onClick={() => {
            setRecipe({
              ...recipe,
              url: document.getElementById("importURL").value,
            });
            mutateAsync({ url: document.getElementById("importURL").value });
          }}
        >
          {isPending ? "Importing..." : "Import"}
        </Button>

        <AddRecipeScan className="w-30 ms-2" />
      </Col>
      <Col xs="auto" className="d-flex ps-md-0 ms-1">
        {/* <input type="file" className="d-none" id="file" name="file" multiple /> */}
      </Col>
      {isValidHTML(recipe.importBox) ? (
        <Col md={2} className="d-flex ps-md-0">
          <Button
            className="w-100"
            variant="primary"
            type="button"
            onClick={() =>
              mutateAsync({
                html: document.getElementById("importURL").value,
              })
            }
          >
            Load HTML
          </Button>
        </Col>
      ) : null}
    </Row>
  );
}
