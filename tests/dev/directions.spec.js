/**
 * tests/directions.spec.js
 *
 * Tests for adding and editing directions on a recipe.
 * The directions feature is entirely absent from the existing suite.
 *
 * Two code paths under test:
 *   addNewDirection  — appends a blank step, mutates via "Add New Step" button
 *   handleDirectionsUpdate — updates a step's text in-place via onChange
 *
 * No new data-testid attributes are required: the textarea uses
 * id={direction.step_num} (an integer), and every Delete button in the
 * direction list carries aria-label="delete". Role/text selectors cover
 * the rest.
 */

import { expect, test } from "@playwright/test";
import { getToken } from "../helpers/getToken.js";

const API = "http://localhost:3000";

test.describe("Direction editing", () => {
  let recipeId;
  let authToken;

  test.beforeEach(async ({ page, request }) => {
    await page.goto("/");
    authToken = await getToken(page);

    const recipe = {
      name: `TEST_Directions_${Date.now()}`,
      servings: 2,
      // Seed one existing direction so edit tests have something to mutate
      directions: [{ step: "Mix the dry ingredients.", step_num: 1 }],
      ingredients: [],
      cuisine: [],
      category: [],
      public: false,
      imgUrl: null,
    };

    const res = await request.post(`${API}/newrecipe`, {
      headers: { Authorization: `Bearer ${authToken}` },
      multipart: { updatedRecipe: JSON.stringify(recipe) },
    });

    expect(res.ok()).toBeTruthy();
    recipeId = (await res.json()).recipeId;
  });

  test.afterEach(async ({ request }) => {
    if (recipeId) {
      await request.delete(`${API}/recipes/${recipeId}/delete`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        data: JSON.stringify({ imgName: null, thumbnailName: null }),
      });
      recipeId = null;
    }
  });

  // -------------------------------------------------------------------------
  // ADD NEW DIRECTION STEP
  // -------------------------------------------------------------------------

  /**
   * Exercises addNewDirection() → save → view-page round-trip.
   * This is the primary untested code path for directions.
   */
  test("can add a new direction step and it persists after saving", async ({
    page,
  }) => {
    await page.goto(`/recipes/${recipeId}/edit`);
    await expect(page.locator("#recipeName")).toBeVisible();

    // The seeded step should be present
    await expect(page.locator("textarea").first()).toHaveValue(
      "Mix the dry ingredients.",
    );

    // Add a new blank step
    await page.getByRole("button", { name: "Add New Step" }).click();

    // A second textarea should appear
    const textareas = page.locator("textarea");
    await expect(textareas).toHaveCount(2);

    // Type into the new step
    await textareas.last().fill("Bake at 375°F for 30 minutes.");

    await page.getByRole("button", { name: "Save Recipe" }).click();
    await page.waitForURL(`/recipes/${recipeId}`);

    // Both steps should be visible on the view page
    await expect(page.locator("#root")).toContainText(
      "Mix the dry ingredients.",
    );
    await expect(page.locator("#root")).toContainText(
      "Bake at 375°F for 30 minutes.",
    );
  });

  // -------------------------------------------------------------------------
  // EDIT EXISTING DIRECTION STEP
  // -------------------------------------------------------------------------

  /**
   * Exercises handleDirectionsUpdate() → save → view-page round-trip.
   * The direction text is stored by step_num, so editing and re-saving
   * must map back to the correct row.
   */
  test("can edit an existing direction step and the change persists", async ({
    page,
  }) => {
    await page.goto(`/recipes/${recipeId}/edit`);
    await expect(page.locator("#recipeName")).toBeVisible();

    const textarea = page.locator("textarea").first();
    await expect(textarea).toHaveValue("Mix the dry ingredients.");

    await textarea.clear();
    await textarea.fill("Sift the dry ingredients together.");

    await page.getByRole("button", { name: "Save Recipe" }).click();
    await page.waitForURL(`/recipes/${recipeId}`);

    await expect(page.locator("#root")).toContainText(
      "Sift the dry ingredients together.",
    );
    await expect(page.locator("#root")).not.toContainText(
      "Mix the dry ingredients.",
    );
  });

  // -------------------------------------------------------------------------
  // DELETE A DIRECTION STEP
  // -------------------------------------------------------------------------

  /**
   * Exercises deleteDirection() → save → view-page round-trip.
   * The direction list is re-rendered from React state, so we verify both
   * the immediate DOM removal and the DB persistence.
   *
   * Note: the directions list also has ingredient Delete buttons (aria-label="delete"),
   * but this recipe has no ingredients, so the first matching button is unambiguous.
   */
  test("can delete a direction step and the deletion persists", async ({
    page,
  }) => {
    await page.goto(`/recipes/${recipeId}/edit`);
    await expect(page.locator("#recipeName")).toBeVisible();
    await expect(page.locator("textarea").first()).toHaveValue(
      "Mix the dry ingredients.",
    );

    // The Delete button immediately below the textarea
    await page.getByRole("button", { name: "Delete" }).first().click();

    // Textarea should be gone immediately — no textarea in the directions list
    await expect(page.locator("textarea")).toHaveCount(0);

    await page.getByRole("button", { name: "Save Recipe" }).click();
    await page.waitForURL(`/recipes/${recipeId}`);

    await expect(page.locator("#root")).not.toContainText(
      "Mix the dry ingredients.",
    );
  });
});
