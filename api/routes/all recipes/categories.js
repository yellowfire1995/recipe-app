import express from "express";
const router = express.Router();
import db from "../../database/db.js";

router.get("/", async (req, res) => {
  let data;
  try {
    data = await db.query(`
      SELECT 
  COALESCE(JSON_AGG(json_build_object('category', food_category, 'category_id', id)), '[]') categories
  FROM food_categories
  ;    
      `);

    res.json(data.rows);
  } catch (error) {
    console.error(error);
  }
});

export default router;
