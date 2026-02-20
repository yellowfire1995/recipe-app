import express from "express";
import multer from "multer";
import pako from "pako";
import { tryCatch } from "../../../../tools/error/tryCatch.js";
import {
  getRecipe,
  validateRecipeUrl,
} from "../../../../tools/webscraping/recipes/scraperecipe.js";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/scrape",
  upload.single("compressedHtml"),
  tryCatch(async (req, res) => {
    let html;
    const rawUrl = req.body.url;

    if (rawUrl !== undefined && typeof rawUrl !== "string") {
      return res.status(400).json({ error: "Invalid URL." });
    }

    let url = rawUrl;
    if (typeof rawUrl === "string") {
      try {
        url = validateRecipeUrl(rawUrl);
      } catch (e) {
        return res.status(400).json({ error: e.message || "Invalid URL." });
      }
    }

    if (req.file) {
      const decompressed = pako.inflate(req.file.buffer);
      html = Buffer.from(decompressed).toString("utf-8");
    }

    const recipe = await getRecipe({ url, html });
    res.json(recipe);
  }),
);

export default router;
