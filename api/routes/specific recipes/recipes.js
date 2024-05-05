import express from "express";
const router = express.Router();
import db from "../../database/db.js";
import axios from "axios";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { deleteFromS3 } from "../../tools/aws.js";
import e from "express";
import { getUserId } from "../../tools/getUserId.js";

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const S3 = new S3Client({
  credentials: {
    secretAccessKey: secretAccessKey,
    accessKeyId: accessKey,
  },
  region: bucketRegion,
});

async function checkAuth(req, res, next) {
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

    const query = {
      text: `SELECT author FROM RECIPES where recipe_id = $1`,
      values: [req.params.recipeId],
    };

    let data = await db.query(query);

    if (data.rows[0].author == activeUser.data.sub) {
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    console.error(error);
    res.status;
  }
}

router.get("/:recipeId", getUserId, async (req, res) => {
  try {
    const query = {
      text: ` SELECT   recipe_id,
      NAME,
      img_url AS "imgUrl",
      img_url AS "imgName",
      thumbnail,
      thumbnail AS "thumbnailName",
      servings,
      url,
      author,
      nickname,
      create_date,
      yield_number      AS "yieldNumber",
      yield_description AS "yieldDescription",
      public,
      (
             SELECT COALESCE(Json_agg(Json_build_object( 'id', recipe_cuisines.id, 'cuisine', cuisines.cuisine, 'recipe_id', recipe_cuisines.recipe_id, 'cuisine_id', recipe_cuisines.cuisine_id )), '[]')
             FROM   recipe_cuisines
             JOIN   cuisines
             ON     cuisines.id = recipe_cuisines.cuisine_id
             WHERE  recipe_id = $1 ) AS cuisine,
      (
             SELECT COALESCE(Json_agg(Json_build_object( 'id', recipe_categories.id, 'category', food_categories.food_category, 'recipe_id', recipe_categories.recipe_id, 'category_id', recipe_categories.category_id )), '[]')
             FROM   recipe_categories
             JOIN   food_categories
             ON     food_categories.id = recipe_categories.category_id
             WHERE  recipe_id = $1 ) AS category,
      (
                SELECT    COALESCE(Json_agg( Json_build_object ( 'recipe_id', ingredients.recipe_id, 'nutrients', (select json_agg(json_build_object(fn.nutrient_id, fn.amount, 'name', n."name"))
from food_nutrient fn 
		join nutrient n on fn.nutrient_id = n.id 
		where nutrient_id in (1110, 1004, 2000, 1093, 1003, 1089, 1079, 1008, 1253, 1005, 1087, 1258, 1162) and fn.fdc_id =  food.fdc_id) , 'id', ingredients.id, 'userG', COALESCE(ingredients.alt_g_conv, NULL), 'userLabel', COALESCE(ingredients.alt_label, NULL), 'quantity', amt, 'description', COALESCE(user_ingredient_name, Split_part(food.description, ',', 1)), 'fdc_id', ingredients.fdc_id, 'sr_id', ingredients.sr_id, 'gramConversion',
                          CASE
                                    WHEN food.data_type = 'branded_food' THEN COALESCE(bf.gram_modifier, 1/um.grams)
                                    WHEN food.data_type = 'sr_legacy_food' THEN fp.gram_modifier
                          END, 'engLabel',
                          CASE
                                    WHEN food.data_type = 'branded_food' THEN COALESCE(bf.alt_label, um.description)
                                    WHEN food.data_type = 'sr_legacy_food' THEN fp.modifier
                          END, 'price', COALESCE(fps.price_g, 0), 'package_grams', COALESCE(fps.package_grams, 0), 'package_cost', COALESCE(fps.package_cost, 0), 'url', fps.url )), '[]')
                FROM      ingredients
                JOIN      food
                ON        ingredients.fdc_id = food.fdc_id
                JOIN      recipes
                ON        ingredients.recipe_id = recipes.recipe_id
                LEFT JOIN branded_food bf
                ON        bf.fdc_id = food.fdc_id
                LEFT JOIN lateral
                          (
                                   select   modifier,
                                            gram_modifier,
                                            fdc_id,
                                            min(id) AS id
                                   FROM     food_portion fp
                                   WHERE    fp.id = ingredients.sr_id
                                   GROUP BY modifier,
                                            gram_modifier,
                                            fdc_id limit 1) AS fp
                ON        fp.fdc_id = ingredients.fdc_id
                LEFT JOIN lateral
                          (
                                   SELECT   fdc_id,
                                            package_grams,
                                            package_cost,
                                            url,
                                            max(date),
                                            price_g,
                                            user_id
                                   FROM     food_prices fps
                                   WHERE    fps.fdc_id = ingredients.fdc_id and fps.user_id = $2
                                   GROUP BY package_grams,
                                            fdc_id,
                                            package_cost,
                                            url,
                                            price_g,
                                            user_id limit 1 ) AS fps
                ON        fps.fdc_id = ingredients.fdc_id
                LEFT JOIN user_measures um
                ON        um.fdc_id = ingredients.fdc_id
                WHERE     recipes.recipe_id = $1 ) AS ingredients,
      (
               SELECT   COALESCE(json_agg(d.* ORDER BY step_num ASC), '[]')
               FROM     directions d
               JOIN     recipes r
               ON       d.recipe_id = r.recipe_id
               WHERE    r.recipe_id = $1 ) AS directions
FROM     recipes
WHERE    recipes.recipe_id = $1 and (recipes.public OR recipes.author = $2 )
GROUP BY recipes.recipe_id ; `,

      values: [req.params.recipeId, req.user.sub],
    };

    let data = await db.query(query);

    if (data.rows.length < 1) {
      throw new Error("Recipe not found or is private");
    }

    if (
      data.rows[0].imgUrl !== null &&
      !data.rows[0].imgUrl.match(/.*(http).*/g)
    ) {
      data.rows[0].imgUrl =
        "https://d30b48eq3arkah.cloudfront.net/" + data.rows[0].imgName;
      data.rows[0].originalUrl =
        "https://d30b48eq3arkah.cloudfront.net/" + data.rows[0].imgName;
    }

    res.send(data.rows);
  } catch (error) {
    console.error(error);
    res.status(404).send("Recipe not found");
  }
});

router.delete("/:recipeId/delete", checkAuth, async (req, res) => {
  try {
    console.log(req.body);
    const query = {
      text: `DELETE FROM recipes WHERE recipe_id = $1;
      `,
      values: [req.params.recipeId],
    };

    if (
      req.body.imgUrl !== null &&
      req.body.thumbnail !== null &&
      req.body.imgUrl.match(/.*(cloudfront).*/g) &&
      req.body.thumbnail.match(/.*(cloudfront).*/g)
    ) {
      await deleteFromS3(req.body.imgName);
      await deleteFromS3(req.body.thumbnailName);
    }

    await db.query(query);

    res.send(`Recipe has been deleted`);
  } catch (error) {
    res.send("ERROR");
    console.log(error);
  }
});

export default router;
