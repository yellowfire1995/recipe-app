import { Dropdown } from "react-bootstrap";

export function RecipeDropdownItem({ children, ...props }) {
  return (
    <Dropdown.Item className="recipe-dropdown-item d-flex py-1" {...props}>
      {children}
    </Dropdown.Item>
  );
}
