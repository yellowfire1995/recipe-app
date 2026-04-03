import { Edit } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { editCollection } from "../../../db/queries";
import { queryClient } from "../../main";

export function EditCollectionIcon(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const collection = props.collection;

  const edit = useMutation({
    mutationFn: () => {
      return editCollection({
        collection: {
          ...collection,
          name: document.getElementById("edit-name").value,
        },
      });
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

  return (
    <>
      <Edit
        fontSize="large"
        className="my-auto icon-interactive"
        onClick={handleShow}
      />

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Collection Name </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup size="lg" className="mb-3">
            <Form.Control
              id="edit-name"
              aria-label="edit-name"
              aria-describedby="edit-name"
              defaultValue={collection.name}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={edit.mutate}>
            {edit.isPending ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
