import express from "express";
import axios from "axios";
import qs from "qs";
const router = express.Router();

router.post("/scrape", async (req, res) => {
  try {
    const recipe = await axios.post(
      "http://127.0.0.1:5000/api/v1/scrape",
      qs.stringify({
        url: req.body.url,
      }),
      { headers: { "content-type": "application/x-www-form-urlencoded" } }
    );
    res.json(recipe.data);
  } catch (error) {
    console.error(error);
  }
});

export default router;
