import Container from "react-bootstrap/esm/Container";
import Slider from "@ant-design/react-slick";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => navigate("/recipes"), [navigate]);
}
