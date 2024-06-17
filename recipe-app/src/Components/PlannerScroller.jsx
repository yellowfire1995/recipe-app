import Col from "react-bootstrap/esm/Col.js";
import Button from "react-bootstrap/esm/Button";
import RecipeCardData from "../Components/RecipeCard";
import { useState } from "react";

export default function PlannerScroller(props) {
  const dailyPlan = props.dailyPlan;
  let [activeSlide, setActiveSlide] = useState(1);

  function pageForward() {
    setActiveSlide(activeSlide > dailyPlan.recipes.length ? 2 : ++activeSlide);
    document
      .querySelector(`#slide-${dailyPlan.id}-${activeSlide}`)
      .scrollIntoView();
  }

  return (
    <>
      <Col xs="auto" className="align-content-center">
        <Button
          onClick={() => {
            setActiveSlide(activeSlide < 2 ? 2 : --activeSlide);
            document
              .querySelector(`#slide-${dailyPlan.id}-${activeSlide}`)
              .scrollIntoView();
          }}
        >
          {"<"}
        </Button>
      </Col>
      <Col className="d-flex scrollbar p-2">
        <RecipeCardData cards={dailyPlan.recipes} collection={dailyPlan} />
      </Col>
      <Col xs="auto" className="align-content-center">
        <Button onClick={pageForward}>{">"}</Button>
      </Col>
    </>
  );
}
