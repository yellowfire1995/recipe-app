import imageCompression from "browser-image-compression";
import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useRecipeContext } from "../RecipeContextProvider";
import { AddPhotoPopupImage } from "./AddPhotoPopupImage";

export function AddPhotoPopup({ setShowPopup, showPopup }) {
  const { recipe, setRecipe } = useRecipeContext();
  const [photoFile, setPhotoFile] = useState(recipe.imgFile);
  const [deleteKeys, setDeleteKeys] = useState([]);

  const handleContinue = () => {
    let updates;
    if (photoFile) {
      updates = {
        imgUrl: URL.createObjectURL(photoFile),
        imgFile: photoFile,
      };

      if (recipe.imgName && !recipe.imgToDelete) {
        updates.imgToDelete = [recipe.imgName, recipe.thumbnail];
      }

      setRecipe({ ...recipe, ...updates });
    }

    if (!photoFile && deleteKeys.length > 0) {
      updates = { imgToDelete: deleteKeys, imgUrl: null, imgFile: null };
      setRecipe({ ...recipe, ...updates });
    }

    handleClose();
  };

  const handleClose = () => {
    setShowPopup(!showPopup);
    setDeleteKeys([]);
    setPhotoFile();
  };

  return (
    <Modal
      show={showPopup}
      onHide={handleClose}
      onShow={() => {
        !recipe.imgUrl &&
          !recipe.imgFile &&
          document.getElementById("photoFile").click();
      }}
      animation={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Photo</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Container>
          <AddPhotoPopupImage
            photoFile={photoFile}
            setDeleteKeys={setDeleteKeys}
            deleteKeys={deleteKeys}
            setPhotoFile={setPhotoFile}
          />

          <Form.Control
            hidden
            id="photoFile"
            onChange={async (e) => {
              const compressedImage = await imageCompression(
                e.target.files[0],
                { maxSizeMB: 3, useWebWorker: true },
              );

              setPhotoFile(compressedImage);
              if (recipe.imgName) {
                setDeleteKeys([recipe.imgName, recipe.thumbnail]);
              }
            }}
            className=""
            type="file"
            name="uploadFile"
            accept="image/*"
          />
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            document.getElementById("photoFile").click();
          }}
        >
          Import
        </Button>
        <Button
          variant="primary"
          htmlFor="photoUrl"
          type="button"
          onClick={handleContinue}
        >
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
