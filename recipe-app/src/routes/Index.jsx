import { Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { FrontPageHero } from "../Components/FrontPage/Hero";
import { RecipeCarousel } from "../Components/FrontPage/RecipeCarousel";

export default function Index() {
  return (
    <>
      <Helmet>
        <title>CookbookCalc</title>
      </Helmet>

      <FrontPageHero />

      {/* <Container fluid="lg" className="front-page-container p-1 mt-1">
        <RecipeCarousel />
        <Row className="">
          <Col className="p-0 m-1"></Col>
        </Row>
        <Row className="mt-4">
          <Col className="m-1 text-box">
            <h2>Welcome to CookbookCalc!</h2>
            <p>
              Thank you for visiting the website. Unlock the full potential of
              your recipes with CookbookCalc, your ultimate kitchen companion.
              Get instant access to nutrition information and precise weight
              measurements for a more informed and effortless cooking
              experience.
            </p>
          </Col>
        </Row>
      </Container> */}
    </>
  );
}
