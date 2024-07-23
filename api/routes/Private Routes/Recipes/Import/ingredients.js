import express from "express";
const router = express.Router();
import preprocessIngredients from "../../../../tools/recipe parsing/preprocessIngredients.js";
import { matchIngredients } from "../../../../tools/recipe parsing/matchIngredients.js";
import { tryCatch } from "../../../../tools/error/tryCatch.js";

router.post(
  "/ingredients",
  tryCatch(async (req, res) => {
    const formatedIngredientList = preprocessIngredients(req.body.ingredients);

    const ingredientArray = await matchIngredients(formatedIngredientList);
    res.json(ingredientArray);
  })
);

export default router;
