import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
  addRecipeToCollection,
  getCollectionNames,
} from "../../../../db/queries";
import Loading from "../../Loading";

export function AddRecipeToCollectionModal({ recipe: { recipeId } }) {
  const collections = useQuery({
    queryKey: ["CollectionNames"],
    queryFn: () => getCollectionNames(),
  });

  const addCollection = useMutation({
    mutationFn: () => addRecipeToCollection(recipeId, activeCollection[0]),
    onSuccess: () => setTimeout(handleClose, 1000),
  });

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setActiveCollection();
    addCollection.reset();
  };
  const handleShow = () => setShow(true);
  const [activeCollection, setActiveCollection] = useState([]);

  function handleSave() {
    if (activeCollection.length > 0) {
      addCollection.mutate(recipeId, activeCollection[0]);

      // handleClose();
    } else {
      alert("Please choose a collection.");
    }
  }

  return (
    <>
      <Button onClick={handleShow}>Add to collection</Button>
      <Modal show={show} onHide={handleClose} animation={false} size="lg">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add recipe to collection
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Typeahead
            id="collections"
            allowNew={true}
            options={collections.isLoading ? <Loading /> : collections.data}
            labelKey="name"
            placeholder="Type a collection name..."
            onChange={(selected) => setActiveCollection(selected)}
          />
        </Modal.Body>
        <Modal.Footer>
          <div style={{ color: "green" }}>
            {addCollection.isSuccess ? "Saved!" : ""}
          </div>
          <Button onClick={() => handleSave()}>
            {addCollection.status != "idle" ? "Saving..." : "Save"}
          </Button>
          <Button onClick={handleClose}>Cancel</Button>{" "}
        </Modal.Footer>
      </Modal>
    </>
  );
}
