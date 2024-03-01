import express from "express";
const router = express.Router();
import parseDirections from "../../tools/parseDirections.js";

router.post("/directions", async (req, res) => {
  try {
    res.json(parseDirections(req.body.directions));
  } catch (error) {
    console.error(error);
  }
});

export default router;
