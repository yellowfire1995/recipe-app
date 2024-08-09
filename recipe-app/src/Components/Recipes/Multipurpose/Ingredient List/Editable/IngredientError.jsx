import ErrorIcon from "@mui/icons-material/Error";
import { toast } from "react-toastify";

export function IngredientError({ ingredient }) {
  const errors = [];
  const warnings = [];

  const showErrors = () => {
    errors.forEach((error) => toast.error(error));
  };

  const showWarnings = () => {
    warnings.forEach((warning) => toast.warning(warning));
  };

  if (!ingredient.nutrients && ingredient.quantity != 0) {
    errors.push("No nutrition information for selected ingredient");
  }
  if (!ingredient.fdc_id) {
    errors.push("No ingredient matched to database");
  }
  if (
    !ingredient.userG &&
    !ingredient.gramConversion &&
    ingredient.quantity != 0
  ) {
    errors.push("No measurement information found for ingredient");
  }

  if (ingredient.quantity == 0) {
    warnings.push(
      "No quantity provided; no nutritional information or cost can be calculated."
    );
  }

  if (
    ingredient.matchedMeasure != ingredient.unitOfMeasure &&
    ingredient.matchedMeasure == ingredient.userLabel
  ) {
    warnings.push("Matched measurement does not match given measurement.");
  }

  if (
    !ingredient.gramConversion &&
    !ingredient.userG &&
    ingredient.quantity != 0
  ) {
    errors.push("Please add measurement weight to calculate nutrition.");
  }

  if (errors.length > 0 || warnings.length > 0) {
    const iconColor = errors.length > 0 ? "red" : "orange";

    return (
      <ErrorIcon
        className="ingredientErrorIcon flex-end"
        onClick={() => {
          showErrors();
          showWarnings();
        }}
        style={{ color: iconColor }}
      />
    );
  }
}
