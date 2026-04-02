import { DeleteForever } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { deleteCollection } from "../../../db/queries";
import { queryClient } from "../../main";

export default function DeleteCollectionModal(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const collection = props.collection;

  const deleter = useMutation({
    mutationFn: () => {
      return deleteCollection(collection);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["Collections"],
        refetchType: "all",
      });
    },
    onSettled: async () => {
      navigate(`/collections`);
    },
  });

  return (
    <>
      <DeleteForever
        fontSize="large"
        className="my-auto icon-interactive"
        onClick={handleShow}
      />

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Edit {collection.name} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the collection {collection.name}?
        </Modal.Body>
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
