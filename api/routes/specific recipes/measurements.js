import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const price = await getPrice(req.body.url);
    res.json(price);
  } catch (error) {
    console.error(error);
    res.json(["An error occured, please try again."]);
  }
});

export default router;
