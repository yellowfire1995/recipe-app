import express from "express";
const router = express.Router();
import db from "../../../../database/db.js";
import multer from "multer";
import {
  resizeAndUploadFileToS3,
  uploadDualSizesUrlToS3,
  uploadFileToS3,
} from "../../../../tools/aws/aws.js";
import { tryCatch } from "../../../../tools/error/tryCatch.js";
import { AppError } from "../../../../tools/error/AppError.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 5242880 } });

export async function checkAuth(req, res, next) {
  const recipe = JSON.parse(req.body.recipe);

  const query = {
    text: `SELECT author FROM RECIPES where recipe_id = $1`,
    values: [recipe.recipeId],
  };

  let data = await db.query(query);

  if (data.rows[0].author == req.auth.payload.sub) {
    next();
  } else {
    throw new AppError(401, "Unauthorized", 401);
  }
}

router.post(
  "/",
  tryCatch(upload.single("photo")),
  tryCatch(checkAuth),
  tryCatch(async (req, res) => {
    let recipe = JSON.parse(req.body.recipe);
    let key = recipe.imgName;
    let thumbnailKey;

    if (recipe.ingredients) {
      recipe = {
        ...recipe,
        ingredients: recipe.ingredients.map((ingredient, index) => {
          return { ...ingredient, order: index };
        }),
      };
    }

    if (req.file) {
      key = await uploadFileToS3(req.file);
      thumbnailKey = await resizeAndUploadFileToS3(req.file);
    } else if (recipe.imgUrl != recipe.originalUrl) {
      ({ key, thumbnailKey } = await uploadDualSizesUrlToS3(recipe.imgUrl));
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
      insert into ingredients (recipe_id,  amt, fdc_id, sr_id,  alt_g_conv, alt_label, "order", header, user_ingredient_name)
      SELECT (SELECT recipe_id FROM r),(t ->> 'quantity')::real,(t ->> 'fdc_id')::int, (t ->> 'sr_id')::int,(t ->> 'userG')::float, (t ->> 'userLabel'), (t ->> 'order')::int,(t ->> 'isGroupHeader')::bool, (t ->> 'description')
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
        recipe.recipeId,
        recipe.url,
        JSON.stringify(recipe.directions),
        JSON.stringify(recipe.ingredients),
        JSON.stringify(recipe.cuisine),
        JSON.stringify(recipe.category),
        isNaN(recipe.yieldNumber) ? null : recipe.yieldNumber,
        recipe.yieldDescription == "" ? null : recipe.yieldDescription,
        thumbnailKey || recipe.thumbnail,
        recipe.public,
      ],
    };

    await db.query(query);
    res.json(req.body);
  })
);

export default router;
