import express from "express";
const router = express.Router();
import db from "../../database/db.js";

router.get("/", async (req, res) => {
  let data;
  try {
    const client = await db.connect();
    data = await db.query(`Select COUNT(cuisine), cuisine AS label,	cuisines.id 
      FROM cuisines
      JOIN recipe_cuisines ON recipe_cuisines.cuisine_id = cuisines.id
      GROUP BY cuisines.id;`);
    res.json(data.rows);
    client.release();
  } catch (error) {
    console.error(error);
  }
});

export default router;
