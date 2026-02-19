import axios from "axios";
import { useState } from "react";
import { server } from "../../env/env.js";
import logger from "../utils/logger.js";

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
        },
      );
      setPrice(listIngredients.data);
    } catch (error) {
      logger.error(error);
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
        />{" "}
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
