import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { addToMeallPlan } from "../../../db/queries";
import { useRecipeHeaderButtonsContext } from "../Recipes/Recipe Header/Buttons/RecipeHeaderButtonsContext";

export function AddToMealPlannerButton() {
  const { recipe } = useRecipeHeaderButtonsContext();
  const { recipeId, name } = recipe;
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const { mutate, reset, isError, isPending } = useMutation({
    mutationFn: () => addToMeallPlan(recipeId, date.toLocaleDateString()),
    onSuccess: () => {
      toast.success(
        `${name} added to planner on ${date.toLocaleDateString()}!`
      );
      handleClose();
    },
  });

  const handleClose = () => {
    setDate(new Date());
    setShow(false);
    reset();
  };
  const handleShow = () => setShow(true);

  function handleSave() {
    if (date) {
      console.log("saving...");
      mutate();
    } else {
      console.log("save rejected");
      return;
    }
  }

  return (
    <>
      <Button onClick={handleShow}>Add to planner</Button>
      <Modal show={show} onHide={handleClose} animation={false} size="lg">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add recipe to meal plan
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex align-items-center">
          <DatePicker selected={date} onChange={(date) => setDate(date)} />{" "}
          {isError ? (
            <div className="text-danger">
              Error saving to planner, please try again later.
            </div>
          ) : (
            ""
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSave}>
            {isPending ? "Saving..." : "Save"}
          </Button>
          <Button onClick={handleClose}>Cancel</Button>{" "}
        </Modal.Footer>
      </Modal>
    </>
  );
}
