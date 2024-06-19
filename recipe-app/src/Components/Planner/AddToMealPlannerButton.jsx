import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { addToMeallPlan } from "../../../db/queries";

export default function AddToMealPlannerButton(props) {
  const recipeId = props.params.recipeId;
  const [show, setShow] = useState(false);
  const addToPlanner = useMutation({
    mutationFn: () =>
      addToMeallPlan(recipeId, document.getElementById("date").value),
    onSuccess: () => setTimeout(handleClose, 1000),
  });

  const handleClose = () => {
    setShow(false);
    addToPlanner.reset();
  };
  const handleShow = () => setShow(true);

  function handleSave() {
    if (document.getElementById("date").value) {
      addToPlanner.mutate(recipeId, document.getElementById("date").value);
    } else {
      alert("Please choose a date.");
    }
  }

  return (
    <>
      <Button className="p-1 mx-2" onClick={handleShow}>
        Add to planner
      </Button>
      <Modal show={show} onHide={handleClose} animation={false} size="lg">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add recipe to meal plan
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input id="date" type="date" />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSave}>Add</Button>
          <Button onClick={handleClose}>Cancel</Button>{" "}
        </Modal.Footer>
      </Modal>
    </>
  );
}
