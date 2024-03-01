import express from "express";
const router = express.Router();
import db from "../../database/db.js";
import axios from "axios";
import "dotenv/config";

router.post("/search", async (req, res) => {
  let data;

  try {
    const searchResult = await axios.post(
      `${process.env.SOLR_HOST}/solr/allIngredients/select`,
      {
        query: `${req.body.ingredient}~`,
        params: {
          defType: "edismax",
          indent: "true",
          qf: "desc1^5 desc2^3 desc3^3 description^1",
          "q.op": "OR",
          lowercaseOperators: "true",
          stopwords: "false",
        },
      },
      { "content-type": "application/x-www-form-urlencoded" }
    );
    let ingredientFdcIdArray = [];
    await searchResult.data.response.docs.map((doc) =>
      ingredientFdcIdArray.push(doc.fdc_id)
    );
    console.log(ingredientFdcIdArray);
    const client = await db.connect();
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
          food.fdc_id in ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ;
  
        `,
      values: ingredientFdcIdArray,
    };
    data = await db.query(query);
    client.release();
    res.json(data.rows);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

router.post("/import", async (req, res) => {
  let data;

  try {
    const searchResult = await axios.post(
      `${process.env.SOLR_HOST}/solr/allIngredients/select`,
      {
        query: `${req.body.ingredient}~`,
        params: {
          defType: "edismax",
          indent: "true",
          qf: "desc1^5 desc2^3 desc3^3 description^1",
          "q.op": "OR",
          lowercaseOperators: "true",
          stopwords: "false",
        },
      },
      { "content-type": "application/x-www-form-urlencoded" }
    );

    const client = await db.connect();
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
      values: [searchResult.data.response.docs[0].fdc_id],
    };
    data = await db.query(query);
    client.release();
    res.json(data.rows);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

router.post("/price", async (req, res) => {
  let data;
  const i = req.body;

  try {
    const client = await db.connect();
    const query = {
      text: `insert into food_prices (fdc_id, package_grams, package_cost, url) 
      values ( $1, $2, $3, $4 )
        ;
  
        `,
      values: [i.fdc_id, i.pkgGrms, i.pkgCost, i.url],
    };
    data = await db.query(query);
    client.release();
    res.json(data.rows);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

export default router;
