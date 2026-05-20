import { useAuth0 } from "@auth0/auth0-react";
import { AddCircleOutlineRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export function FloatingActionButton() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const handleClick = () => {
    if (isAuthenticated) {
      navigate("/newrecipe");
    } else {
      // loginWithRedirect({ appState: { returnTo: "/newrecipe" } });
      loginWithRedirect({
        authorizationParams: {
          redirect_uri: `${window.location.origin}/newrecipe`,
        },
      });
    }
  };

  return (
    <button
      className="fab d-xl-none "
      onClick={handleClick}
      aria-label="Add recipe"
    >
      <AddCircleOutlineRounded fontSize="inherit" />
      <span className="fab__label">Add Recipe</span>
    </button>
  );
}
