import express from "express";
const router = express.Router();
import db from "../../database/db.js";

router.post("/", async (req, res) => {
  let data;
  const recipe = req.body.updatedRecipe;
  const userData = req.body.userData;

  const query = {
    text: `WITH r AS
      (
        INSERT INTO recipes (name, servings, img_url, url, author, nickname) VALUES ($1, $2, $3, $4, $9, $10 ) RETURNING recipe_id
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
      insert into ingredients (recipe_id,  amt, fdc_id, nice_name)
      SELECT (SELECT recipe_id FROM r),(t ->> 'amt')::real,(t ->> 'fdc_id')::int, t ->> 'niceName'
      from json_array_elements($7::json) t 
      ),
      cat as (
      insert into recipe_categories (category_id, recipe_id)
      SELECT (t ->> 'category_id')::int, (SELECT recipe_id FROM r)
      from json_array_elements($8::json) t 
      )
      SELECT recipe_id FROM r;
  `,
    values: [
      recipe.name,
      recipe.servings,
      recipe.img_url,
      recipe.url,
      JSON.stringify(recipe.cuisine),
      JSON.stringify(recipe.directions),
      JSON.stringify(recipe.ingredients),
      JSON.stringify(recipe.category),
      userData.user_id,
      userData.nickname,
    ],
  };

  try {
    data = await db.query(query);

    res.json(data.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

export default router;
