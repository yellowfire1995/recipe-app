import express from "express";
const router = express.Router();
import parseIngredients from "../../tools/parseIngredients.js";
import { matchIngredients } from "../../tools/matchIngredients.js";

router.post("/ingredients", async (req, res) => {
  try {
    const ingredientArray = parseIngredients(req.body.ingredients);
    res.json(await matchIngredients(ingredientArray));
  } catch (error) {
    console.error(error);
    res.json(["An error occured, please try again."]);
  }
});

export default router;
