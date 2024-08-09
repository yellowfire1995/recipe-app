import axios from "axios";
import "dotenv/config";

export async function searchSolr(ingredient, measure) {
  try {
    console.log(measure);
    const ingredientString = ingredient.toString();
    const addFuzzySearch = ingredientString
      .split(" ")
      .map((word) => word + "~")
      .join(" ");

    const searchResult = await axios.post(
      `${process.env.SOLR_HOST}/solr/allIngredients/select`,
      {
        query: `price:* description:raw^2 sr_secondary:${measure}^10 sr_secondary:*^6 branded_secondary:${"*"} desc1:${ingredient.toString()}^5  ${ingredient.toString()}`,
        params: {
          defType: "edismax",
          indent: "true",
          qf: "desc1^5 desc2^3 desc3^3 description^5 brand_name^3 brand_owner^1 upc^1",
          "q.op": "OR",
          stopwords: "false",
        },
      },
      { "content-type": "application/x-www-form-urlencoded" }
    );

    return searchResult.data.response.docs;
  } catch (error) {
    console.error(error);
  }
}
