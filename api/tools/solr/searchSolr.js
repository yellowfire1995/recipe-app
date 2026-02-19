import axios from "axios";
import "dotenv/config";

export async function searchSolr(ingredient, measure) {
  try {
    const ingredientString = ingredient.toString();
    const addFuzzySearch = ingredientString
      .split(" ")
      .map((word) => word + "~")
      .join(" ");

    console.log(ingredientString);
    const searchResult = await axios.post(
      `${process.env.SOLR_HOST}/solr/allIngredients/select`,
      {
        query: `${ingredientString} ${
          measure
            ? `sr_secondary:"${measure}"^10 branded_secondary:"${measure}"^5 price:*^10`
            : ""
        } sr_secondary:*^20 branded_secondary:*^10 description:raw^2`,
        params: {
          defType: "edismax",
          indent: "true",
          qf: "description^10 upc brand_name brand_owner",
          rows: "25",
          "q.op": "OR",
          stopwords: "false",
        },
      },
      { "content-type": "application/x-www-form-urlencoded" },
    );
    return searchResult.data.response.docs;
  } catch (error) {
    console.error(error);
  }
}

// const searchResult = await axios.post(
//   `${process.env.SOLR_HOST}/solr/allIngredients/select`,
//   {
//     query: `price:* description:raw^2 sr_secondary:${measure}^10 sr_secondary:*^6 branded_secondary:${"*"} desc1:${ingredient.toString()}^5  ${ingredient.toString()}`,
//     params: {
//       defType: "edismax",
//       indent: "true",
//       qf: "desc1^5 desc2^3 desc3^3 description^5 brand_name^3 brand_owner^1 upc^1",
//       "q.op": "OR",
//       stopwords: "false",
//     },
//   },
//   { "content-type": "application/x-www-form-urlencoded" }
// );
