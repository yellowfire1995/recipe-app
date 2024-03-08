import axios from "axios";
import * as cheerio from "cheerio";

export default async function getPrice(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);
    const dollars = $("span.Price-characteristic").text();
    const cents = $("span.Price-mantissa").text();
    const totalPrice = dollars + "." + cents;
    console.log(totalPrice);
  } catch (error) {
    console.error(error);
  }
}
