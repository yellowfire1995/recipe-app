/**
 * tests/collections.spec.js
 *
 * End-to-end tests for the collections feature.
 * Collections are entirely absent from the existing suite.
 *
 * Strategy:
 *   - beforeEach creates a fresh TEST_ recipe via the API
 *   - The "add to collection" test creates a new collection through the UI,
 *     which exercises the customOption branch of the API (creates the
 *     collection and links the recipe in one transaction)
 *   - afterEach cleans up the recipe and any leftover TEST_ collection
 *     via the API — even if the test fails mid-way
 *
 * No new data-testid attributes are required.
 */

import { expect, test } from "@playwright/test";
import { getToken } from "../helpers/getToken.js";

const API = "http://localhost:3000";

test.describe("Collections", () => {
  let recipeId;
  let authToken;
  let collectionName;

  test.beforeEach(async ({ page, request }) => {
    await page.goto("/");
    authToken = await getToken(page);

    const recipe = {
      name: `TEST_Collections_${Date.now()}`,
      servings: 2,
      ingredients: [],
      directions: [],
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
    collectionName = null;
  });

  test.afterEach(async ({ request }) => {
    // Delete the test collection if one was created
    if (collectionName) {
      const namesRes = await request.get(`${API}/collections/names`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (namesRes.ok()) {
        const collections = await namesRes.json();
        const testCollection = collections.find(
          (c) => c.name === collectionName,
        );
        if (testCollection) {
          await request.delete(
            `${API}/collections/delete/collection/${testCollection.id}`,
            {
              headers: { Authorization: `Bearer ${authToken}` },
            },
          );
        }
      }
    }

    // Delete the recipe
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
  // ADD RECIPE TO A NEW COLLECTION
  // -------------------------------------------------------------------------

  /**
   * Exercises the full "add to collection" flow:
   *   recipe view dropdown → "Add to collection" modal → type new collection
   *   name (customOption path) → save → /collections shows the new collection.
   *
   * This hits the customOption branch in the API (INSERT INTO collections +
   * INSERT INTO recipe_collections in one CTE), which is not exercised
   * anywhere else in the suite.
   */
  test("can add a recipe to a new collection and it appears in My Collections", async ({
    page,
  }) => {
    collectionName = `TEST_Coll_${Date.now()}`;

    await page.goto(`/recipes/${recipeId}`);

    // Open the recipe options dropdown
    await page.locator("#options-dropdown").click();

    // The "Add to collection" button opens the collection modal
    await page.getByText("Add to collection").click();

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();

    // The Typeahead input — scope to the modal to avoid grabbing other inputs
    const typeahead = modal.locator('input[placeholder*="collection"]');
    await typeahead.fill(collectionName);

    // After typing, the Typeahead should offer an "Add: ..." option — click it
    await page.getByText(`Add:${collectionName}`).click();

    await modal.getByRole("button", { name: "Save" }).click();

    // The modal shows "Saved!" confirmation before closing
    await expect(modal.getByText("Saved!")).toBeVisible({ timeout: 8_000 });

    // Navigate to collections page and verify the new collection appears
    await page.goto("/collections");
    await expect(page.locator("#root")).toContainText(collectionName);
  });

  // -------------------------------------------------------------------------
  // DELETE A COLLECTION
  // -------------------------------------------------------------------------

  /**
   * Exercises the DeleteCollectionModal:
   *   /collections → click delete on a collection → confirm → collection is gone.
   *
   * We create the collection via the API in the test body so the UI starts
   * from a known state.
   */
  test("can delete a collection from the My Collections page", async ({
    page,
    request,
  }) => {
    collectionName = `TEST_Coll_${Date.now()}`;

    // Create the collection via API so we don't depend on the add-flow UI test
    const addRes = await request.post(
      `${API}/collections/add/recipe/${recipeId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          collection: { customOption: true, name: collectionName },
        }),
      },
    );
    expect(addRes.ok()).toBeTruthy();

    await page.goto("/collections");
    await expect(page.locator("#root")).toContainText(collectionName);

    // Each collection row has a Delete button from DeleteCollectionModal
    // Scope to the row containing our collection name to avoid ambiguity
    const collectionRow = page.locator("li", { hasText: collectionName });
    await page.getByTestId("DeleteForeverIcon").click();

    // Confirm in the modal
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    // await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
    await modal.getByRole("button", { name: "Delete" }).click();

    // After deletion the collection should be gone from the list
    await expect(page.locator("#root")).not.toContainText(collectionName, {
      timeout: 8_000,
    });

    // Mark as already deleted so afterEach skip the API cleanup
    collectionName = null;
  });
});
