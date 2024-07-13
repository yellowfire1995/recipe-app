import { useAuth0 } from "@auth0/auth0-react";
import Button from "react-bootstrap/esm/Button";

export function RecipeHeaderButtons({ children }) {
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <></>;
  }

  return <div className="d-flex gap-1">{children}</div>;
  // return (
  //   <>
  //     <div className="recipe-dropdown">
  //       <Button>+</Button>

  //       <div className="recipe-dropdown-content">{children}</div>
  //     </div>
  //   </>
  // );
}
