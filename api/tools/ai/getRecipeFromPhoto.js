import { GoogleGenAI } from "@google/genai";

export async function getPhotoFromAi({ photoArray }) {
  const prompt = `You are a recipe extractor. Extract ingredients, directions, and optionally a title and serving count from the provided recipe image.

OUTPUT RULES — follow exactly:
- Output ONLY a valid JSON object. No markdown, no explanation, no text outside the JSON.
- If the image does not contain a recipe, return: {"error": "No recipe found"}

INGREDIENTS:
- List each ingredient on its own entry using this format: QUANTITY UNIT INGREDIENT_NAME
  Example: "1.5 cup all-purpose flour" or "3 large eggs" or "2 tbsp olive oil"
- Use imperial/US units only (oz, lb, cup, tbsp, tsp, fl oz, etc.)
- If both metric and imperial are shown (e.g. "250g / 9 oz"), use only the imperial value
- For whole fruits/vegetables with no specific measurement, omit the unit: "2 apples"
- Preserve brand names exactly as shown (e.g. "1 can Campbell's cream of mushroom soup", "2 tbsp Worcestershire sauce")
- Preserve any modifiers or preparation notes exactly as written (e.g. "1 cup butter, softened", "3 cloves garlic, minced", "2 eggs, divided", "1 cup milk, at room temperature")
- For package sizes, convert to the most common US retail measurement:
  1 pkg cream cheese = 8 oz | 1 pkg dry yeast = 2.25 tsp | 1 pkg frozen spinach = 10 oz
  For unlisted packages, use the most common US retail size

DIRECTIONS:
- Output each step as plain text — no numbers, no bullets, no labels

FORMATTING:
- Join multiple ingredient lines with the two-character sequence \n (backslash + n)
- Join multiple direction lines the same way
- Omit "name" and "servings" keys entirely if not visible in the image

Return format:
{
  "name": "Recipe Title",
  "servings": "4",
  "ingredientString": "1 cup flour\n2 large eggs\n0.5 tsp salt",
  "directionString": "Preheat oven to 350°F\nMix dry ingredients\nBake for 30 minutes"
}`;

  const input = [{ type: "text", text: prompt }];
  photoArray.map((photo) => {
    input.push({
      type: "image",
      data: photo.buffer.toString("base64"),
      mime_type: photo.mimetype,
    });
  });

  const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
  });
  const interaction = await ai.interactions.create({
    model: "gemini-3.1-flash-lite-preview",

    input: input,
  });

  const textOutput = interaction.outputs.find((o) => o.type === "text");
  if (!textOutput) throw new Error("No text output from Gemini");

  const cleaned = textOutput.text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  console.log(cleaned);

  return JSON.parse(cleaned);

  // return {
  //   recipeName: "Blueberry Pie",
  //   ingredientString:
  //     "1 cup sugar\n5 tbsp flour\n1 tsp cinnamon\n4 cups fresh berries\n1/3 tbsp butter",
  //   directionString:
  //     "Place berries (half) in crust lined pie pan.\nPut half of sugar, flour and cinnamon over (sprinkle).\nPut in rest of blueberries.",
  // };
}
