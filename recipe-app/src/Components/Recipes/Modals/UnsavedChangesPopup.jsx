import { useBeforeUnload } from "react-router-dom";
import { useRecipeContext } from "../RecipeContextProvider";
import isEqual from "lodash/isEqual";

export function UnsavedChangesPopup({ loadedRecipe }) {
  // const handleClose = () => {
  //   setShowPopup(!showPopup);
  // };
  // const [showPopup, setShowPopup] = useState(true);
  const { recipe } = useRecipeContext();

  const newRecipe = {
    name: "",
    imgUrl: null,
    servings: 1,
    cuisine: [],
    ingredients: [],
    directions: [],
    category: [],
    public: true,
  };
  const originalRecipe = (loadedRecipe && loadedRecipe[0]) || newRecipe;
  const isDirty = !isEqual(originalRecipe, recipe);

  // const blocker = useBlocker(useCallback(() => dirty, [dirty]));

  useBeforeUnload((event) => {
    if (isDirty) {
      event.preventDefault();
    }
  });

  // return (
  //   <Modal show={showPopup} onHide={handleClose} animation={false} size="lg">
  //     <Modal.Header closeButton>
  //       <Modal.Title>Unsaved Changes</Modal.Title>
  //     </Modal.Header>

  //     <Modal.Body>You have unsaved changes, do you wish to leave?</Modal.Body>
  //     <Modal.Footer>
  //       <Button variant="secondary" onClick={() => blocker.proceed()}>
  //         Leave Page
  //       </Button>
  //       <Button
  //         onClick={() => {
  //           blocker.reset();
  //           handleClose();
  //         }}
  //       >
  //         Stay on page
  //       </Button>
  //     </Modal.Footer>
  //   </Modal>
  // );
}
