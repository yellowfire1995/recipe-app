import express from "express";
const router = express.Router();
import db from "../../database/db.js";
import { checkJwt } from "../../tools/getUserId.js";

router.get("/", checkJwt, async (req, res) => {
  console.log("authorized!");
  const auth = req.auth;
  try {
    const sqlSearch =
      req.query.search == "null"
        ? "%"
        : "%" + req.query.search.toLowerCase() + "%";

    const query = {
      text: `
      SELECT recipe_id, name, thumbnail, servings, url, author, nickname, create_date,
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
                  WHERE lower(recipes.name) LIKE $2 and author = $3
              GROUP BY recipes.recipe_id
              ORDER BY recipes.recipe_id DESC
              LIMIT 16
              Offset $1
              ;`,
      values: [
        req.query.page == "null" ? 0 : (parseInt(req.query.page) - 1) * 15,
        sqlSearch,
        auth.payload.sub,
      ],
    };

    const data = await db.query(query);

    let lastPage = false;

    data.rows.length < 16 ? (lastPage = true) : data.rows.pop();

    const getThumbnailUrls = data.rows.map(async (recipe) => {
      return {
        ...recipe,
        thumbnail: recipe.thumbnail
          ? "https://d30b48eq3arkah.cloudfront.net/" + recipe.thumbnail
          : null,
      };
    });

    const cardData = await Promise.all(getThumbnailUrls);

    res.json({ data: cardData, lastPage: lastPage });
  } catch (error) {
    console.error(error);
  }
});

export default router;
