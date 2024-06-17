import Col from "react-bootstrap/esm/Col.js";
import Row from "react-bootstrap/esm/Row";
import Container from "react-bootstrap/esm/Container";
import { Helmet } from "react-helmet";
import Button from "react-bootstrap/esm/Button";
import { useState } from "react";

export default function Planner() {
  const oneDay = 1000 * 60 * 60 * 24;
  const oneWeek = oneDay * 7;
  const [weeksAhead, setWeeksAhead] = useState(0);

  const daysIntoWeek = new Date().getDay();
  const now = Date.now() + oneWeek * weeksAhead - daysIntoWeek;
  const startDate = new Date(now);
  const endDate = new Date(now + oneWeek - oneDay);

  const dateArray = [];
  let i = 0;
  while (i < 7) {
    dateArray.push(now + oneDay * i);
    i++;
  }

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
                <h3 key={date}>
                  {new Date(date).toLocaleDateString(undefined, {
                    weekday: "long",
                    day: "numeric",
                    month: "numeric",
                  })}
                </h3>
              );
            })}
          </Col>
        </Row>
      </Container>
    </>
  );
}
