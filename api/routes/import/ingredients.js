import express from "express";
const router = express.Router();
import preprocessIngredients from "../../tools/preprocessIngredients.js";
import { matchIngredients } from "../../tools/matchIngredients.js";
import { parseIngredient } from "parse-ingredient";

router.post("/ingredients", async (req, res) => {
  try {
    const prefilteredIngredientList = preprocessIngredients(
      req.body.ingredients
    );
    console.log(prefilteredIngredientList);
    const matchedIngredientList = parseIngredient(prefilteredIngredientList);
    const ingredientArray = await matchIngredients(matchedIngredientList);
    res.json(ingredientArray);
  } catch (error) {
    console.error(error);
    res.json(["An error occured, please try again."]);
  }
});

export default router;
