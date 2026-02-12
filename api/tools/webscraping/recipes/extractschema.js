import * as cheerio from "cheerio";

export async function extractSchemaRecipe({ html }) {
  try {
    const $ = cheerio.load(html);

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
    throw new Error("Error! Unable to extract recipe.");
  }
}

export async function extractSamsungSchemaRecipe({ html }) {
  try {
    const $ = cheerio.load(html);
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
  } catch (error) {
    console.log(error);
    throw new Error("Error! Unable to extract recipe.");
  }
}
