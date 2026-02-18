import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/esm/Col";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "use-local-storage";
import LoginButton from "../utils/LoginButton";

export default function Login() {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    isAuthenticated ? navigate("/recipes") : null;
  }, [isAuthenticated]);

  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light",
  );
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  return (
    <>
      <title>CookbookCalc | Login</title>

      <Row className="align-items-center vh-100 justify-content-center mx-2">
        <Col
          className="d-flex text-center login p-4 align-items-center"
          style={{ height: "20rem" }}
        >
          <Row className="w-100">
            <Col className="d-flex flex-wrap align-items-center justify-content-center">
              <img src="./calculator.svg" style={{ height: "9rem" }} />

              <img src="./logo.svg" className="" style={{ height: "2rem" }} />
            </Col>
            <Col className="my-auto">
              <LoginButton />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
