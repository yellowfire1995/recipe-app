import * as cheerio from "cheerio";
import pw from "playwright-core";
import {
  extractSamsungSchemaRecipe,
  extractSchemaRecipe,
} from "./extractschema.js";
import { extractHtml } from "./scraperecipe.js";

export async function extractSamsungHtml({ url }) {
  let html;
  try {
    const browser = await pw.firefox.connect(
      `${process.env.SCRAPER}/firefox/playwright`,
    );
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector("div.s42886");
    // await page.evaluate(() => (document.body.style.zoom = 0.5));
    // await page.waitForSelector("div.s1085.s1286");
    html = await page.content();
    console.log(html);
    await browser.close();

    const $ = cheerio.load(html);
    const samsungExternalLink = $(`a.s46604`).attr(`href`);
    const scrapedHtml = await extractHtml({ url: samsungExternalLink });
    return await extractSchemaRecipe({ html: scrapedHtml });
  } catch (error) {
    return await extractSamsungSchemaRecipe({ html });
  }
}
