import { useAuth0 } from "@auth0/auth0-react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export function FrontPageHero() {
  const { isAuthenticated, loginWithPopup, user } = useAuth0();

  return (
    <Container fluid className="front-page align-items-center d-flex p-0 m-0">
      {/* <div className="photo-credit">
        Photo by{" "}
        <a href="https://unsplash.com/@organicdesignco?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
          Megan Thomas
        </a>{" "}
        on{" "}
        <a href="https://unsplash.com/photos/bundle-of-assorted-vegetable-lot-xMh_ww8HN_Q?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
          Unsplash
        </a>
      </div> */}
      <Row className=" w-100 m-0 p-0 ">
        <Col md="auto" className="text-box">
          <Row className="front-page-hero">
            <h1 className="">
              Welcome
              {isAuthenticated
                ? `, ${user.givenName || user.nickname || user.sub}!`
                : "!"}
            </h1>
          </Row>
          <Row className="front-page-hero">
            <p className="align-self-end flex-grow-1">
              {isAuthenticated ? (
                <>
                  Would you like to <Link to={`/newrecipe`}> add a recipe</Link>
                  ?
                </>
              ) : (
                <>
                  <Button onClick={loginWithPopup}>Login</Button> or{" "}
                  <Button
                    className="text-nowrap "
                    onClick={() =>
                      loginWithPopup({
                        authorizationParams: { screen_hint: "signup" },
                      })
                    }
                  >
                    Sign up
                  </Button>{" "}
                  for additional functionality! <br />
                  You can explore existing recipes{" "}
                  <Link to={`/recipes`}>here</Link>.
                </>
              )}
            </p>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
