import { S3Client } from "@aws-sdk/client-s3";
import express from "express";
import format from "pg-format";
import db from "../../database/db.js";
import { authenticate } from "../../index.js";
import { deleteFromS3 } from "../../tools/aws/aws.js";
import { AppError } from "../../tools/error/AppError.js";
import { tryCatch } from "../../tools/error/tryCatch.js";
const router = express.Router();

const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const roles = `${process.env.AUTH0_NAMESPACE}/roles`;
const IMAGES_HOST = process.env.IMAGES_HOST;

new S3Client({
  credentials: {
    secretAccessKey: secretAccessKey,
    accessKeyId: accessKey,
  },
  region: bucketRegion,
});

async function checkAuth(req, res, next) {
  const query = {
    text: `SELECT author, public FROM RECIPES where recipe_id = $1`,
    values: [req.params.recipeId],
  };

  const data = await db.query(query);
  const isRecipeAuthor =
    data.rows[0].author && data.rows[0].author === req.auth?.payload.sub;
  const isAdmin = req.auth?.payload[roles]?.includes("Admin");

  if (isRecipeAuthor || isAdmin) {
    next();
  } else {
    throw new AppError(401, "Unauthorized", 401);
  }
}

router.get(
  "/:recipeId",
  tryCatch((req, res, next) => {
    req.headers.authorization ? authenticate(req, res, next) : next();
  }),
  tryCatch(async (req, res) => {
    let userRating;
    if (req.auth?.payload.sub) {
      userRating = `(select rating
  from ratings r
  where r.recipe_id = recipes.recipe_id and r.author = '${req.auth.payload.sub}') as "userRating",`;
    }

    const query = {
      text: format(
        ` select
	  recipe_id as "recipeId",
	  NAME,
	  img_url as "imgUrl",
	  img_url as "imgName",
	  thumbnail,
	  thumbnail as "thumbnailName",
	  servings,
	  url,
	  author,
	  nickname,
	  create_date,
	  yield_number as "yieldNumber",
	  yield_description as "yieldDescription",
	  public,
	        (select COUNT(rating) 
from ratings r
where r.recipe_id = recipes.recipe_id  ) as "ratingCount",
 (select avg(rating) 
from ratings r
where r.recipe_id = recipes.recipe_id  ) as rating,
%s
	  (
	  select
		  coalesce(Json_agg(Json_build_object( 'id',
		  recipe_cuisines.id,
		  'cuisine',
		  cuisines.cuisine,
		  'recipeId',
		  recipe_cuisines.recipe_id,
		  'cuisine_id',
		  recipe_cuisines.cuisine_id )),
		  '[]')
	  from
		  recipe_cuisines
	  join cuisines
			   on
		  cuisines.id = recipe_cuisines.cuisine_id
	  where
		  recipe_id = $1 ) as cuisine,
	  (
	  select
		  coalesce(Json_agg(Json_build_object( 'id',
		  recipe_categories.id,
		  'category',
		  food_categories.food_category,
		  'recipeId',
		  recipe_categories.recipe_id,
		  'category_id',
		  recipe_categories.category_id )),
		  '[]')
	  from
		  recipe_categories
	  join food_categories
			   on
		  food_categories.id = recipe_categories.category_id
	  where
		  recipe_id = $1 ) as category,
	  (
	  select
		  coalesce(Json_agg( Json_build_object ( 'recipeId',
		  ingredients.recipe_id,
		  'nutrients',
		  (
		  select
			  json_agg(json_build_object(fn.nutrient_id,
			  fn.amount,
			  'name',
			  n."name"))
		  from
			  food_nutrient fn
		  join nutrient n on
			  fn.nutrient_id = n.id
		  where
			  nutrient_id in (1110, 1004, 2000, 1093, 1003, 1089, 1079, 1008, 1253, 1005, 1087, 1258, 1162)
				  and fn.fdc_id = food.fdc_id) ,
		  'id',
		  ingredients.id,
		  'displayOriginalName',
		  show_user_name,
		  'userG',
		  coalesce(ingredients.alt_g_conv,
		  null),
		  'userLabel',
		  coalesce(ingredients.alt_label,
		  null),
		  'quantity',
		  amt,
		  'description',
				  food.description,
				  'userIngredientName',
		  user_ingredient_name,
		  'fdc_id',
		  ingredients.fdc_id,
		  'sr_id',
		  ingredients.sr_id,
		  'gramConversion',
		  case
			  when food.data_type = 'branded_food' then coalesce(bf.gram_modifier,
			  1 / um.grams)
			  when food.data_type = 'sr_legacy_food' then fp.gram_modifier
		  end,
		  'engLabel',
		  case
			  when food.data_type = 'branded_food' then coalesce(bf.alt_label,
			  um.description)
			  when food.data_type = 'sr_legacy_food' then fp.modifier
		  end,
		  'price',
		  coalesce(fps.price_g,
		  0),
		  'package_grams',
		  coalesce(fps.package_grams,
		  0),
		  'package_cost',
		  coalesce(fps.package_cost,
		  0),
		  'url',
		  fps.url,
		  'order',
		  "order",
	  'isGroupHeader',
	  header) order by "order"),
		  '[]')
	  from
		  ingredients
		left join food
				  on
		  ingredients.fdc_id = food.fdc_id
	  join recipes
				  on
		  ingredients.recipe_id = recipes.recipe_id
	  left join branded_food bf
				  on
		  bf.fdc_id = food.fdc_id
	  left join lateral
							(
		  select
			  modifier,
			  gram_modifier,
			  fdc_id,
			  min(id) as id
		  from
			  food_portion fp
		  where
			  fp.id = ingredients.sr_id
		  group by
			  modifier,
			  gram_modifier,
			  fdc_id
		  limit 1) as fp
				  on
		  fp.fdc_id = ingredients.fdc_id
	  left join lateral
							(
		  select
			  fdc_id,
			  package_grams,
			  package_cost,
			  url,
			  max(date),
			  price_g,
			  user_id
		  from
			  food_prices fps
		  where
			  fps.fdc_id = ingredients.fdc_id
			  and fps.user_id = $2
		  group by
			  package_grams,
			  fdc_id,
			  package_cost,
			  url,
			  price_g,
			  user_id
		  limit 1 ) as fps
				  on
		  fps.fdc_id = ingredients.fdc_id
	  left join user_measures um
				  on
		  um.fdc_id = ingredients.fdc_id
	  where
		  recipes.recipe_id = $1
	   ) as ingredients,
	  (
	  select
		  coalesce(json_agg(d.*
	  order by
		  step_num asc),
		  '[]')
	  from
		  directions d
	  join recipes r
				 on
		  d.recipe_id = r.recipe_id
	  where
		  r.recipe_id = $1 ) as directions
  from
	  recipes
  where
	  recipes.recipe_id = $1
  group by
	  recipes.recipe_id ;`,
        userRating,
      ),

      values: [req.params.recipeId, req.auth?.payload.sub],
    };

    const data = await db.query(query);

    const isRecipeAuthor = data.rows[0]?.author === req.auth?.payload.sub;
    const isPublicRecipe = data.rows[0]?.public;
    const isAdmin = req.auth?.payload[roles]?.includes("Admin");
    const isNoRecipe = data.rows.length < 1;

    if ((!isRecipeAuthor && !isPublicRecipe && !isAdmin) || isNoRecipe) {
      throw new AppError(404, "Recipe not found or is private", 404);
    }

    if (
      data.rows[0].imgUrl !== null &&
      !data.rows[0].imgUrl.match(/.*(http).*/g)
    ) {
      data.rows[0].imgUrl = IMAGES_HOST + "/" + data.rows[0].imgName;
      data.rows[0].originalUrl = IMAGES_HOST + "/" + data.rows[0].imgName;
    }

    res.send(data.rows);
  }),
);

router.delete(
  "/:recipeId/delete",
  tryCatch((req, res, next) => {
    req.headers.authorization ? authenticate(req, res, next) : next();
  }),
  tryCatch(checkAuth),
  tryCatch(async (req, res) => {
    const query = {
      text: `DELETE FROM recipes WHERE recipe_id = $1;
      `,
      values: [req.params.recipeId],
    };

    await db.query(query);

    if (
      req.body.imgUrl !== null &&
      req.body.thumbnail !== null &&
      req.body.imgUrl?.startsWith(IMAGES_HOST) &&
      req.body.thumbnail?.startsWith(IMAGES_HOST)
    ) {
      await deleteFromS3(req.body.imgName);
      await deleteFromS3(req.body.thumbnailName);
    }

    res.send(`Recipe has been deleted`);
  }),
);

export default router;
