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

router.get("/:recipeId", async (req, res) => {
  let data;
  const query = {
    text: `SELECT recipes.* ,
    (
           Select COALESCE(JSON_AGG(json_build_object(
                'id',  recipe_cuisines.id, 
                'cuisine', cuisines.cuisine, 
                'recipe_id', recipe_cuisines.recipe_id,
                'cuisine_id', recipe_cuisines.cuisine_id             
              )), '[]') 
          from recipe_cuisines
            JOIN cuisines ON cuisines.id = recipe_cuisines.cuisine_id
            WHERE recipe_id = $1
          ) as cuisine,
          
   (
           Select COALESCE(JSON_AGG(json_build_object(
                'id',  recipe_categories.id, 
                'category', food_categories.food_category, 
                'recipe_id', recipe_categories.recipe_id,
                'category_id', recipe_categories.category_id             
              )), '[]') 
          from recipe_categories
            JOIN food_categories ON food_categories.id = recipe_categories.category_id
            WHERE recipe_id = $1
          ) as category,
    
          (
            Select COALESCE(JSON_AGG( json_build_object
              (
               'recipe_id', ingredients.recipe_id, 
                'id', ingredients.id, 
                'quantity', amt, 
                'description', SPLIT_PART(food.description, ',', 1),
                'niceName', nice_name,
                'fdc_id', ingredients.fdc_id,
                'sr_id', ingredients.sr_id,
                'engAmt', case 
                                when food.data_type = 'branded_food' 
                                    then bf.gram_modifier*amt
                                when food.data_type = 'sr_legacy_food' 
                                    then fp.gram_modifier*amt end,
                 'engLabel', case 
                                when food.data_type = 'branded_food' 
                                    then bf.alt_label
                                when food.data_type = 'sr_legacy_food' 
                                    then fp.modifier  end,
                                    
                'price', coalesce(fps.price_g, 0),
                'package_grams', coalesce(fps.package_grams, 0),
                'package_cost', coalesce(fps.package_cost, 0),
                'url', fps.url              

              )), '[]') 
   from ingredients
     JOIN food ON ingredients.fdc_id = food.fdc_id 
     JOIN recipes ON ingredients.recipe_id = recipes.recipe_id
     left join branded_food bf on bf.fdc_id = food.fdc_id
     left join lateral (select modifier, gram_modifier, fdc_id, min(id) as id from food_portion fp where fp.id = ingredients.sr_id group by modifier, gram_modifier, fdc_id limit 1) as fp on fp.fdc_id = ingredients.fdc_id
     left join lateral (select fdc_id, package_grams, package_cost, url, max(date), price_g from food_prices fps where fps.fdc_id = ingredients.fdc_id group by package_grams, fdc_id, package_cost, url, price_g limit 1  ) as fps on fps.fdc_id = ingredients.fdc_id
     WHERE recipes.recipe_id = $1
          ) as ingredients,
          (
            Select coalesce(JSON_AGG(d.* order by step_num asc), '[]') 
            from directions d 
            JOIN recipes r ON d.recipe_id = r.recipe_id
              WHERE r.recipe_id = $1
          ) as directions
                                  FROM recipes
              
             
                
                WHERE recipes.recipe_id = $1
                GROUP BY recipes.recipe_id
             
                ;`,

    values: [req.params.recipeId],
  };
  try {
    data = await db.query(query);

    res.send(data.rows);
  } catch (error) {
    console.error(error);
  }
});

router.delete("/:recipeId/delete", checkAuth, async (req, res) => {
  try {
    const query = {
      text: `DELETE FROM recipes WHERE recipe_id = $1;
      `,
      values: [req.params.recipeId],
    };
    await db.query(query);

    res.send(`Recipe has been deleted`);
  } catch (error) {
    res.send("ERROR");
    console.log(error);
  }
});

export default router;
