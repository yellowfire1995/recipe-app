import express from "express";
const router = express.Router();
import db from "../../database/db.js";
import { checkJwt, getUserId } from "../../tools/getUserId.js";

router.get("/recipes", checkJwt, async (req, res) => {
  try {
    const query = {
      text: `select
	array_agg(json_build_object(
      'recipe_id',
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
  } catch (error) {
    console.log(error);
    throw new Error(401).message("Unauthorized");
  }
});

router.post("/add/recipe/:recipeId", checkJwt, async (req, res) => {
  console.log(req);
  try {
    const query = {
      text: `INSERT INTO planner
      (recipe_id, date, "user")
      VALUES($1, $2, $3)`,
      values: [req.params.recipeId, req.body.date, req.auth.payload.sub],
    };
    const data = await db.query(query);
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete/:plannerId", checkJwt, async (req, res) => {
  try {
    const query = {
      text: ` delete from planner
      where id = $1 and "user" = $2`,
      values: [req.params.plannerId, req.auth.payload.sub],
    };
    const deleter = await db.query(query);

    res.send(deleter);
  } catch (error) {
    console.log(error);
  }
});

// router.delete("/delete/recipe", checkJwt, async (req, res) => {
//   try {
//     const query = {
//       text: `delete from recipe_collections
//     where id = any($1::int[]) and "user" = $2 `,
//       values: [req.body.ids, req.auth.payload.sub],
//     };
//     const deleter = await db.query(query);
//     console.log(deleter);
//     res.send(deleter);
//   } catch (error) {
//     console.log(error);
//   }
// });

router.post("/edit", checkJwt, async (req, res) => {
  try {
    const query = {
      text: ` update planner
      set date = $2
      where id = $1 and "user" = $3`,
      values: [req.body.planId, req.body.date, req.auth.payload.sub],
    };
    const editor = await db.query(query);
    console.log(req.body.date);
    res.send(editor);
  } catch (error) {
    console.log(error);
  }
});

export default router;
