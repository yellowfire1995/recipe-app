import express from "express";
import db from "../../../database/db.js";
import { tryCatch } from "../../../tools/error/tryCatch.js";
const router = express.Router();

router.get(
  "/recipes",
  tryCatch(async (req, res) => {
    const query = {
      text: `select
    array_agg(json_build_object('recipeId',
    r.recipe_id,
    'key',
    rc.id,
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
    r.create_date)) as recipes,
    c."name",
    c.id
from
    recipe_collections rc
join collections c on
    collection_id = c.id
join recipes r on
    r.recipe_id = rc.recipe_id
where rc.user = $1
group by
    c."name",
    c.id

`,
      values: [req.auth.payload.sub],
    };
    const data = await db.query(query);
    const cardData = data.rows.map((collection) => {
      return {
        ...collection,
        recipes: collection.recipes.map((recipe) => {
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
  })
);

router.get(
  "/names",
  tryCatch(async (req, res) => {
    const query = {
      text: `select * from collections c 
      where c.user = $1`,
      values: [req.auth.payload.sub],
    };
    const data = await db.query(query);
    res.send(data.rows);
  })
);

router.post(
  "/add/recipe/:recipeId",
  tryCatch(async (req, res) => {
    if (req.body.collection.customOption) {
      const query = {
        text: `with update as (INSERT INTO collections
        ("name", "user")
        VALUES($2, $3)
        returning id)
        INSERT INTO recipe_collections
            (recipe_id, collection_id, "user")
            VALUES($1, (select id from update), $3) `,
        values: [
          req.params.recipeId,
          req.body.collection.name,
          req.auth.payload.sub,
        ],
      };
      const data = await db.query(query);

      res.send(data);
    } else {
      const query = {
        text: `INSERT INTO recipe_collections
      (recipe_id, collection_id, "user")
      VALUES($1, $2, $3)`,
        values: [
          req.params.recipeId,
          req.body.collection.id,
          req.auth.payload.sub,
        ],
      };
      const data = await db.query(query);
      res.send(data);
    }
  })
);

router.delete(
  "/delete/collection/:collectionId",
  tryCatch(async (req, res) => {
    const query = {
      text: ` delete from collections 
  where id = $1 and "user" = $2`,
      values: [req.params.collectionId, req.auth.payload.sub],
    };
    const deleter = await db.query(query);

    res.send(deleter);
  })
);

router.delete(
  "/delete/recipe",
  tryCatch(async (req, res) => {
    const query = {
      text: `delete from recipe_collections 
    where id = any($1::int[]) and "user" = $2 `,
      values: [req.body.ids, req.auth.payload.sub],
    };
    const deleter = await db.query(query);

    res.send(deleter);
  })
);

export default router;
