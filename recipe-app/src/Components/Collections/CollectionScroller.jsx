import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col.js";
import RecipeCardData from "../Recipes/View Recipe/RecipeCard.jsx";

export default function CollectionScroller(props) {
  const collection = props.collection;
  let [activeSlide, setActiveSlide] = useState(1);

  function pageForward() {
    setActiveSlide(activeSlide > collection.recipes.length ? 2 : ++activeSlide);
    document
      .querySelector(`#slide-${collection.id}-${activeSlide}`)
      .scrollIntoView();
  }

  return (
    <>
      <Col xs="auto" className="align-content-center">
        <Button
          onClick={() => {
            setActiveSlide(activeSlide < 2 ? 2 : --activeSlide);
            document
              .querySelector(`#slide-${collection.id}-${activeSlide}`)
              .scrollIntoView();
          }}
        >
          {"<"}
        </Button>
      </Col>
      <Col className="d-flex scrollbar p-2">
        <RecipeCardData cards={collection.recipes} collection={collection} />
      </Col>
      <Col xs="auto" className="align-content-center">
        <Button onClick={pageForward}>{">"}</Button>
      </Col>
    </>
  );
}
