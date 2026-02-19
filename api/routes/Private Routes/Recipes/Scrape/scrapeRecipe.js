import express from "express";
import multer from "multer";
import pako from "pako";
import { tryCatch } from "../../../../tools/error/tryCatch.js";
import getRecipe from "../../../../tools/webscraping/recipes/scraperecipe.js";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/scrape",
  upload.single("compressedHtml"),
  tryCatch(async (req, res) => {
    let html;
    const url = req.body.url;

    // Decompress HTML if file was uploaded
    if (req.file) {
      const decompressed = pako.inflate(req.file.buffer);
      html = Buffer.from(decompressed).toString("utf-8");
    }

    // Pass to getRecipe
    const recipe = await getRecipe({ url, html });
    res.json(recipe);
  }),
);

export default router;
