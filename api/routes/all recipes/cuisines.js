import express from "express";
const router = express.Router();
import db from "../../database/db.js";

router.get("/", async (req, res) => {
  let data;
  try {
    const client = await db.connect();
    data = await db.query(`
      SELECT 
  COALESCE(JSON_AGG(json_build_object('cuisine', cuisine, 'cuisine_id', id)), '[]') cuisines
  FROM cuisines
  ;    
      `);
    client.release();
    res.json(data.rows);
  } catch (error) {
    console.error(error);
  }
});

export default router;
