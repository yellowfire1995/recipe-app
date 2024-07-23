import express from "express";
const router = express.Router();
import getPrice from "../../../../tools/webscraping/scrapeprice.js";
import { tryCatch } from "../../../../tools/error/tryCatch.js";

router.post(
  "/",
  tryCatch(async (req, res) => {
    const price = await getPrice(req.body.url);
    res.json(price);
  })
);

export default router;
