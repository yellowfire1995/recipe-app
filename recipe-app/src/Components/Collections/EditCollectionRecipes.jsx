import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { deleteCollectionRecipe } from "../../../db/queries";
import { queryClient } from "../../main";

export default function EditCollectionRecipes(props) {
  const params = props.params;
  const collection = props.collection;
  const [itemsToRemove, setItemsToRemove] = useState([]);

  const deleter = useMutation({
    mutationFn: () => {
      return deleteCollectionRecipe(itemsToRemove);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["Collections"],
        refetchType: "all",
      });
      handleClose();
    },
    onSettled: async () => {
      navigate(`/collections`);
    },
  });

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setItemsToRemove([]);
    deleter.reset();
  };
  const handleShow = () => setShow(true);

  return (
    <>
      <Button onClick={handleShow}>Remove Recipe</Button>
      <Modal show={show} onHide={handleClose} animation={false} size="lg">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Remove recipe(s) from collection
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Typeahead
            multiple="true"
            id="collections"
            options={collection.recipes}
            labelKey="name"
            placeholder="Please choose an existing collection or type a new collection name..."
            onChange={(selected) => setItemsToRemove(selected)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={deleter.mutate}>
            {deleter.status != "idle" ? "Saving..." : "Save"}
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
