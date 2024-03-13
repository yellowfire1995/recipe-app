import { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import AddPricePopup from "../Components/priceaddpopup.jsx";
import { server } from "../../env/env.js";

export default function Ingredients() {
  const [search, setSearch] = useState("");
  const [price, setPrice] = useState();

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const listIngredients = await axios.post(
        `${server}/getPrice`,
        { url: search },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setPrice(listIngredients.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form>
        <input
          id="search"
          type="textbox"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        ></input>{" "}
        <button id="search" type="submit" onClick={(e) => handleSearch(e)}>
          {" "}
          Search{" "}
        </button>
      </form>

      <br />
      {price}
    </>
  );
}
