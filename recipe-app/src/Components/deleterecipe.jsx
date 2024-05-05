import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { deleteRecipe } from "../../db/queries";
import { queryClient } from "../main";
import { QueryCache, useMutation } from "@tanstack/react-query";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";

export default function DeleteButton(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const recipe = props.recipe;

  const queryCache = new QueryCache({
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onSettled: (data, error) => {
      console.log(data, error);
    },
  });

  const deleter = useMutation({
    mutationFn: () => {
      return deleteRecipe(props.recipeId, recipe);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["AllRecipes"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["MyRecipes"],
        refetchType: "all",
      });
    },
    onSettled: async () => {
      navigate(`/recipes`);
    },
  });

  return (
    <>
      <DeleteSharpIcon
        fontSize="large"
        onClick={handleShow}
        className="svg-icon"
      >
        Delete
      </DeleteSharpIcon>

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
