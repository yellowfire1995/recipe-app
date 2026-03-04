import { GoogleGenAI } from "@google/genai";
const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;

export async function getPhotoFromAi({ photoArray }) {
  const prompt = `You are a recipe extractor. Your task is to extract ingredients and directions from a recipe image. If a title or number of servings exists extract that as well.

CRITICAL RULES:

    Output ONLY a JSON object - nothing else

    For each ingredient, output on its own line in this format: [QUANTITY] [UNIT] [INGREDIENT NAME]

    For measurements: ALWAYS use imperial/US units ONLY (oz, lb, cup, tbsp, tsp, etc.)

    If you see both metric and imperial (like "250g/9 oz"), output ONLY the imperial version as a number with unit

    For directions: output each step on its own line, with NO numbers or bullets

    Separate multiple lines with \n character (backslash-n, not an actual line break)

    Return valid JSON with keys "ingredientText" and "directionText" and if applicable "recipeName" and "servings"

Return format:
{
"ingredientText": "[ingredient line 1]\n[ingredient line 2]\n[ingredient line 3]",
"directionText": "[direction line 1]\n[direction line 2]\n[direction line 3]"
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
    project: "recipeapp-421500",
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

  return JSON.parse(cleaned);
}
