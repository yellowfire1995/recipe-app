import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { savePrice } from "../../db/queries";
import StoreButtons from "./storesearchbuttons";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export default function AddPricePopup(props) {
  const i = props.ingredient;
  const [show, setShow] = useState(false);
  const [pkgGrms, setPkgGrms] = useState(i.package_grams);
  const [pkgCost, setPkgCost] = useState(i.package_cost);
  const [url, setUrl] = useState(i.url);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleSave() {
    savePrice(pkgGrms, pkgCost, url, i.fdc_id);
    handleClose();
  }

  return (
    <>
      <AttachMoneyIcon onClick={handleShow} />
      <Modal show={show} onHide={handleClose} animation={false} size="lg">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add price for {i.description.toLowerCase()}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4></h4>
          <form>
            <label htmlFor="grams">Package weight in grams:</label>
            <input
              type="number"
              value={pkgGrms}
              onChange={(e) => setPkgGrms(e.target.value)}
              id="grams"
              size="6"
            />{" "}
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
            <input
              placeholder="Enter url of item"
              type="textbox"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              id="url"
              style={{ width: "100%" }}
            />
          </form>
          Search: <StoreButtons ingredient={i.ingredient} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => handleSave()}>Save</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
