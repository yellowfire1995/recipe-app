import { Carousel, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export function RecipeCarousel() {
  return (
    <Row className="mt-2 mx-0">
      <Col className="text-box">
        <h2>Featured Recipes</h2>
        <Carousel className="frontPage" touch indicators={false}>
          <Carousel.Item>
            <Link to="recipes/335" style={{ display: "contents" }}>
              <img
                className="carousel-image"
                src="https://d30b48eq3arkah.cloudfront.net/7c0c457b-fb52-4b70-a954-fe764388505b"
              />
              <Carousel.Caption>
                <h3>Chocolate Crinkles</h3>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
          <Carousel.Item>
            <Link to="recipes/127" style={{ display: "contents" }}>
              <img
                className="carousel-image"
                src="https://d30b48eq3arkah.cloudfront.net/9ad8cfad-3545-47f9-b010-cc86cf3da86b"
              />
              <Carousel.Caption>
                <h3>New York Pizza Dough</h3>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
          <Carousel.Item>
            <Link to="recipes/329" style={{ display: "contents" }}>
              <img
                className="carousel-image"
                src="https://d30b48eq3arkah.cloudfront.net/8871f12d-d027-4b04-a5cf-b5d6fada0e00"
              />
              <Carousel.Caption>
                <h3>Pita</h3>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        </Carousel>
      </Col>
    </Row>
  );
}
