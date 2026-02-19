import { Col, Row } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useMultiRecipeViewerContext } from "../MultiRecipeContext";
import { NoRecipes } from "../NoRecipes";
import { RecipeCardItem } from "./RecipeCardItem";

export function CardItemsContainer() {
  const { recipes, refetch } = useMultiRecipeViewerContext();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");

  if (recipes.length < 1) {
    return <NoRecipes />;
  }

  return (
    <Row>
        <Col className="d-flex flex-wrap justify-content-center">
          {recipes.map((recipe, index) => {
            return (
              <RecipeCardItem
                refetch={refetch}
                recipe={recipe}
                key={`${index} ${page} ${recipe.recipeId}`}
              />
            );
          })}
        </Col>
      </Row>
  );
}
