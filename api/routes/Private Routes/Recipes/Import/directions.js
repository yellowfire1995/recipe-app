import express from "express";
const router = express.Router();
import parseDirections from "../../../../tools/recipe parsing/parseDirections.js";
import { tryCatch } from "../../../../tools/error/tryCatch.js";

router.post(
  "/directions",
  tryCatch(async (req, res) => {
    res.json(parseDirections(req.body.directions));
  })
);

export default router;
