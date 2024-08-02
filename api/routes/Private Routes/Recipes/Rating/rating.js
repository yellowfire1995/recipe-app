import express from "express";
import { tryCatch } from "../../../../tools/error/tryCatch.js";
import db from "../../../../database/db.js";
const router = express.Router();

router.post(
  "/update",
  tryCatch(async (req, res) => {
    // const query = {text:`DELETE from ratings r WHERE author = $1 and r.recipe_id = $2`, values: [req.auth.payload.sub, req.query.recipeId]}
    console.log(req.body);
    const query = {
      text: `WITH del AS (
  DELETE FROM ratings r
  WHERE author = $1 AND r.recipe_id = $2
  RETURNING *
)
INSERT INTO ratings (author, recipe_id, rating)
VALUES ($1, $2, $3)`,
      values: [req.auth.payload.sub, req.body.recipeId, req.body.userRating],
    };
    await db.query(query);
    res.send("Rating saved");
  })
);

router.post(
  "/delete",
  tryCatch(async (req, res) => {
    console.log(req.body);
    const query = {
      text: `DELETE from ratings r WHERE author = $1 and r.recipe_id = $2`,
      values: [req.auth.payload.sub, req.body.recipeId],
    };

    await db.query(query);
    res.send("Rating deleted");
  })
);

export default router;
