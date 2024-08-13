import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/esm/Row";
import { AddToMealPlannerButton } from "../../Planner/AddToMealPlannerButton";
import { AddRecipeToCollectionModal } from "../Buttons/AddRecipeToCollectionModal";
import { EditRecipeButton } from "../Buttons/EditRecipeButton";
import { RemoveFromCollectionButton } from "../Buttons/RemoveFromCollectionButton";
import { DeleteRecipeButton } from "../Edit Recipe/DeleteRecipeButton";
import { RemixButton } from "../View Recipe/RemixButton";

export function RecipeOptionsDropdown({
  children,
  recipe,
  text = "",
  ...props
}) {
  const { isAuthenticated } = useAuth0();

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

        <Dropdown.Menu className="recipe-dropdown-menu px-3" align="end">
          {children.map((child, index) => {
            const childWithRecipe = React.cloneElement(child, {
              recipe: recipe,
            });

            return (
              <Row key={index}>
                {" "}
                <Dropdown.Item className=" recipe-dropdown-item d-flex py-1">
                  {}
                  {childWithRecipe}
                </Dropdown.Item>
              </Row>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

RecipeOptionsDropdown.RemixButton = RemixButton;
RecipeOptionsDropdown.AddToMealPlannerButton = AddToMealPlannerButton;
RecipeOptionsDropdown.EditRecipeButton = EditRecipeButton;
RecipeOptionsDropdown.AddRecipeToCollectionModal = AddRecipeToCollectionModal;
RecipeOptionsDropdown.DeleteRecipeButton = DeleteRecipeButton;
RecipeOptionsDropdown.RemoveFromCollectionButton = RemoveFromCollectionButton;
