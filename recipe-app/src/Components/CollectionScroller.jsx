import RecipeCards from "../Components/RecipeCards";
import Sidebar from "../Components/Sidebar";
import { getCollectionRecipes } from "../../db/queries";
import Col from "react-bootstrap/esm/Col.js";
import Row from "react-bootstrap/esm/Row";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import { useQuery } from "@tanstack/react-query";
import RecipeCardData from "../Components/RecipeCard";
import Loading from "../Components/Loading";
import DeleteCollectionModal from "../Components/DeleteCollectionModal";
import { useState } from "react";

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
