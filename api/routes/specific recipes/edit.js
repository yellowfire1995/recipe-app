import express from "express";
const router = express.Router();
import db from "../../database/db.js";
import axios from "axios";

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
      values: [req.body.recipe_id],
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

router.post("/", checkAuth, async (req, res) => {
  const recipe = req.body;
  console.log(JSON.stringify(recipe.ingredients));
  const query = {
    text: `WITH r AS
      (
        UPDATE recipes
        SET name=$1,
          img_url= $2,
         servings=$3,
         url=$5
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
      insert into ingredients (recipe_id, amt, fdc_id, sr_id)
      SELECT (SELECT recipe_id FROM r),(t ->> 'quantity')::real,(t ->> 'fdc_id')::int,(t ->> 'sr_id')::int
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
      recipe.img_url,
      recipe.servings,
      recipe.recipe_id,
      recipe.url,
      JSON.stringify(recipe.directions),
      JSON.stringify(recipe.ingredients),
      JSON.stringify(recipe.cuisine),
      JSON.stringify(recipe.category),
    ],
  };
  try {
    let data = await db.query(query);
  } catch (error) {
    console.error(error);
  }

  res.json(req.body);
});

export default router;
