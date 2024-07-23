import express from "express";
import getRecipe from "../../../../tools/webscraping/scraperecipe.js";
import { tryCatch } from "../../../../tools/error/tryCatch.js";
const router = express.Router();

router.post(
  "/scrape",
  tryCatch(async (req, res) => {
    const recipe = await getRecipe(req.body.url);

    res.json(recipe);
  })
);

export default router;
