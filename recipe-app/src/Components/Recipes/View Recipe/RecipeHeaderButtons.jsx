import { useAuth0 } from "@auth0/auth0-react";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/esm/Row";

import React from "react";
import { RemixButton } from "./RemixButton";
import { AddToMealPlannerButton } from "../../Planner/AddToMealPlannerButton";
import { EditRecipeButton } from "./EditRecipeButton";
import { DeleteRecipeIcon } from "../Edit Recipe/DeleteRecipeButton";
import { AddRecipeToCollectionModal } from "../../Collections/AddRecipeToCollectionModal";

export function RecipeOptionsDropdown({ children, recipe, text = "" }) {
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <></>;
  }

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle
          id="options-dropdown"
          className="svg-icon me-1"
          as="h4"
        >
          {text}
        </Dropdown.Toggle>

        <Dropdown.Menu className="recipe-dropdown-menu px-3">
          {children.map((child, index) => {
            const childWithRecipe = React.cloneElement(child, {
              recipe: recipe,
            });

            return (
              <Row key={index}>
                {" "}
                <Dropdown.Item className=" recipe-dropdown-item d-flex">
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
RecipeOptionsDropdown.DeleteRecipeIcon = DeleteRecipeIcon;
