/**
 * tests/helpers/cleanup.js
 *
 * Deletes any leftover TEST_ recipes in case a test run crashed mid-way
 * and afterEach didn't get to clean up.
 *
 * Usage:
 *   TEST_EMAIL=... TEST_PASSWORD=... node tests/helpers/cleanup.js
 *
 * Or add to package.json:
 *   "test:cleanup": "node tests/helpers/cleanup.js"
 */

import { chromium } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:5173";
const API = "http://localhost:3000";

async function cleanup() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    storageState: "tests/.auth/session.json",
  });
  const page = await context.newPage();

  // Load the app to get the Auth0 token from localStorage
  await page.goto(BASE_URL);
  const token = await page.evaluate(() => {
    const keys = Object.keys(localStorage);
    const auth0Key = keys.find((k) => k.startsWith("@@auth0spajs@@"));
    if (!auth0Key) return null;
    try {
      const session = JSON.parse(localStorage.getItem(auth0Key));
      return session?.body?.access_token ?? null;
    } catch {
      return null;
    }
  });

  if (!token) {
    console.error("Could not get Auth0 token. Run globalSetup first.");
    await browser.close();
    process.exit(1);
  }

  // Fetch all recipes owned by the test user
  const apiContext = await context.request;
  const res = await apiContext.get(`${API}/myrecipes?page=1&pageSize=100&search=TEST_`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok()) {
    console.error("Failed to fetch recipes:", await res.text());
    await browser.close();
    process.exit(1);
  }

  const { recipes } = await res.json();
  const testRecipes = recipes.filter((r) => r.name.startsWith("TEST_"));

  if (testRecipes.length === 0) {
    console.log("No TEST_ recipes to clean up.");
  } else {
    console.log(`Found ${testRecipes.length} TEST_ recipes to delete...`);
    for (const recipe of testRecipes) {
      const del = await apiContext.delete(
        `${API}/recipes/${recipe.recipeId}/delete`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { imgName: recipe.imgUrl, thumbnailName: recipe.thumbnail },
        }
      );
      if (del.ok()) {
        console.log(`  ✓ Deleted: ${recipe.name} (${recipe.recipeId})`);
      } else {
        console.warn(`  ✗ Failed to delete: ${recipe.name} (${recipe.recipeId})`);
      }
    }
  }

  await browser.close();
}

cleanup().catch((err) => {
  console.error(err);
  process.exit(1);
});
