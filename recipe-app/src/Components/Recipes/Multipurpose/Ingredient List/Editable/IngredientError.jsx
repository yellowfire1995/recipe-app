import ErrorIcon from "@mui/icons-material/Error";
import { toast } from "react-toastify";

export function IngredientError({ ingredient }) {
  const errors = [];

  const showErrors = () => {
    errors.forEach((error) => toast.error(error));
  };

  if (!ingredient.nutrients) {
    errors.push("No nutrition information for selected ingredient");
  }
  if (!ingredient.fdc_id) {
    errors.push("No ingredient matched to database");
  }
  if (!ingredient.matchedMeasure && !ingredient.userLabel) {
    errors.push("No measurement information found for ingredient");
  }

  if (!ingredient.gramConversion && !ingredient.userG) {
    errors.push("Please add measurement weight to calculate nutrition.");
  }

  if (errors.length > 0) {
    return (
      <ErrorIcon
        className="ingredientErrorIcon flex-end"
        onClick={showErrors}
      />
    );
  }
}
