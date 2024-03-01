import express from "express";
const router = express.Router();
import db from "../../database/db.js";

router.get("/", async (req, res) => {
  let data;
  try {
    const client = await db.connect();
    data = await db.query(`
      SELECT recipes.* ,
  (
         Select COALESCE(JSON_AGG(json_build_object(
              'id',  recipe_cuisines.id, 
              'cuisine', cuisines.cuisine, 
              'recipe_id', recipe_cuisines.recipe_id              
            )), '[]') 
        from recipe_cuisines
          JOIN cuisines ON cuisines.id = recipe_cuisines.cuisine_id
  WHERE recipes.recipe_id = recipe_cuisines.recipe_id
        ) as cuisine
     
                  FROM recipes
              GROUP BY recipes.recipe_id
           
              ;`);
    client.release();
    res.json(data.rows);
  } catch (error) {
    console.error(error);
  }
});

export default router;
