import express from "express";
import format from "pg-format";
import db from "../../database/db.js";
import { tryCatch } from "../../tools/error/tryCatch.js";
const router = express.Router();

router.get(
  "/",
  tryCatch(async (req, res) => {
    const data = await db.query(`
      SELECT 
  COALESCE(JSON_AGG(json_build_object('category', food_category, 'category_id', id)), '[]') categories
  FROM food_categories
  ;    
      `);

    res.json(data.rows);
  }),
);

router.get(
  "/used",
  tryCatch(async (req, res) => {
    const data = await db.query(`
      select
	coalesce(JSON_AGG(distinct jsonb_build_object('category', food_category, 'category_id', fc.id)), '[]') categories
from
	food_categories fc
	right join recipe_categories rcat on rcat.category_id = fc.id; 
      `);

    res.json(data.rows);
  }),
);

router.get(
  "/:collectionId",
  tryCatch(async (req, res) => {
    const data = await db.query({
      text: format(`
      select
	coalesce(JSON_AGG(distinct jsonb_build_object('category', food_category, 'category_id', fc.id)), '[]') categories
from
	food_categories fc
	right join recipe_categories rcat on rcat.category_id = fc.id
	join recipe_collections rcol on rcol.recipe_id = rcat.recipe_id where rcol.collection_id = $1;
		   
      `),
      values: [req.params.collectionId],
    });

    res.json(data.rows);
  }),
);

export default router;
