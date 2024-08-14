import express from "express";
import db from "../../../database/db.js";
import { tryCatch } from "../../../tools/error/tryCatch.js";
const router = express.Router();

router.get(
  "/names",
  tryCatch(async (req, res) => {
    const query = {
      text: `select c.id, name, count(rc.id), c.user  from collections c 
join recipe_collections rc on rc.collection_id = c.id
where c.user = $1
group by c.id, name

`,
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
