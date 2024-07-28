import { findMeasureMatch } from "./findMeasureMatch.js";
import "dotenv/config";
import db from "../../database/db.js";
import { searchSolr } from "../solr/searchSolr.js";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../error/AppError.js";

export async function matchIngredients(ingredients) {
  try {
    const ingredientArray = await Promise.all(
      ingredients.map(async (ingredient, idx) => {
        if (ingredient.isGroupHeader) {
          return [
            {
              ...ingredient,
              quantity: 0,
              nutrients: [],
              userLabel: ingredient.description,
              id: uuidv4(),
            },
          ];
        } else {
          try {
            //Search on SOLR to find best match
            const searchResult = await searchSolr(
              ingredient.description,
              ingredient.unitOfMeasureID
            );

            //Obtain ingredient information from database using search result
            const ingredients = await Promise.all(
              searchResult.map(async (doc) => {
                const query = {
                  text: `SELECT (select json_agg(json_build_object(fn.nutrient_id, fn.amount, 'name', n."name"))
                from food_nutrient fn 
                    join nutrient n on fn.nutrient_id = n.id 
                    where nutrient_id in (1110, 1004, 2000, 1093, 1003, 1089, 1079, 1008, 1253, 1005, 1087, 1258, 1162) and fn.fdc_id =  food.fdc_id) as nutrients,              
                food.description, food.fdc_id, case 
                when food.data_type = 'branded_food' 
                  then coalesce(bf.gram_modifier, um.grams)
                when food.data_type = 'sr_legacy_food' 
                  then fp.gram_modifier end as gram_amt,
                  case 
                  when food.data_type = 'branded_food' 
                    then coalesce(bf.alt_label, um.description)
                  when food.data_type = 'sr_legacy_food' 
                    then fp.modifier  end as gram_label,
                  case 
                    when food.data_type = 'sr_legacy_food'
                    then fp.id
                  end as sr_id,
                  case 
                  when food.data_type = 'branded_food' 
                    then coalesce(bf.branded_food_category, null) 
                  end as category
                    from food
                    left join branded_food bf on bf.fdc_id = food.fdc_id
                    left join food_portion fp on fp.fdc_id = food.fdc_id
                    left join user_measures um on um.fdc_id = food.fdc_id 
                     where
                food.fdc_id = $1 and (fp.id is null or fp.id = $2)
                ;
                `,
                  values: [doc.fdc_id, doc.sr_id],
                };
                const data = await db.query(query);

                //Test to see if there is a match between original measurement and database measurement to convert into grams
                const weightConversion = await findMeasureMatch(
                  ingredient.unitOfMeasureID?.trim(),
                  data.rows[0].gram_label?.trim(),
                  data.rows[0].gram_amt
                );

                //Create final ingredient structure
                const finalIngredient = {
                  ...ingredient,
                  category: data.rows[0].category,
                  quantity:
                    Math.round(
                      (ingredient.quantity /
                        (weightConversion
                          ? weightConversion
                          : data.rows[0].gram_amt
                          ? data.rows[0].gram_amt
                          : 1)) *
                        100
                    ) / 100,
                  id: uuidv4(),
                  description: data.rows[0].description.toLowerCase(),
                  fdc_id: data.rows[0].fdc_id,
                  sr_id: data.rows[0].sr_id,
                  gramConversion: weightConversion
                    ? weightConversion
                    : data.rows[0].gram_amt
                    ? data.rows[0].gram_amt
                    : null,
                  matchedMeasure: weightConversion
                    ? ingredient.unitOfMeasure
                    : data.rows[0].gram_label
                    ? data.rows[0].gram_label
                    : null,
                  userLabel: weightConversion ? ingredient.unitOfMeasure : null,
                  userG: weightConversion ? weightConversion : null,
                  nutrients: data.rows[0].nutrients ?? [],
                };

                return finalIngredient;
              })
            );

            return ingredients;
          } catch (error) {
            console.log(error);
            return { ...ingredient, amt: 1 };
          }
        }
      })
    );

    return ingredientArray;
  } catch (error) {
    new AppError(400, "Error parsing ingredients", 400);
  }
}
