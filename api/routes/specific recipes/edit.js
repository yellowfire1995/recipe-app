import express from "express";
const router = express.Router();
import db from "../../database/db.js";
import axios from "axios";
import multer from "multer";
import {
  resizeAndUploadFileToS3,
  uploadDualSizesUrlToS3,
  uploadFileToS3,
} from "../../tools/aws.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export async function checkAuth(req, res, next) {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: process.env.AUTH0_VERIFY,
      headers: {
        Accept: "application/json",
        Authorization: `${req.headers.authorization}`,
      },
    };

    const activeUser = await axios.request(config);
    const recipe = JSON.parse(req.body.updatedRecipe);

    const query = {
      text: `SELECT author FROM RECIPES where recipe_id = $1`,
      values: [recipe.recipe_id],
    };

    let data = await db.query(query);

    if (data.rows[0].author == activeUser.data.sub) {
      console.log("authorized");
      next();
    } else {
      res.status(403).send("Unauthorized");
    }
  } catch (error) {
    console.error(error);
    res.status(401).send("ERROR");
  }
}

router.post("/", upload.single("photo"), checkAuth, async (req, res) => {
  try {
    const recipe = JSON.parse(req.body.updatedRecipe);
    let key = recipe.imgName;
    let thumbnailKey;

    if (req.file) {
      key = await uploadFileToS3(req.file);
      thumbnailKey = await resizeAndUploadFileToS3(req.file);
    } else if (recipe.imgUrl != recipe.originalUrl) {
      [key, thumbnailKey] = await uploadDualSizesUrlToS3(recipe.imgUrl);
    }

    const query = {
      text: `WITH r AS
      (
        UPDATE recipes
        SET name=$1,
          img_url= $2,
         servings=$3,
         url=$5,
         yield_number=$10,
         yield_description=$11,
         thumbnail=$12,
         public=$13
      WHERE recipes.recipe_id = $4 RETURNING recipe_id
      ),
      ddel AS 
      (
      DELETE FROM directions
      WHERE recipe_id = (SELECT recipe_id FROM r)
      ), d AS 
      (
      INSERT INTO directions (recipe_id, step, step_num)
      SELECT (SELECT recipe_id FROM r), (t ->> 'step'),(t ->> 'step_num')::int
      from json_array_elements($6::json) t 
      ),  idel AS (
        DELETE FROM ingredients
  WHERE recipe_id = (SELECT recipe_id FROM r)
      ),	i AS
      (
      insert into ingredients (recipe_id,  amt, fdc_id, sr_id,  alt_g_conv, alt_label)
      SELECT (SELECT recipe_id FROM r),(t ->> 'quantity')::real,(t ->> 'fdc_id')::int, (t ->> 'sr_id')::int,(t ->> 'userG')::float, (t ->> 'userLabel')
      from json_array_elements($7::json) t 
      ), cusdel AS 
      (
      DELETE FROM recipe_cuisines
  WHERE recipe_id = (SELECT recipe_id FROM r)
      ), cus AS 
      (
       insert into recipe_cuisines (cuisine_id, recipe_id)
      SELECT (t ->> 'cuisine_id')::int, (SELECT recipe_id FROM r)
      from json_array_elements($8::json) t 
      ), catdel AS 
      (
          DELETE FROM recipe_categories
  WHERE recipe_id = (SELECT recipe_id FROM r)
      )
      
      insert into recipe_categories (category_id, recipe_id)
      SELECT (t ->> 'category_id')::int, (SELECT recipe_id FROM r)
      from json_array_elements($9::json) t;`,
      values: [
        recipe.name,
        key,
        recipe.servings,
        recipe.recipe_id,
        recipe.url,
        JSON.stringify(recipe.directions),
        JSON.stringify(recipe.ingredients),
        JSON.stringify(recipe.cuisine),
        JSON.stringify(recipe.category),
        isNaN(recipe.yieldNumber) ? null : recipe.yieldNumber,
        recipe.yieldDescription == "" ? null : recipe.yieldDescription,
        thumbnailKey,
        recipe.public,
      ],
    };

    let data = await db.query(query);
    res.json(req.body);
  } catch (error) {
    console.error(error);
    res
      .status(422)
      .send("Unable to process. Please change data and try again.");
  }
});

export default router;
