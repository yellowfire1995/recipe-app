import express from "express";
import format from "pg-format";
import db from "../../database/db.js";
import { authenticate } from "../../index.js";
import { tryCatch } from "../../tools/error/tryCatch.js";
const router = express.Router();

router.get(
  "/",
  tryCatch((req, res, next) => {
    req.headers.authorization || req.auth
      ? authenticate(req, res, next)
      : next();
  }),
  tryCatch(async (req, res) => {
    const isLoggedIn = !!req.auth?.payload;
    const isCollectionView = req.query.collectionId != "undefined";
    const sqlSearch =
      req.query.search == "null" || req.query.search == "undefined"
        ? "%"
        : "%" + req.query.search.toLowerCase() + "%";

    const pageSize = parseInt(req.query.pageSize) || 15;

    let sort = "ORDER BY recipes.create_date DESC";
    let userRating;
    let filter;
    let collectionJoin;
    let collectionWhere;
    let collectionSelect;

    if (isLoggedIn) {
      userRating = `(select rating
from ratings r
where r.recipe_id = recipes.recipe_id and r.author = '${req.auth.payload.sub}') as "userRating",`;
      filter = `or recipes.author = '${req.auth.payload.sub}'`;

      if (isCollectionView) {
        collectionJoin =
          "right join recipe_collections rc on rc.recipe_id = recipes.recipe_id";
        collectionWhere = format(
          `and rc.collection_id = %s`,
          req.query.collectionId
        );
        collectionSelect = `rc.id as "collectionRecipeId", rc.collection_id as "collectionId",`;
      }
    }

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
      SELECT recipes.recipe_id as "recipeId", name, thumbnail, servings, url, author, nickname, create_date, public, %s
      (select AVG(rating) 
from ratings r
where r.recipe_id = recipes.recipe_id  ) as rating,
(select COUNT(rating) 
from ratings r
where r.recipe_id = recipes.recipe_id  ) as "ratingCount",
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
              %s
              WHERE lower(recipes.name) LIKE $2 and (recipes.public %s) %s
              %s
              LIMIT $3
              Offset $1
              ;`,
        collectionSelect,
        userRating,
        collectionJoin,
        filter,
        collectionWhere,
        sort
      ),
      values: [
        req.query.page == "null"
          ? 0
          : (parseInt(req.query.page) - 1) * pageSize,
        sqlSearch,
        pageSize + 1,
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
          ? "https://d30b48eq3arkah.cloudfront.net/" + recipe.thumbnail
          : null,
      };
    });

    const cardData = await Promise.all(getThumbnailUrls);

    res.json({ recipes: cardData, lastPage: lastPage });
  })
);

export default router;
