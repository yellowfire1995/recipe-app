import axios from "axios";
import "dotenv/config";

export async function searchSolr(ingredient, measure) {
  try {
    const searchResult = await axios.post(
      `${process.env.SOLR_HOST}/solr/allIngredients/select`,
      {
        query: `price:* desc2:raw^2 sr_secondary:${measure} branded_secondary:* ${ingredient} `,
        params: {
          defType: "edismax",
          indent: "true",
          qf: "desc1^5 desc2^3 desc3^3 description^1 brand_name^3 brand_owner^1 upc^1",
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
