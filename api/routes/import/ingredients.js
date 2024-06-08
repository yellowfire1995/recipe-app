import express from "express";
const router = express.Router();
import preprocessIngredients from "../../tools/preprocessIngredients.js";
import { matchIngredients } from "../../tools/matchIngredients.js";

router.post("/ingredients", async (req, res) => {
  try {
    const formatedIngredientList = preprocessIngredients(req.body.ingredients);

    const ingredientArray = await matchIngredients(formatedIngredientList);
    res.json(ingredientArray);
  } catch (error) {
    console.error(error);
    res.json(["An error occured, please try again."]);
  }
});

export default router;
