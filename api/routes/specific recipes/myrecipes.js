import express from "express";
const router = express.Router();
import db from "../../database/db.js";
import axios from "axios";
import { getUserId } from "../../tools/getUserId.js";

router.get("/", getUserId, async (req, res) => {
  try {
    const query = {
      text: `
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
                WHERE author = $1
            GROUP BY recipes.recipe_id
         
            ;`,
      values: [req.user],
    };

    const data = await db.query(query);

    res.json(data.rows);
  } catch (error) {
    console.error(error);
  }
});

export default router;
