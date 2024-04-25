import Container from "react-bootstrap/esm/Container";
import Slider from "@ant-design/react-slick";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

export default function Index() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
  };
  return (
    <>
      <Container md fluid="lg" className="mt-4">
        <h2>Planner</h2>
      </Container>
    </>
  );
}
