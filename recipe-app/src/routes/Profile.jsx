import { useAuth0 } from "@auth0/auth0-react";
import { Container } from "@mui/material";
import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import httpClient from "../../db/axiosConfig";
import { server } from "../../env/env";
import LogoutButton from "../utils/LogoutButton";
import logger from "../utils/logger";

export default function Profile() {
  async function handleClick() {
    try {
      await httpClient.patch(`${server}/profile`, {
        nickname: nickname,
      });
    } catch (error) {
      logger.log(error);
    }
  }

  const { user } = useAuth0();
  const [nickname, setNickname] = useState(user.nickname);

  return (
    <>
      {" "}
      <title>CookbookCalc | Settings</title>
      <Container
        style={{ width: "100%" }}
        className="border shadow text-center"
      >
        <Row>
          <Col>
            <h2>Profile Page</h2>
            Display Name:{" "}
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <Button onClick={async () => await handleClick()}> Save</Button>{" "}
            <br />
            <LogoutButton />
          </Col>
        </Row>
      </Container>
    </>
  );
}
