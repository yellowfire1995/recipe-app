import express from "express";
import db from "../../database/db.js";
import { tryCatch } from "../../tools/error/tryCatch.js";
const router = express.Router();

router.get(
  "/",
  tryCatch(async (req, res) => {
    const query = {
      text: `select c.id, name  from collections c 
where c.public = true

`,
    };
    const data = await db.query(query);
    res.send(data.rows);
  }),
);

export default router;
