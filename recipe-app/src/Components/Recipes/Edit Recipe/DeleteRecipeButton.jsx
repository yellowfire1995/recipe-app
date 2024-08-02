import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { deleteRecipe } from "../../../../db/queries";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function DeleteRecipeIcon({
  recipe,
  onSettled = () => {
    return recipe;
  },
  onSuccess = () => {},
}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const deleter = useMutation({
    mutationFn: () => {
      return deleteRecipe(recipe.recipeId, recipe);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error deleting recipe, please try again.");
    },
    onSuccess: () => {
      onSuccess();
    },
    onSettled: () => {
      onSettled();
      handleClose();
    },
  });

  return (
    <>
      <Button onClick={handleShow}>Delete Recipe</Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Delete recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this recipe?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleter.mutate}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
