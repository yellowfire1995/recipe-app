import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/useAuth";

function Header() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar
      bg="dark"
      data-bs-theme="dark"
      className="justify-content-left d-flex-wrap"
    >
      <Container>
        <Navbar.Brand>myRecipe</Navbar.Brand>

        <Link to="/">Recipes</Link>

        <Link to="/ingredients">Ingredients</Link>
        <Link to="/newrecipe">New Recipe</Link>
        <Link to="/importrecipe">Import Recipe</Link>
        <Link onClick={handleLogout}> Logout</Link>
      </Container>
    </Navbar>
  );
}

export default Header;
