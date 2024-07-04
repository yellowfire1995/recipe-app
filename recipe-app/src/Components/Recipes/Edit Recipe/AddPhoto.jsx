import Container from "react-bootstrap/esm/Container";
import { AddPhotoContext } from "./AddPhotoContext";
import { useState } from "react";

export function AddPhoto({ image, popup, button, ...props }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <AddPhotoContext.Provider value={{ showPopup, setShowPopup }}>
      <Container
        {...props}
        onClick={() => {
          setShowPopup(!showPopup);
        }}
      >
        {image}
        {button}
        {popup}
      </Container>
    </AddPhotoContext.Provider>
  );
}
