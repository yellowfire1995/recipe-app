import { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import AddPricePopup from "../Components/priceaddpopup.jsx";

export default function Ingredients() {
  const [search, setSearch] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [activeModal, setActiveModal] = useState();


  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const listIngredients = await axios.post(
        `http://192.168.68.74:3000/ingredients/search`,
        { ingredient: search },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setIngredients(listIngredients.data);

      console.log(listIngredients.data);
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

      <ol>
        {ingredients.length > 0
          ? ingredients.map((ingredient) => {
              return (
                <div key={ingredient.fdc_id}>
                  <li>
                    <form>
                      {`${ingredient.description} - ${Math.round(
                        1 / ingredient.gram_amt
                      )}g per ${ingredient.gram_label}`}
                      <Button
                        type="button"
                        onClick={() => setActiveModal(ingredient.fdc_id)}
                      >
                        {" "}
                        Add price{" "}
                      </Button>{" "}
                      <br />
                      {`${ingredient.fdc_id} - ${ingredient.package_grams}g - ${ingredient.package_cost}`}
                    </form>
                  </li>
                  <AddPricePopup
                    show={activeModal == ingredient.fdc_id ? true : false}
                    onHide={() => setActiveModal()}
                    ingredient={ingredient}
                  />
                </div>
              );
            })
          : "No Results"}
      </ol>
    </>
  );
}
