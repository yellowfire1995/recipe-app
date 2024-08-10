import InfoIcon from "@mui/icons-material/Info";
import { Form, OverlayTrigger, Popover } from "react-bootstrap";
import { useRecipeContext } from "../RecipeContextProvider";

export function ShowOriginalingredientSwitch({ label = "Original Names" }) {
  const { recipe, setRecipe } = useRecipeContext();

  const popover = (
    <Popover id="ShowOriginalExplanation">
      <Popover.Body>
        This does not change the underlying ingredient information, just how it
        is displayed.
      </Popover.Body>
    </Popover>
  );
  if (recipe.ingredients.length > 0)
    return (
      <>
        <Form.Check
          type="switch"
          checked={
            recipe.ingredients.every(
              (ingredient) => ingredient.displayOriginalName
            ) && recipe.ingredients.length > 0
          }
          onChange={(e) => {
            setRecipe({
              ...recipe,
              ingredients: recipe.ingredients.map((ingredient) => {
                return {
                  ...ingredient,
                  displayOriginalName: e.target.checked,
                };
              }),
            });
          }}
          label={label}
        ></Form.Check>{" "}
        <OverlayTrigger
          trigger={["hover", "focus", "click"]}
          placement="bottom-end"
          overlay={popover}
        >
          <InfoIcon />
        </OverlayTrigger>
      </>
    );
}
