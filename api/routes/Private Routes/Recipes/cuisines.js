import express from "express";
import db from "../../../database/db.js";
import { tryCatch } from "../../../tools/error/tryCatch.js";
const router = express.Router();

router.get(
  "/",
  tryCatch(async (req, res) => {
    const data = await db.query(`
      SELECT 
  COALESCE(JSON_AGG(json_build_object('cuisine', cuisine, 'cuisine_id', id)), '[]') cuisines
  FROM cuisines
  ;    
      `);

    res.json(data.rows);
  }),
);

export default router;
