import CardImg from "react-bootstrap/esm/CardImg";
import Row from "react-bootstrap/esm/Row";
import { useRecipeContext } from "../RecipeContextProvider";

export function RecipeHeaderImage() {
  const { recipe } = useRecipeContext();
  if (recipe.imgUrl) {
    return (
      <Row>
        <CardImg
          as="img"
          src={recipe.imgUrl}
          style={{ height: "12rem" }}
          className="object-fit-cover my-1 recipecardimg"
        />
      </Row>
    );
  }
}
