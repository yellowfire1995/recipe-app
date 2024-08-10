import express from "express";
import { tryCatch } from "../../../../tools/error/tryCatch.js";
import { matchIngredients } from "../../../../tools/recipe parsing/matchIngredients.js";
import preprocessIngredients from "../../../../tools/recipe parsing/preprocessIngredients.js";
const router = express.Router();

router.post(
  "/ingredients",
  tryCatch(async (req, res) => {
    const formatedIngredientList = preprocessIngredients(req.body.ingredients);

    const ingredientArray = await matchIngredients(formatedIngredientList);
    res.json(ingredientArray);
  })
);

export default router;
