import express from "express";
import db from "../../../database/db.js";
import { tryCatch } from "../../../tools/error/tryCatch.js";
const router = express.Router();

router.get(
  "/names",
  tryCatch(async (req, res) => {
    const query = {
      text: `select c.id, name, count(rc.id), c.user, c.public  from collections c 
join recipe_collections rc on rc.collection_id = c.id
where c.user = $1
group by c.id, name

`,
      values: [req.auth.payload.sub],
    };
    const data = await db.query(query);
    res.send(data.rows);
  }),
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
  }),
);

router.post(
  "/edit",
  tryCatch(async (req, res) => {
    const { collection } = req.body;
    if (!collection?.id || !collection?.name) {
      return res.status(400).json({ error: "Invalid collection payload" });
    }

    const roles = `${process.env.AUTH0_NAMESPACE}/roles`;
    const isAdmin = req.auth?.payload[roles]?.includes("Admin");
    const { id, name, public: isPublic } = collection;

    const query = {
      text: `UPDATE collections
                SET "name"=$1::varchar, public=$2
              WHERE id=$3 AND ("user"=$4 OR $5 = true)`,
      values: [
        name,
        isAdmin ? isPublic : false,
        id,
        req.auth.payload.sub,
        isAdmin,
      ],
    };

    const data = await db.query(query);

    if (data.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Collection not found or unauthorized" });
    }

    res.json({ success: true });
  }),
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
  }),
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
  }),
);

export default router;
