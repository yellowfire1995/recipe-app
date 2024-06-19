import Col from "react-bootstrap/esm/Col.js";
import Row from "react-bootstrap/esm/Row";
import Container from "react-bootstrap/esm/Container";
import { Helmet } from "react-helmet-async";
import Button from "react-bootstrap/esm/Button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMealPlan } from "../../db/queries";
import PlannerDayList from "../Components/Planner/PlannerScroller";

export default function Planner() {
  const oneDay = 1000 * 60 * 60 * 24;
  const oneWeek = oneDay * 7;
  const daysIntoWeek = new Date().getDay();
  const [weeksAhead, setWeeksAhead] = useState(0);

  const now = Date.now() + oneWeek * weeksAhead - daysIntoWeek * oneDay;
  const startDate = new Date(now);
  const endDate = new Date(now + oneWeek - oneDay);

  const dateArray = [];
  let i = 0;
  while (i < 7) {
    dateArray.push(now + oneDay * i);
    i++;
  }

  const mealPlan = useQuery({
    queryKey: [`MealPlan`],
    queryFn: () => getMealPlan(),
  });

  return (
    <>
      <Helmet>
        <title>CookbookCalc | Planner</title>
      </Helmet>
      <Container className="mt-3">
        <Row>
          <Col className="justify-content-center d-flex">
            <Button
              onClick={() => {
                setWeeksAhead(weeksAhead - 1);
              }}
            >
              Prev
            </Button>
            <h2>
              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </h2>
            <Button
              onClick={() => {
                setWeeksAhead(weeksAhead + 1);
              }}
            >
              Next
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="justify-content-center">
            {dateArray.map((date) => {
              return (
                <div key={date}>
                  {mealPlan.isLoading ? (
                    ""
                  ) : (
                    <PlannerDayList date={date} mealPlan={mealPlan} />
                  )}
                </div>
              );
            })}
          </Col>
        </Row>
      </Container>
    </>
  );
}
