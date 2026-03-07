import CameraEnhanceIcon from "@mui/icons-material/CameraEnhance";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { AddRecipeScanPopup } from "./AddRecipeScanPopup";

export function AddRecipeScan({ ...props }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Button {...props} onClick={() => setShowPopup(true)}>
        <CameraEnhanceIcon />
      </Button>
      <AddRecipeScanPopup setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
}
