import { useAuth0 } from "@auth0/auth0-react";
import Dropdown from "react-bootstrap/Dropdown";
import { useParams } from "react-router-dom";
import { AddToMealPlannerButton } from "../../../Planner/AddToMealPlannerButton";
import ChangeMealDay from "../../../Planner/ChangePlannerDateButton";
import { DeleteFromPlannerButton } from "../../../Planner/DeleteFromPlannerButton";
import { AddRecipeToCollectionModal } from "../../Buttons/AddRecipeToCollectionModal";
import { EditRecipeButton } from "../../Buttons/EditRecipeButton";
import { RemoveFromCollectionButton } from "../../Buttons/RemoveFromCollectionButton";
import { RemixButton } from "../../View Recipe/RemixButton";
import { RecipeDropdownItem } from "../RecipeDropdownItem";
import { DeleteRecipeHeaderButton } from "./DeleteRecipeHeaderButton";
import { RecipeHeaderButtonsContext } from "./RecipeHeaderButtonsContext";

export function RecipeOptionsDropdown({
  recipe,
  refetch = () => {},
  text = "",
  onDeleteSuccess = () => {},
  ...props
}) {
  const { isAuthenticated } = useAuth0();
  const { planId } = recipe;
  const { collectionId } = useParams();
  const renderCollectionButton = () =>
    collectionId ? (
      <RecipeDropdownItem>
        <RecipeOptionsDropdown.RemoveFromCollectionButton />
      </RecipeDropdownItem>
    ) : (
      <RecipeDropdownItem>
        <RecipeOptionsDropdown.AddRecipeToCollectionModal />
      </RecipeDropdownItem>
    );

  const renderPlannerButtons = () =>
    planId ? (
      <>
        <RecipeDropdownItem>
          <RecipeOptionsDropdown.ChangeMealDay />
        </RecipeDropdownItem>
        <RecipeDropdownItem>
          <RecipeOptionsDropdown.DeleteFromPlannerButton />{" "}
        </RecipeDropdownItem>
      </>
    ) : (
      <RecipeDropdownItem>
        <RecipeOptionsDropdown.AddToMealPlannerButton />
      </RecipeDropdownItem>
    );

  if (!isAuthenticated) {
    return <></>;
  }

  return (
    <>
      <Dropdown {...props}>
        <Dropdown.Toggle
          id="options-dropdown"
          className="recipe-buttons-dropdown svg-icon mb-0 d-flex align-items-center"
          as="h2"
        >
          {text}
        </Dropdown.Toggle>

        <Dropdown.Menu className="recipe-dropdown-menu px-1" align="end">
          <RecipeHeaderButtonsContext.Provider value={{ recipe }}>
            <RecipeDropdownItem>
              <RecipeOptionsDropdown.EditRecipeButton />
            </RecipeDropdownItem>
            <RecipeDropdownItem>
              {" "}
              <RecipeOptionsDropdown.RemixButton />
            </RecipeDropdownItem>
            {renderCollectionButton()}
            {renderPlannerButtons()}
            <RecipeDropdownItem>
              {" "}
              <RecipeOptionsDropdown.DeleteRecipeButton
                onSuccess={() => {
                  onDeleteSuccess();
                  refetch();
                }}
              />
            </RecipeDropdownItem>
          </RecipeHeaderButtonsContext.Provider>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

RecipeOptionsDropdown.RemixButton = RemixButton;
RecipeOptionsDropdown.AddToMealPlannerButton = AddToMealPlannerButton;
RecipeOptionsDropdown.EditRecipeButton = EditRecipeButton;
RecipeOptionsDropdown.AddRecipeToCollectionModal = AddRecipeToCollectionModal;
RecipeOptionsDropdown.DeleteRecipeButton = DeleteRecipeHeaderButton;
RecipeOptionsDropdown.RemoveFromCollectionButton = RemoveFromCollectionButton;
RecipeOptionsDropdown.ChangeMealDay = ChangeMealDay;
RecipeOptionsDropdown.DeleteFromPlannerButton = DeleteFromPlannerButton;
