import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { deleteRecipe } from "../../../../../db/queries";
import logger from "../../../../utils/logger";
import { useRecipeHeaderButtonsContext } from "./RecipeHeaderButtonsContext";

export function DeleteRecipeHeaderButton({
  onSettled = () => {
    return;
  },
  onSuccess = () => {},
  ...props
}) {
  const { recipe } = useRecipeHeaderButtonsContext();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { user } = useAuth0();

  const deleter = useMutation({
    mutationFn: () => {
      return deleteRecipe(recipe.recipeId, recipe);
    },
    onError: (error) => {
      logger.log(error);
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

  if (user.sub === recipe.author)
    return (
      <>
        <Button onClick={handleShow} className="btn-danger" {...props}>
          Delete Recipe
        </Button>

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
