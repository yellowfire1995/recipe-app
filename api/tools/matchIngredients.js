import { findMeasureMatch } from "./findMeasureMatch.js";
import axios from "axios";
import "dotenv/config";
import db from "../database/db.js";

export async function matchIngredients(ingredients) {
  const ingredientArray = await Promise.all(
    ingredients.map(async (ingredient) => {
      try {
        let data;

        //Search on SOLR to find best match
        console.log(ingredient.ingredient);
        const searchResult = await axios.post(
          `${process.env.SOLR_HOST}/solr/allIngredients/select`,
          {
            query: `${ingredient.ingredient}`,
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

        //Obtain ingredient information from databse using search result
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

        //Test to see if there is a match between original measurement and database measurement to convert into grams
        const [measurement, type] = await findMeasureMatch([
          data.rows[0].gram_label.trim(),
          ingredient.measure,
        ]);

        //Create final ingredient structure
        const finalIngredient = {
          ...ingredient,
          ingredient: data.rows[0].description.toLowerCase(),
          fdc_id: data.rows[0].fdc_id,
          convertAmt: data.rows[0].gram_amt,
          amt:
            type == "weight"
              ? Math.round(ingredient.origAmt * measurement)
              : Math.round(
                  (ingredient.origAmt / data.rows[0].gram_amt) * measurement
                ),
          altLabel: data.rows[0].gram_label.trim(),
        };
        return finalIngredient;
      } catch (error) {
        console.log(error);
        return { ...ingredient, amt: 1 };
      }
    })
  );

  return ingredientArray;
}
