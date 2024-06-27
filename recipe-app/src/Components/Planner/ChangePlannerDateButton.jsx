import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { changeMealDay } from "../../../db/queries";
import { queryClient } from "../../main";

export default function ChangeMealDay(props) {
  const planId = props.planId;
  const date = props.date;
  const dateObject = props.dateObject;
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  console.log(new Date(dateObject).toLocaleDateString("en-CA"));
  const [show, setShow] = useState(false);
  const changeMealDate = useMutation({
    mutationFn: () =>
      changeMealDay(planId, document.getElementById("date").value),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["MealPlan"],
        refetchType: "all",
      });
    },
  });

  const handleClose = () => {
    setShow(false);
    changeMealDate.reset();
  };
  const handleShow = () => setShow(true);

  function handleSave() {
    if (document.getElementById("date").value) {
      console.log(planId);

      changeMealDate.mutate(planId, document.getElementById("date").value);
    } else {
      alert("Please choose a date.");
    }
  }

  return (
    <>
      <Button className="p-1 mx-2" size="sm" onClick={handleShow}>
        Change Date
      </Button>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Recipe Date
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            id="date"
            type="date"
            defaultValue={new Date(dateObject).toLocaleDateString("en-CA")}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSave}>
            {changeMealDate.isPending ? "Saving..." : "Save"}
          </Button>
          <Button onClick={handleClose}>Cancel</Button>{" "}
        </Modal.Footer>
      </Modal>
    </>
  );
}
