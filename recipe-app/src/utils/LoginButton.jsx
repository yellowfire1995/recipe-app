import { useAuth0 } from "@auth0/auth0-react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/Card";

function LoginButton() {
  const { loginWithRedirect, loginWithPopup } = useAuth0();
  return (
    // <Card className="login-card">
    //   <Card.Body>
    //     <Card.Title>Welcome to myRecipe!</Card.Title>
    //     <Card.Text className="pt-5">
    //       {" "}
    //     </Card.Text>
    //   </Card.Body>
    // </Card>
    <div className="d-grid gap-2">
      <Button id="loginbtn" size="lg" onClick={() => loginWithPopup()}>
        Log In
      </Button>
      <br />
      <Button
        className="btn-secondary"
        size="lg"
        onClick={() =>
          loginWithPopup({ authorizationParams: { screen_hint: "signup" } })
        }
      >
        Sign up
      </Button>
    </div>
  );
}

export default LoginButton;
