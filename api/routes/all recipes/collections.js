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
    res.send(data.rows);
    console.log(data.rows);
  } catch (error) {
    console.log(error);
  }
});

export default router;
