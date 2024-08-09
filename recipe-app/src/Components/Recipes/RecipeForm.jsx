import { AddRecipeToCollectionModal } from "../Collections/AddRecipeToCollectionModal";
import { AddToMealPlannerButton } from "../Planner/AddToMealPlannerButton";
import { RecipeContext } from "./RecipeContextProvider";
import { CategoryBadge } from "./View Recipe/CategoryBadge";
import { CuisineBadge } from "./View Recipe/CuisineBadge";
import { DirectionList } from "./View Recipe/DirectionList";
import { EditRecipeButton } from "./View Recipe/EditRecipeButton";
import { IngredientList } from "./Multipurpose/Ingredient List/IngredientList";
import { RecipeCredit } from "./Recipe Header/RecipeCredit";
import { RecipeHeader } from "./Recipe Header/RecipeHeader";
import { RecipeOptionsDropdown } from "./Recipe Header/RecipeHeaderButtons";
import { RecipeHeaderImage } from "./Recipe Header/RecipeHeaderImage";
import { RecipePrice } from "./View Recipe/RecipePrice";
import { RemixButton } from "./View Recipe/RemixButton";
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/esm/Col";
import { DeleteRecipeIcon } from "./Edit Recipe/DeleteRecipeButton";
import { AddPhoto } from "./Edit Recipe/AddPhoto";
import { AddPhotoButton } from "./Edit Recipe/AddPhotoButton";
import { AddPhotoPopup } from "./Edit Recipe/AddPhotoPopup";
import { AddPhotoImage } from "./Edit Recipe/AddPhotoImage";
import { EditableVisibilityCheckbox } from "./Edit Recipe/EditableVisibilityCheckbox";
import { EditableYieldNumber } from "./Edit Recipe/EditableYieldNumber";
import { EditableNameField } from "./Edit Recipe/EditableNameField";
import { EditableServingsField } from "./Edit Recipe/EditableServingsField";
import { EditableYieldDescription } from "./Edit Recipe/EditableYieldDescription";
import { IngredientListHeader } from "./Multipurpose/Ingredient List/View Only/IngredientListHeader";
import { IngredientListItem } from "./Multipurpose/Ingredient List/View Only/IngredientListItem";
import { EditableIngredientItem } from "./Multipurpose/Ingredient List/Editable/EditableIngredientItem";
import { EditableHeaderItem } from "./Multipurpose/Ingredient List/Editable/EditableHeaderItem";
import EditableDirectionsList from "./Multipurpose/EditableDirectionList";
import { EditableDirectionTextbox } from "./Edit Recipe/EditableDirecitonTextbox";
import { EditableIngredientTextbox } from "./Edit Recipe/EditableIngredientTextbox";
import { AddToIngredientListButtons } from "./Multipurpose/Ingredient List/AddToIngredientListButtons";
import { EditableUrlField } from "./Edit Recipe/EditableUrlField";

export function RecipeForm({ children, recipe, setRecipe }) {
  return (
    <Container fluid="lg" className="d-flex mt-4">
      <Col>
        <RecipeContext.Provider value={{ recipe, setRecipe }}>
          {children}
        </RecipeContext.Provider>
      </Col>
    </Container>
  );
}

//Viewable recipe options
RecipeForm.IngredientList = IngredientList;
RecipeForm.DirectionList = DirectionList;
RecipeForm.CuisineBadge = CuisineBadge;
RecipeForm.CategoryBadge = CategoryBadge;
RecipeForm.RecipeCredit = RecipeCredit;
RecipeForm.RecipePrice = RecipePrice;
RecipeForm.RecipeHeader = RecipeHeader;
RecipeForm.AddRecipeToCollectionModal = AddRecipeToCollectionModal;
RecipeForm.RecipeHeaderImage = RecipeHeaderImage;

//Buttons
RecipeForm.RecipeHeaderButtons = RecipeOptionsDropdown;
RecipeForm.RemixButton = RemixButton;
RecipeForm.AddToMealPlannerButton = AddToMealPlannerButton;
RecipeForm.EditRecipeButton = EditRecipeButton;
RecipeForm.DeleteRecipeIcon = DeleteRecipeIcon;

//Editable recipe options
RecipeForm.AddPhoto = AddPhoto;
RecipeForm.AddPhotoPopup = AddPhotoPopup;
RecipeForm.AddPhotoButton = AddPhotoButton;
RecipeForm.AddPhotoImage = AddPhotoImage;
RecipeForm.EditableNameField = EditableNameField;
RecipeForm.EditableServingsField = EditableServingsField;
RecipeForm.EditableYieldDescription = EditableYieldDescription;
RecipeForm.EditableYieldNumber = EditableYieldNumber;
RecipeForm.EditableVisibilityCheckbox = EditableVisibilityCheckbox;
RecipeForm.IngredientListHeader = IngredientListHeader;
RecipeForm.IngredientListItem = IngredientListItem;
RecipeForm.EditableIngredientItem = EditableIngredientItem;
RecipeForm.EditableHeaderItem = EditableHeaderItem;
RecipeForm.EditableDirectionList = EditableDirectionsList;
RecipeForm.EditableDirectionTextbox = EditableDirectionTextbox;
RecipeForm.EditableIngredientTextbox = EditableIngredientTextbox;
RecipeForm.AddToIngredientListButtons = AddToIngredientListButtons;
RecipeForm.EditableUrlField = EditableUrlField;
