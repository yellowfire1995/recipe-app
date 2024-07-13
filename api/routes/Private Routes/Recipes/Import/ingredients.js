import express from "express";
const router = express.Router();
import preprocessIngredients from "../../../../tools/recipe parsing/preprocessIngredients.js";
import { matchIngredients } from "../../../../tools/recipe parsing/matchIngredients.js";

router.post("/ingredients", async (req, res) => {
  try {
    const formatedIngredientList = preprocessIngredients(req.body.ingredients);

    const ingredientArray = await matchIngredients(formatedIngredientList);
    res.json(ingredientArray);
  } catch (error) {
    console.log(error);
  }
});

export default router;
