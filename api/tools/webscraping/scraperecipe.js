import * as cheerio from "cheerio";
import { chromium } from "playwright";

async function extractSchemaRecipe({ url, html }) {
  try {
    // const html = await axios.get(url);
    // const browser = await chromium.launch({ headless: true });
    // const page = await browser.newPage();
    // await page.goto(url);
    // const html = await page.content();

    // await browser.close();

    if (!html) {
      const browser = await chromium.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-blink-features=AutomationControlled",
          "--disable-dev-shm-usage",
        ],
      });

      const context = await browser.newContext({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        viewport: { width: 1920, height: 1080 },
        locale: "en-US",
        timezoneId: "America/New_York",
        extraHTTPHeaders: {
          "Accept-Language": "en-US,en;q=0.9",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        },
      });

      // Inject scripts to hide automation
      await context.addInitScript(() => {
        // Remove webdriver property
        Object.defineProperty(navigator, "webdriver", {
          get: () => false,
        });

        // Mock chrome object
        window.chrome = {
          runtime: {},
        };

        // Mock permissions
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.query = (parameters) =>
          parameters.name === "notifications"
            ? Promise.resolve({ state: Notification.permission })
            : originalQuery(parameters);

        // Mock plugins
        Object.defineProperty(navigator, "plugins", {
          get: () => [1, 2, 3, 4, 5],
        });

        // Mock languages
        Object.defineProperty(navigator, "languages", {
          get: () => ["en-US", "en"],
        });
      });

      const page = await context.newPage();

      const response = await page.goto(url);

      var scrapedHtml = await page.content();
    }
    const $ = cheerio.load(html || scrapedHtml);

    const scriptText = JSON.parse(
      $('script[type="application/ld+json"]:first').text(),
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

export default async function getRecipe({ url, html }) {
  if (url && url.match(/(samsungfood)/)) {
    try {
      console.log("scraping samsung food");
      const browser = await chromium.launch({ headless: true });
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
    return extractSchemaRecipe({ url, html });
  }
}
