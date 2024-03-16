import express from "express";
const router = express.Router();
import parseIngredients from "../../tools/parseIngredients.js";
import { matchIngredients } from "../../tools/matchIngredients.js";
import { parseIngredient } from "parse-ingredient";

router.post("/ingredients", async (req, res) => {
  try {
    const matchedIngredientList = parseIngredient(req.body.ingredients);
    const ingredientArray = await matchIngredients(matchedIngredientList);
    res.json(ingredientArray);
  } catch (error) {
    console.error(error);
    res.json(["An error occured, please try again."]);
  }
});

export default router;
