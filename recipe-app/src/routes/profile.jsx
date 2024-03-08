import { Container } from "@mui/material";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import httpClient from "../../db/axiosConfig";
import { Button } from "bootstrap";
import LogoutButton from "../utils/LogoutButton";

async function handleClick(userData) {
  try {
    let response = await httpClient.patch(
      "http://192.168.68.74:3000/profile",
      userData
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState();

  useEffect(() => {
    (async () => {
      try {
        let response = await httpClient.get(
          `https://dev-8oxkv6xzy7mdml3z.us.auth0.com/api/v2/users/${user.sub}`
        );
        setUserData(response.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [getAccessTokenSilently]);

  return (
    <Container style={{ width: "100%" }} className="border shadow text-center">
      <Row>
        <Col>
          <h2>Profile Page</h2>
          Display Name:{" "}
          <input
            type="text"
            value={userData?.nickname}
            onChange={(e) =>
              setUserData({ ...userData, nickname: e.target.value })
            }
          />
          <br />
          Profile Pic:{" "}
          <img
            src={userData?.picture}
            style={{ height: "50px", width: "50px" }}
          />{" "}
          <br />
          <button
            onClick={async () => console.log(await handleClick(userData))}
          >
            {" "}
            Save
          </button>{" "}
          <br />
          <LogoutButton />
        </Col>
      </Row>
    </Container>
  );
}
