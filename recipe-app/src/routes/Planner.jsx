import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col.js";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { getMealPlan } from "../../db/queries";
import Loading from "../Components/Loading.jsx";
import PlannerDayList from "../Components/Planner/PlannerList.jsx";

export default function Planner() {
  const oneDay = 1000 * 60 * 60 * 24;
  const oneWeek = oneDay * 7;
  const daysIntoWeek = new Date().getDay();
  const [weeksAhead, setWeeksAhead] = useState(0);

  // eslint-disable-next-line react-hooks/purity
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
      <title>CookbookCalc | Planner</title>

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
            {mealPlan.isLoading ? (
              <Loading />
            ) : (
              dateArray.map((date) => {
                return (
                  <div key={date}>
                    <PlannerDayList date={date} mealPlan={mealPlan} />
                  </div>
                );
              })
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
