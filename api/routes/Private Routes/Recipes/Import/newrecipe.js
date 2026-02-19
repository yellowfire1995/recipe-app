import express from "express";
const router = express.Router();
import db from "../../../../database/db.js";
import {
  resizeAndUploadFileToS3,
  uploadDualSizesUrlToS3,
  uploadFileToS3,
} from "../../../../tools/aws/aws.js";
import multer from "multer";
import { getUserId } from "../../../../tools/auth/getUserId.js";
import { tryCatch } from "../../../../tools/error/tryCatch.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/",
  tryCatch(getUserId),
  tryCatch(upload.single("photo")),
  tryCatch(async (req, res) => {
    let recipe = JSON.parse(req.body.updatedRecipe);
    let key = null;
    let thumbnailKey = null;

    if (req.file) {
      key = await uploadFileToS3(req.file);
      thumbnailKey = await resizeAndUploadFileToS3(req.file);
    } else if (recipe.imgUrl) {
      ({ key, thumbnailKey } = await uploadDualSizesUrlToS3(recipe.imgUrl));
    }

    if (recipe.ingredients) {
      recipe = {
        ...recipe,
        ingredients: recipe.ingredients.map((ingredient, index) => {
          const ingredientDescription =
            (ingredient.quantity > 0 &&
              !ingredient.displayOriginalName &&
              !recipe.allAsOriginal) ||
            !ingredient.userIngredientName
              ? ingredient.description
              : ingredient.userIngredientName;
          return {
            ...ingredient,
            order: index,
            description: ingredientDescription,
          };
        }),
      };
    }

    const query = {
      text: `WITH r AS
        (
          INSERT INTO recipes (name, servings, img_url, url, author, nickname, yield_number, yield_description, thumbnail, public) VALUES ($1, $2, $3, $4, $9, $10, $11, $12, $13, $14 ) RETURNING recipe_id
        ),
         c AS
        (
        insert into recipe_cuisines (cuisine_id, recipe_id)
        SELECT (t ->> 'cuisine_id')::int, (SELECT recipe_id FROM r)
        from json_array_elements($5::json) t
        ),
          d AS
        (
        INSERT INTO directions (recipe_id, step, step_num)
        SELECT (SELECT recipe_id FROM r), (t ->> 'step'),(t ->> 'step_num')::int
        from json_array_elements($6::json) t
        ),
        i AS
        (
        insert into ingredients (recipe_id,  amt, fdc_id, sr_id,  alt_g_conv, alt_label, user_ingredient_name, "order", header, show_user_name)
        SELECT (SELECT recipe_id FROM r),(t ->> 'quantity')::real,(t ->> 'fdc_id')::int, (t ->> 'sr_id')::int,(t ->> 'userG')::float, (t ->> 'userLabel'), (t ->> 'userIngredientName'), (t ->> 'order')::int,(t ->> 'isGroupHeader')::bool,(t ->> 'displayOriginalName')::bool
        from json_array_elements($7::json) t
        ),
        cat as (
        insert into recipe_categories (category_id, recipe_id)
        SELECT (t ->> 'category_id')::int, (SELECT recipe_id FROM r)
        from json_array_elements($8::json) t
        )
        SELECT recipe_id as "recipeId" FROM r;
    `,
      values: [
        recipe.name,
        recipe.servings,
        key,
        recipe.url,
        JSON.stringify(recipe.cuisine),
        JSON.stringify(recipe.directions),
        JSON.stringify(recipe.ingredients),
        JSON.stringify(recipe.category),
        req.auth.payload.sub,
        req.user.nickname,
        recipe.yieldNumber,
        recipe.yieldDescription,
        thumbnailKey,
        recipe.public, //14
      ],
    };

    const data = await db.query(query);

    res.json(data.rows[0]);
  })
);

export default router;
