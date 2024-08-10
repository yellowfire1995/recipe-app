import express from "express";
import db from "../../../database/db.js";
import { tryCatch } from "../../../tools/error/tryCatch.js";
const router = express.Router();

router.get(
  "/recipes",
  tryCatch(async (req, res) => {
    const query = {
      text: `select
	array_agg(json_build_object(
      'recipeId',
	r.recipe_id,
	'name',
	r."name",
	'thumbnail',
	thumbnail,
	'servings',
	servings,
	'url',
	url,
	'author',
	author,
	'nickname',
	nickname,
	'createDate',
	r.create_date,
    'planDate',
	p.date,
    'planId',
    p.id)) as recipes
from
	planner p
join recipes r on
	r.recipe_id = p.recipe_id
where p.user = $1
group by
	date

  `,
      values: [req.auth.payload.sub],
    };
    const data = await db.query(query);
    const cardData = data.rows.map((mealPlan) => {
      return {
        ...mealPlan,
        recipes: mealPlan.recipes.map((recipe) => {
          return {
            ...recipe,
            thumbnail: recipe.thumbnail
              ? "https://d30b48eq3arkah.cloudfront.net/" + recipe.thumbnail
              : null,
          };
        }),
      };
    });

    res.send(cardData);
  })
);

router.post(
  "/add/recipe/:recipeId",
  tryCatch(async (req, res) => {
    const query = {
      text: `INSERT INTO planner
      (recipe_id, date, "user")
      VALUES($1, $2, $3)`,
      values: [req.params.recipeId, req.body.date, req.auth.payload.sub],
    };
    const data = await db.query(query);
    res.send(data);
  })
);

router.delete(
  "/delete/:plannerId",
  tryCatch(async (req, res) => {
    const query = {
      text: ` delete from planner
      where id = $1 and "user" = $2`,
      values: [req.params.plannerId, req.auth.payload.sub],
    };
    const deleter = await db.query(query);

    res.send(deleter);
  })
);

router.post(
  "/edit",
  tryCatch(async (req, res) => {
    const query = {
      text: ` update planner
      set date = $2
      where id = $1 and "user" = $3`,
      values: [req.body.planId, req.body.date, req.auth.payload.sub],
    };
    const editor = await db.query(query);

    res.send(editor);
  })
);

export default router;
