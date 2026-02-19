import express from "express";
import format from "pg-format";
import db from "../../../database/db.js";
import { tryCatch } from "../../../tools/error/tryCatch.js";
const router = express.Router();
const IMAGES_HOST = process.env.IMAGES_HOST;

router.get(
  "/",
  tryCatch(async (req, res) => {
    const auth = req.auth;
    const sqlSearch =
      req.query.search === "null" || req.query.search === "undefined"
        ? "%"
        : "%" + req.query.search.toLowerCase() + "%";

    const pageSize = parseInt(req.query.pageSize) || 15;

    let sort = "ORDER BY recipes.create_date DESC";

    const userRating = `(select rating
  from ratings r
  where r.recipe_id = recipes.recipe_id and r.author = '${auth.payload.sub}') as "userRating",`;

    if (req.query.sort === "oldest") {
      sort = "ORDER BY recipes.create_date ASC";
    } else if (req.query.sort === "nameDesc") {
      sort = "ORDER BY recipes.name DESC";
    } else if (req.query.sort === "nameAsc") {
      sort = "ORDER BY recipes.name ASC";
    }

    const query = {
      text: format(
        `
      SELECT recipe_id as "recipeId", name, thumbnail, servings, url, author, nickname, create_date, public,
      (select AVG(rating) 
from ratings r
where r.recipe_id = recipes.recipe_id  ) as rating,
%s
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
                  WHERE lower(recipes.name) LIKE $2 and author = $4
              GROUP BY recipes.recipe_id
              %s
              LIMIT $3
              Offset $1
              ;`,
        userRating,
        sort,
      ),
      values: [
        req.query.page === "null"
          ? 0
          : (parseInt(req.query.page) - 1) * pageSize,
        sqlSearch,
        pageSize + 1,
        auth.payload.sub,
      ],
    };

    const data = await db.query(query);

    let lastPage = false;

    data.rows.length < pageSize + 1 ? (lastPage = true) : data.rows.pop();

    const getThumbnailUrls = data.rows.map(async (recipe) => {
      return {
        ...recipe,
        thumbnail: recipe.thumbnail,
        thumbnailLink: recipe.thumbnail
          ? IMAGES_HOST + "/" + recipe.thumbnail
          : null,
      };
    });

    const cardData = await Promise.all(getThumbnailUrls);
    res.json({ recipes: cardData, lastPage: lastPage });
  }),
);

export default router;
