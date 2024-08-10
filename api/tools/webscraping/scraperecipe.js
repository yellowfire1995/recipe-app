import axios from "axios";
import * as cheerio from "cheerio";
import { chromium } from "playwright";

async function extractSchemaRecipe(url) {
  try {
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);

    const scriptText = JSON.parse(
      $('script[type="application/ld+json"]:first').text()
    );

    if (
      Array.isArray(scriptText) &&
      /recipe/i.test(scriptText[0]["@type"][0])
    ) {
      const recipe = scriptText[0];

      return recipe;
    } else if (scriptText["@graph"]) {
      return scriptText["@graph"].filter((graph) => {
        if (/recipe/i.test(graph["@type"])) {
          return graph;
        }
      })[0];
    } else {
      return scriptText;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error! Recipe not found.");
  }
}

async function extractSamsungRecipe($) {
  $("div.s40574").remove();

  const ingredientList = $('span[data-testid="recipe-ingredient"]')
    .toArray()
    .map(($ingredient) => {
      return $($ingredient).text();
    });

  const directionList = $("span.s39646")
    .toArray()
    .map(($direction) => {
      return { "@type": "HowToStep", text: $($direction).text() };
    });

  const recipe = {
    "@type": ["Recipe"],
    recipeIngredient: ingredientList,
    recipeInstructions: directionList,
  };

  return recipe;
}

export default async function getRecipe(url) {
  if (url.match(/(samsungfood)/)) {
    try {
      console.log("scraping samsung food");
      const browser = await chromium.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto(url);
      await page.waitForSelector("div.s39966");
      await page.evaluate(() => (document.body.style.zoom = 0.5));
      await page.waitForSelector("div.s1085.s1286");
      const html = await page.content();
      await browser.close();

      const $ = cheerio.load(html);

      if ($(`a.s39565.s164.s40666`).attr(`href`)) {
        try {
          return extractSchemaRecipe($(`a.s39565.s164.s40666`).attr(`href`));
        } catch (error) {
          console.log(error);
        } finally {
          return extractSamsungRecipe($);
        }
      } else {
        return extractSamsungRecipe($);
      }
    } catch (error) {
      console.log(error);
      throw new Error("Failed to scrape samsung food.");
    }
  } else {
    return extractSchemaRecipe(url);
  }
}
