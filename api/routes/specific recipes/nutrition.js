import express from "express";
const router = express.Router();
import db from "../../database/db.js";

router.get("/:recipeId", async (req, res) => {
  const recipeId = parseInt(req.params.recipeId);
  const nutritionInfo = await getNutrition(recipeId);
  res.json(nutritionInfo);
});

async function getNutrition(recipeId) {
  const query = {
    text: `with nutrition_data as (select * from crosstab(format('		select 
		i.recipe_id,
		fn.nutrient_id,
		ROUND(SUM(fn.amount*i.amt/100/r.servings)::numeric,1) as amount
		from ingredients i
		left join lateral (select nutrient_id, amount  from food_nutrient fn where i.fdc_id = fn.fdc_id and i.recipe_id = %s) as fn on true
		join recipes r on i.recipe_id = r.recipe_id 
		where nutrient_id in (1110, 1004, 2000, 1093, 1003, 1089, 1079, 1008, 1253, 1005, 1087, 1326, 1162)	
		group by fn.nutrient_id, i.recipe_id', $1::int),
  'values (1110), (1004), (2000), (1093), (1003), (1089), (1079), (1008), (1253), (1005), (1087), (1326), (1162)') 
  as (id int,
  vit_d real,
  tot_fat real,
  sugar real,
  sodium real,
  protein real,
  iron real,
  fiber real,
  kcal real, 
  chol real,
  carb real,
  calcium real,
  sat_fat real,
  vit_c real))
  select 
  coalesce(vit_d,0) as vit_d,
  coalesce(tot_fat,0) as tot_fat,
  coalesce(sugar,0) as sugar,
  coalesce(sodium,0) as sodium,
  coalesce(protein,0) as protein,
  coalesce(iron,0) as iron,
  coalesce(fiber,0) as fiber,
  coalesce(kcal,0) as kcal,
  coalesce(chol,0) as chol,
  coalesce(carb,0) as carb,
  coalesce(calcium,0) as calcium,
  coalesce(sat_fat,0) as sat_fat,
  coalesce(vit_c, 0) as vit_c
  from nutrition_data;`,
    values: [recipeId],
  };

  let data;
  try {
    const client = await db.connect();
    data = await db.query(query);
    client.release();
    return data.rows;
  } catch (error) {
    console.error(error);
  }
}

export default router;
