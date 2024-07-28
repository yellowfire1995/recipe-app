import express from "express";
const router = express.Router();
import db from "../../../database/db.js";
import "dotenv/config";
import { searchSolr } from "../../../tools/solr/searchSolr.js";
import { tryCatch } from "../../../tools/error/tryCatch.js";
import { AppError } from "../../../tools/error/AppError.js";

router.post(
  "/search",
  tryCatch(async (req, res) => {
    const searchResult = await searchSolr(req.body.ingredient);
    if (searchResult.length < 0) {
      new AppError(500, "Ingredient search down, please try again later", 500);
    }
    const ingredients = await Promise.all(
      searchResult.map(async (doc) => {
        const query = {
          text: `SELECT description,
      food.fdc_id,
      coalesce(package_grams, 0) as package_grams,
      coalesce(package_cost, 0) as package_cost,
      coalesce(url, '') as url
      ,case 
          when food.data_type = 'branded_food' 
            then bf.gram_modifier
          when food.data_type = 'sr_legacy_food' 
            then fp.gram_modifier end as gram_amt
          ,case 
            when food.data_type = 'branded_food' 
              then bf.alt_label
            when food.data_type = 'sr_legacy_food' 
              then fp.modifier  end as gram_label 
  from food
              left join branded_food bf on bf.fdc_id = food.fdc_id
              left join lateral (select modifier, gram_modifier, fdc_id, min(id) as id from food_portion fp where fp.fdc_id = food.fdc_id group by modifier, gram_modifier, fdc_id limit 1) as fp on fp.fdc_id = food.fdc_id
              left     join lateral (select fdc_id, package_grams, package_cost, url, max(date) from food_prices fps where fps.fdc_id = food.fdc_id group by package_grams, fdc_id, package_cost, url limit 1  ) as fps on fps.fdc_id = food.fdc_id
   
              where
          food.fdc_id in ($1)
        ;
  
        `,
          values: [doc.fdc_id],
        };
        const data = await db.query(query);

        return data.rows[0];
      })
    );

    res.json(ingredients);
  })
);

router.post(
  "/import",
  tryCatch(async (req, res) => {
    const searchResult = await searchSolr(req.body.ingredient);

    const query = {
      text: `SELECT description, food.fdc_id, case 
        when food.data_type = 'branded_food' 
          then bf.gram_modifier
        when food.data_type = 'sr_legacy_food' 
          then fp.gram_modifier end as gram_amt,
          case 
          when food.data_type = 'branded_food' 
            then bf.alt_label
          when food.data_type = 'sr_legacy_food' 
            then fp.modifier  end as gram_label from food
            left join branded_food bf on bf.fdc_id = food.fdc_id
            left join food_portion fp on fp.fdc_id = food.fdc_id
             where
        food.fdc_id = $1
        ;
  
        `,
      values: [searchResult[0].fdc_id],
    };
    const data = await db.query(query);

    res.json(data.rows);
  })
);

router.post(
  "/price",
  tryCatch(async (req, res) => {
    const ingredient = req.body;

    const query = {
      text: `insert into food_prices (fdc_id, package_grams, package_cost, url, user_id) 
      values ( $1, $2, $3, $4, $5 )
        ;
  
        `,
      values: [
        ingredient.fdc_id,
        ingredient.pkgGrms,
        ingredient.pkgCost,
        ingredient.url,
        req.auth.payload.sub,
      ],
    };
    const data = await db.query(query);

    res.json(data.rows);
  })
);

export default router;
