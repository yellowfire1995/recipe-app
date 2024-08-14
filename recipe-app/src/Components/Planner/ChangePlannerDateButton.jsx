import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { changeMealDay } from "../../../db/queries";
import { queryClient } from "../../main";
import { useRecipeHeaderButtonsContext } from "../Recipes/Recipe Header/Buttons/RecipeHeaderButtonsContext";

export default function ChangeMealDay() {
  const { recipe } = useRecipeHeaderButtonsContext();
  const { planId, planDate } = recipe;

  const [date, setDate] = useState(new Date(planDate));
  const [show, setShow] = useState(false);
  const { mutate, isError, isPending, reset } = useMutation({
    mutationFn: () => changeMealDay(planId, date.toLocaleDateString()),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["MealPlan"],
        refetchType: "all",
      });
      handleClose();
    },
  });

  const handleClose = () => {
    setDate(new Date(planDate));
    setShow(false);
    reset();
  };
  const handleShow = () => setShow(true);

  function handleSave() {
    if (date) {
      mutate();
    } else {
      toast.error("Please choose a date.");
    }
  }

  return (
    <>
      <Button className="" onClick={handleShow}>
        Change Date
      </Button>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Date
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
