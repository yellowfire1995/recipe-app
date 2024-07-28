import { useAuth0 } from "@auth0/auth0-react";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/esm/Row";

export function RecipeHeaderButtons({ children }) {
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <></>;
  }

  // return <div className="d-flex gap-1">{children}</div>;
  return (
    <>
      <Dropdown>
        <Dropdown.Toggle
          id="options-dropdown"
          className="svg-icon"
          as="h2"
        ></Dropdown.Toggle>

        <Dropdown.Menu className="recipe-dropdown-menu px-3">
          {children.map((child, index) => {
            return (
              <Row key={index}>
                {" "}
                <Dropdown.Item className=" recipe-dropdown-item d-flex">
                  {child}
                </Dropdown.Item>
              </Row>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
