import express from "express";
const router = express.Router();
import db from "../../../database/db.js";
import { tryCatch } from "../../../tools/error/tryCatch.js";

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
  })
);

export default router;
