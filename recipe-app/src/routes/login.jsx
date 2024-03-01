import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

export default function Login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit() {
    try {
      const response = await axios.post(
        "http://192.168.68.74:3000/login/password",
        {
          username: username,
          password: password,
        },
        { "content-type": "application/x-www-form-urlencoded" }
      );
      console.log(response);
      response.status == 200 ? await login({ username }) : null;
    } catch (error) {
      console.error(error.message);
      error.response.status == 401
        ? setErrorMessage("Username and password not found, please try again")
        : setErrorMessage("Please try again");
    }
  }

  return (
    <>
      <Row className="px-auto text-align-center align-center">
        <Container className="pt-auto text-align-center align-center ">
          <h1>Login</h1>
          <p color="red">{errorMessage}</p>
          <section>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </section>
          <section>
            <label htmlFor="new-password">Password</label>
            <input
              id="new-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </section>
          <button type="button" onClick={handleSubmit}>
            Login
          </button>
          <button type="button" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </Container>
      </Row>
    </>
  );
}
