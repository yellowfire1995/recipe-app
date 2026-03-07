import express from "express";
import multer from "multer";
import { getPhotoFromAi } from "../../../../tools/ai/getRecipeFromPhoto.js";
import { tryCatch } from "../../../../tools/error/tryCatch.js";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/",
  tryCatch(upload.array("scanArray", 5)),
  tryCatch(async (req, res) => {
    const extraction = await getPhotoFromAi({ photoArray: req.files });
    res.json(extraction);
  }),
);

export default router;
