import { findMeasureMatch } from "./findMeasureMatch.js";
import "dotenv/config";
import db from "../database/db.js";
import { searchSolr } from "./searchSolr.js";

export async function matchIngredients(ingredients) {
  const ingredientArray = await Promise.all(
    ingredients.map(async (ingredient) => {
      try {
        //Search on SOLR to find best match
        const searchResult = await searchSolr(ingredient.ingredient);

        //Obtain ingredient information from database using search result
        const ingredients = await Promise.all(
          searchResult.map(async (doc) => {
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
                  then fp.modifier  end as gram_label,
                case 
                	when food.data_type = 'sr_legacy_food'
                	then fp.id
                end as sr_id                
                  from food
                  left join branded_food bf on bf.fdc_id = food.fdc_id
                  left join food_portion fp on fp.fdc_id = food.fdc_id
                   where
              food.fdc_id = $1 and (id is null or id = $2)
              ;
              `,
              values: [doc.fdc_id, doc.sr_id],
            };
            const data = await db.query(query);

            //Test to see if there is a match between original measurement and database measurement to convert into grams
            const [measurement, type] = await findMeasureMatch([
              data.rows[0].gram_label?.trim(),
              ingredient.measure,
            ]);

            //Create final ingredient structure
            const finalIngredient = {
              ...ingredient,
              ingredient: data.rows[0].description.toLowerCase(),
              fdc_id: data.rows[0].fdc_id,
              sr_id: data.rows[0].sr_id,
              convertAmt: data.rows[0].gram_amt,
              amt:
                type == "weight"
                  ? Math.round(ingredient.origAmt * measurement)
                  : Math.round(
                      (ingredient.origAmt / data.rows[0].gram_amt) * measurement
                    ),
              altLabel: data.rows[0].gram_label?.trim(),
            };
            return finalIngredient;
          })
        );

        return ingredients;
      } catch (error) {
        console.log(error);
        return { ...ingredient, amt: 1 };
      }
    })
  );

  return ingredientArray;
}
