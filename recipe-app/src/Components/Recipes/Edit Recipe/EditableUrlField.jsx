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
import { isValidUrl } from "../../../utils/isValidUrl";
import { useRecipeContext } from "../RecipeContextProvider";

async function handleImport({
  scrapedData,
  recipe,
  setRecipe,
  setIngredientList,
  url,
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

  if (scrapedData.recipeYield) {
    try {
      servings = parseInt(scrapedData.recipeYield[0]);
    } catch (error) {
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

  setIngredientList(choices);
}

export function EditableUrlField({ setIngredientList }) {
  const { recipe, setRecipe } = useRecipeContext();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      return await scrapeRecipe(document.getElementById("importURL").value);
    },
    onError: () =>
      toast.error("Error importing recipe, please try again later."),
    onSuccess: async (data) => {
      await handleImport({
        url: recipe.url,
        scrapedData: data,
        recipe,
        setRecipe,
        setIngredientList,
      });
    },
  });

  return (
    <>
      <Row className="d-flex flex-wrap">
        <Col className="d-flex">
          <FloatingLabel
            label="Original recipe URL (optional)"
            className="w-100"
          >
            <Form.Control
              id="importURL"
              size="lg"
              type="text"
              value={recipe.url || ""}
              onChange={(e) =>
                setRecipe({
                  ...recipe,
                  url: e.target.value,
                })
              }
            />
          </FloatingLabel>
        </Col>
        <Col md={2} className="d-flex ps-md-0">
          <Button
            className="w-100"
            variant="primary"
            disabled={!isValidUrl(recipe.url)}
            type="button"
            onClick={mutateAsync}
          >
            {isPending ? "Importing..." : "Import"}
          </Button>
        </Col>
      </Row>
    </>
  );
}
