import express from "express";
const router = express.Router();
import db from "../../database/db.js";
import { getUserId } from "../../tools/getUserId.js";

router.get("/recipes", getUserId, async (req, res) => {
  try {
    const query = {
      text: `select
      array_agg(json_build_object('recipe_id',
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
  group by
      c."name",
      c.id
  `,
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

    console.log(cardData);
    res.send(cardData);
  } catch (error) {
    console.log(error);
  }
});

router.get("/names", getUserId, async (req, res) => {
  try {
    const query = {
      text: `select * from collections c 
      where c.user = $1`,
      values: [req.user.sub],
    };
    const data = await db.query(query);
    res.send(data.rows);
  } catch (error) {
    console.log(error);
  }
});

router.post("/add/recipe/:recipeId", getUserId, async (req, res) => {
  try {
    if (req.body.collection.customOption) {
      const query = {
        text: `with update as (INSERT INTO collections
        ("name", "user")
        VALUES($2, $3)
        returning id)
        INSERT INTO recipe_collections
            (recipe_id, collection_id, "user")
            VALUES($1, (select id from update), $3) `,
        values: [req.params.recipeId, req.body.collection.name, req.user.sub],
      };
      const data = await db.query(query);

      res.send(data);
    } else {
      const query = {
        text: `INSERT INTO recipe_collections
      (recipe_id, collection_id, "user")
      VALUES($1, $2, $3)`,
        values: [req.params.recipeId, req.body.collection.id, req.user.sub],
      };
      const data = await db.query(query);
      res.send(data);
    }
  } catch (error) {
    console.log(error);
  }
});

router.delete(
  "/delete/collection/:collectionId",
  getUserId,
  async (req, res) => {
    try {
      const query = {
        text: ` delete from collections 
      where id = $1 and "user" = $2`,
        values: [req.params.collectionId, req.user.sub],
      };
      const deleter = await db.query(query);

      res.send(deleter);
    } catch (error) {
      console.log(error);
    }
  }
);

router.delete("/delete/recipe", getUserId, async (req, res) => {
  try {
    console.log(req.user.sub);
    const query = {
      text: `delete from recipe_collections 
    where id = any($1::int[]) and "user" = $2 `,
      values: [req.body.ids, req.user.sub],
    };
    const deleter = await db.query(query);
    console.log(deleter);
    res.send(deleter);
  } catch (error) {
    console.log(error);
  }
});

router.post("/edit", getUserId, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
});

export default router;
