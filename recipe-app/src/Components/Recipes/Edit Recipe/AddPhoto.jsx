import Container from "react-bootstrap/esm/Container";
import { useState } from "react";
import { AddPhotoButton } from "./AddPhotoButton";
import { AddPhotoImage } from "./AddPhotoImage";
import { AddPhotoPopup } from "./AddPhotoPopup";

export function AddPhoto({ ...props }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      {" "}
      <Container
        {...props}
        onClick={() => {
          setShowPopup(true);
        }}
      >
        <AddPhotoImage />
        <AddPhotoButton />
      </Container>
      <AddPhotoPopup setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
}
