import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { savePrice } from "../../../../db/queries";
import { queryClient } from "../../../main.jsx";
import logger from "../../../utils/logger";
import { useRecipeContext } from "../RecipeContextProvider.jsx";
import StoreButtons from "./storesearchbuttons.jsx";

export default function AddPriceModal(props) {
  const ingredient = props.ingredient;

  const {
    recipe: { recipeId },
  } = useRecipeContext();
  const [show, setShow] = useState(false);
  const [pkgGrms, setPkgGrms] = useState(ingredient.package_grams);
  const [weightChoice, setWeightChoice] = useState(1);
  const [pkgCost, setPkgCost] = useState(ingredient.package_cost);
  const [url, setUrl] = useState(ingredient.url);

  const handleClose = () => {
    setShow(false);
    setPkgGrms(ingredient.package_grams);
  };
  const handleShow = () => setShow(true);

  const { mutate: saveIngredientPrice, isPending: savePending } = useMutation({
    mutationFn: async () =>
      await savePrice(
        Math.round(pkgGrms * weightChoice),
        pkgCost,
        url,
        ingredient.fdc_id,
      ),

    onError: (error) => {
      logger.log(error);
      toast.error("Error saving price, please try again!");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [`Recipe${recipeId}`],
        refetchType: "all",
      });
      toast.success("Ingredient price saved!");
      handleClose();
    },
  });

  return (
    <>
      <AttachMoneyIcon onClick={handleShow} className="svg-icon" />
      <Modal show={show} onHide={handleClose} animation={true} size="lg">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add price for {ingredient.description.toLowerCase()}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4 />
          <form>
            <label htmlFor="grams">Package measurement:</label>
            <input
              type="number"
              value={pkgGrms}
              onChange={(e) => setPkgGrms(e.target.value)}
              id="grams"
              size="6"
            />{" "}
            <select
              id="weight"
              onChange={(e) => setWeightChoice(parseFloat(e.target.value))}
            >
              <option value="1">grams</option>
              <option value="453.592">lbs</option>
              <option value="28.3495">oz</option>
              <option
                value={1 / ingredient.userG || 1 / ingredient.gramConversion}
              >
                {ingredient.userLabel || ingredient.matchedMeasure}
              </option>
            </select>
            <br />
            <label htmlFor="cost">Package cost:</label>
            <input
              type="number"
              min="0"
              step=".01"
              size="6"
              value={pkgCost}
              onChange={(e) => setPkgCost(e.target.value)}
              id="cost"
            />
            <br />
            <div className="d-flex">
              {" "}
              <input
                placeholder="Enter url of item"
                type="textbox"
                defaultValue={url}
                onChange={(e) => setUrl(e.target.value)}
                id="url"
                style={{ width: "100%" }}
              />
            </div>
          </form>
          Search: <StoreButtons ingredient={ingredient.description} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={saveIngredientPrice}>
            {savePending ? "Saving..." : "Save"}
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
