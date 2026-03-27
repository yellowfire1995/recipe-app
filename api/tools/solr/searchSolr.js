import axios from "axios";
import "dotenv/config";
import { fixIngredient } from "./problemIngredients.js";

export async function searchSolr(ingredient, measure) {
  try {
    const bq = [
      "sr_secondary:*^30",
      "branded_secondary:*^10",
      "sr_secondary:large^5",
      "sr_secondary:pepper",
      "description:raw^2",
      "description:generic^2",
      "description:producer^5",
      "price:*^10",
      ...(measure
        ? [`sr_secondary:"${measure}"^12`, `branded_secondary:"${measure}"^3`]
        : []),
    ];

    const correctedIngredient = fixIngredient(ingredient);

    // const fuzzyQuery = ingredient
    //   .toString()
    //   .split(" ")
    //   .map((word) => (word.length > 4 ? `${word}~1` : word))
    //   .join(" ");

    const query = {
      query: correctedIngredient,
      params: {
        defType: "edismax",
        qf: "description^10 upc brand_name brand_owner desc1^5 sr_secondary^5 branded_secondary^3",
        pf: "description^20 sr_secondary^40 desc1^10",
        ps: "2",
        tie: "0.1",
        rows: "25",
        "q.op": "OR",
        stopwords: "false",
        boost: "if(exists(upc),0.5,1.2)",
        bq,
      },
    };

    const searchResult = await axios.post(
      `${process.env.SOLR_HOST}/solr/allIngredients/select`,
      query,
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
