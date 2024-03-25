import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/esm/Container";
import { useEffect, useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import _ from "lodash";
import { ImportSelector } from "./importSelector.jsx";

export default function ImportIngredientsList(props) {
  const [ingredientList, setIngredientList] = props.ingredientList;
  const [updatedRecipe, setUpdatedRecipe] = props.updatedRecipe;

  return (
    <Container>
      <ListGroup>
        <span className="h3"> Ingredients </span>
        <InputGroup name="ingredients" className="d-flex flex-column pb-5">
          {ingredientList.map((ingredientChoices, idx) => {
            return (
              <ImportSelector
                updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
                ingredients={ingredientChoices}
                origIdx={idx}
              />
            );
          })}
        </InputGroup>
      </ListGroup>
    </Container>
  );
}
