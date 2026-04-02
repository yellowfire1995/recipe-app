import express from "express";
import db from "../../database/db.js";
import { authenticate } from "../../index.js";
import { tryCatch } from "../../tools/error/tryCatch.js";

const router = express.Router();
const IMAGES_HOST = process.env.IMAGES_HOST;

const SORT_MAP = {
  oldest: "recipes.create_date ASC",
  nameDesc: "recipes.name DESC",
  nameAsc: "recipes.name ASC",
  default: "recipes.create_date DESC",
};

router.get(
  "/",
  tryCatch((req, res, next) => {
    req.headers.authorization || req.auth
      ? authenticate(req, res, next)
      : next();
  }),
  tryCatch(async (req, res) => {
    const userId = req.auth?.payload?.sub ?? null;

    const search = ["null", "undefined", undefined, ""].includes(
      req.query.search,
    )
      ? null
      : req.query.search;

    const category =
      req.query.category !== "undefined"
        ? parseInt(req.query.category) || null
        : null;
    const pageSize = parseInt(req.query.pageSize) || 15;
    const offset =
      req.query.page === "null" ? 0 : (parseInt(req.query.page) - 1) * pageSize;
    const orderBy = SORT_MAP[req.query.sort] ?? SORT_MAP.default;
    const collectionId =
      req.query.collectionId !== "undefined"
        ? parseInt(req.query.collectionId)
        : null;

    const { rows } = await db.query(
      `
SELECT
  recipes.recipe_id              AS "recipeId",
  recipes.name,
  recipes.thumbnail,
  recipes.servings,
  recipes.url,
  recipes.author,
  recipes.nickname,
  recipes.create_date,
  recipes.public,
  rc.id                          AS "collectionRecipeId",
  rc.collection_id               AS "collectionId",
  ratings_agg.avg_rating         AS rating,
  ratings_agg.rating_count       AS "ratingCount",
  ratings_agg.user_rating        AS "userRating",
  cuisine_agg.cuisine,
  category_agg.categories
FROM recipes
LEFT JOIN collections col
  ON col.id = $5::int
LEFT JOIN recipe_collections rc
  ON rc.recipe_id = recipes.recipe_id
  AND $5::int IS NOT NULL
  AND rc.collection_id = $5
LEFT JOIN recipe_categories rcat
  ON rcat.recipe_id = recipes.recipe_id
LEFT JOIN LATERAL (
  SELECT
    AVG(rating)                                          AS avg_rating,
    COUNT(rating)                                        AS rating_count,
    MAX(rating) FILTER (WHERE author = $1)               AS user_rating
  FROM ratings
  WHERE recipe_id = recipes.recipe_id
) ratings_agg ON true
LEFT JOIN LATERAL (
  SELECT COALESCE(JSON_AGG(json_build_object(
    'id',        rc2.id,
    'cuisine',   c.cuisine,
    'recipe_id', rc2.recipe_id
  )), '[]') AS cuisine
  FROM recipe_cuisines rc2
  JOIN cuisines c ON c.id = rc2.cuisine_id
  WHERE rc2.recipe_id = recipes.recipe_id
) cuisine_agg ON true
LEFT JOIN LATERAL (
  SELECT COALESCE(JSON_AGG(DISTINCT jsonb_build_object(
    'category',    fc.food_category,
    'category_id', fc.id
  )), '[]') AS categories
  FROM recipe_categories rcat2
  JOIN food_categories fc ON fc.id = rcat2.category_id
  WHERE rcat2.recipe_id = recipes.recipe_id
) category_agg ON true
WHERE
  (recipes.public OR recipes.author = $1)
  AND ($5::int IS NULL OR rc.collection_id = $5)
  AND ($2::varchar IS NULL OR $2::varchar <% recipes.name)
  AND ($6::int IS NULL OR rcat.category_id = $6)
  AND ($5::int IS NULL OR col.public OR col."user" = $1)
ORDER BY
  CASE WHEN $2::varchar IS NOT NULL THEN word_similarity($2::varchar, recipes.name) END DESC NULLS LAST,
  ${orderBy}
LIMIT $3
OFFSET $4
      `,
      [userId, search, pageSize + 1, offset, collectionId, category],
    );

    const lastPage = rows.length < pageSize + 1;
    if (!lastPage) rows.pop();

    const recipes = rows.map((recipe) => ({
      ...recipe,
      thumbnailLink: recipe.thumbnail
        ? `${IMAGES_HOST}/${recipe.thumbnail}`
        : null,
    }));

    res.json({ recipes, lastPage });
  }),
);

export default router;
