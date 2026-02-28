/**
 * tests/recipes.spec.js
 *
 * End-to-end CRUD tests for recipes.
 *
 * Strategy:
 *   - beforeEach creates a fresh TEST_ recipe via the API (fast, no UI)
 *   - Each test works only on that recipe
 *   - afterEach deletes it via the API regardless of pass/fail
 *   - Tests never depend on each other or on pre-existing data
 */

import { expect, test } from "@playwright/test";
import { getToken } from "./helpers/getToken.js";

const API = "http://localhost:3000";

// Minimal recipe payload — matches what newrecipe.js expects
function testRecipePayload(suffix = "") {
  const timestamp = Date.now();
  return {
    name: `TEST_Recipe_${timestamp}${suffix}`,
    servings: 2,
    ingredients: [],
    directions: [],
    cuisine: [],
    category: [],
    public: false, // keep test recipes off the public recipe list
    imgUrl: null,
  };
}

test.describe("Recipe CRUD", () => {
  let testRecipeId;
  let authToken;

  test.beforeEach(async ({ page, request }) => {
    await page.goto("/");
    authToken = await getToken(page);
  
    const recipe = {
      name: `TEST_${Date.now()}`,
      servings: 2,
      ingredients: [],
      directions: [],
      cuisine: [],
      category: [],
      public: false,
      imgUrl: null,
    };

    const res = await request.post("http://localhost:3000/newrecipe", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      multipart: {
        updatedRecipe: JSON.stringify(recipe), // field name must match multer
      },
    });

    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    testRecipeId = data.recipeId;
  });

  test.afterEach(async ({ request }) => {
    if (testRecipeId) {
      await request.delete(
        `http://localhost:3000/recipes/${testRecipeId}/delete`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          data: JSON.stringify({ imgName: null, thumbnailName: null }),
        },
      );
      testRecipeId = null;
    }
  });

  // -------------------------------------------------------------------------
  // VIEW
  // -------------------------------------------------------------------------

  test("can view a recipe page", async ({ page }) => {
    await page.goto(`/recipes/${testRecipeId}`);
    await expect(page.getByTestId("recipe-title")).toContainText("TEST_");
  });

  // -------------------------------------------------------------------------
  // EDIT
  // -------------------------------------------------------------------------

  test("can edit a recipe name", async ({ page }) => {
    await page.goto(`/recipes/${testRecipeId}/edit`);

    // Wait for the form to load with the recipe data
    await expect(page.locator("#recipeName")).toBeVisible();
    const newName = `TEST_Edited_${Date.now()}`;
    await page.locator("#recipeName").clear();
    await page.locator("#recipeName").fill(newName);

    await page.getByRole("button", { name: "Save Recipe" }).click();

    // Should redirect to the recipe view page after saving
    await page.waitForURL(`/recipes/${testRecipeId}`);
    await expect(page.getByText(newName)).toBeVisible();
  });

  test("edit page is unauthorized for recipes you do not own", async ({
    page,
  }) => {
    // Recipe ID 1 is likely owned by someone else in your DB
    // Adjust to a known recipe ID you do NOT own
    await page.goto(`/recipes/128/edit`);
    await expect(page.locator("#root")).toContainText("Unauthorized");
  });

  // -------------------------------------------------------------------------
  // DELETE (from edit page)
  // -------------------------------------------------------------------------

  test("can delete a recipe from the edit page", async ({ page }) => {
    await page.goto(`/recipes/${testRecipeId}/edit`);
    await expect(page.locator("#recipeName")).toBeVisible();

    // Click the danger "Delete Recipe" button at the bottom of the edit form
    await page.getByRole("button", { name: "Delete Recipe" }).click();
    
    // Confirm modal appears
    await expect(
      page.getByText("Are you sure you want to delete this recipe?"),
    ).toBeVisible();

    // Click the confirm Delete button inside the modal footer
    // .last() because there may be multiple "Delete" buttons on the page
    await page.getByRole("button", { name: "Delete" }).last().click();

    // After delete, should navigate away from the edit page
    await page.waitForURL(/\/recipes/);
    await expect(page).not.toHaveURL(`/recipes/${testRecipeId}/edit`);

    // Mark as already deleted so afterEach doesn't try to clean it up again
    testRecipeId = null;
  });

  test("delete modal can be cancelled", async ({ page }) => {
    await page.goto(`/recipes/${testRecipeId}/edit`);
    await expect(page.locator("#recipeName")).toBeVisible();

    await page.getByRole("button", { name: "Delete Recipe" }).click();
    await expect(
      page.getByText("Are you sure you want to delete this recipe?"),
    ).toBeVisible();

    // Cancel — modal should close, still on edit page
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(
      page.getByText("Are you sure you want to delete this recipe?"),
    ).not.toBeVisible();
    await expect(page).toHaveURL(`/recipes/${testRecipeId}/edit`);
  });

  // -------------------------------------------------------------------------
  // DELETE (from recipe view page via dropdown)
  // -------------------------------------------------------------------------

  test("can delete a recipe from the recipe view dropdown", async ({
    page,
  }) => {
    await page.goto(`/recipes/${testRecipeId}`);

    // Open the options dropdown (the h2 toggle with id="options-dropdown")
    await page.locator("#options-dropdown").click();

    // Click Delete Recipe inside the dropdown
    await page.getByText("Delete Recipe").click();

    // Confirm modal
    await expect(
      page.getByText("Are you sure you want to delete this recipe?"),
    ).toBeVisible();
    await page.getByRole("button", { name: "Delete" }).last().click();

    await page.waitForURL(/\/recipes/);
    testRecipeId = null;
  });

  // ---------------------------------------------------------------------------
  // SOLR Ingredient search test
  // ---------------------------------------------------------------------------
  test("can add a new ingredient via modal", async ({ page }) => {
    await page.goto(`/recipes/${testRecipeId}/edit`);

    await page.getByRole("button", { name: "Add ingredient" }).click();

    // Scope everything to the dialog
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();

    await modal.locator('[data-testid="searchBoxOnModal"]').click();
    await modal.locator('[data-testid="searchBoxOnModal"]').fill("1 cup flour");

    await modal.getByRole("button", { name: "Search" }).click();
    await expect(page.locator("select")).toBeVisible();
    await modal.getByRole("button", { name: "Save Changes" }).click();

    await expect(page.locator("#root")).toContainText("flour");
  });
});

// ---------------------------------------------------------------------------
// CREATE — separate describe so it doesn't need beforeEach to pre-create
// ---------------------------------------------------------------------------

test.describe("Create Recipe", () => {
  let createdRecipeId;

  test.afterEach(async ({ request, page }) => {
    if (createdRecipeId) {
      const token = await getToken(page);
      await request.delete(`${API}/recipes/${createdRecipeId}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { imgName: null, thumbnailName: null },
      });
      createdRecipeId = null;
    }
  });

  test("can create a new recipe via the UI", async ({ page }) => {
    await page.goto("/newrecipe");

    const recipeName = `TEST_New_${Date.now()}`;
    await page.locator("#recipeName").fill(recipeName);

    await page.getByRole("button", { name: "Save Recipe" }).click();

    // Should redirect to the new recipe's page
    await page.waitForURL(/\/recipes\/\d+/);

    // Grab the recipe ID from the URL for cleanup
    const url = page.url();
    createdRecipeId = url.match(/\/recipes\/(\d+)/)?.[1];

    await expect(page.getByText(recipeName)).toBeVisible();
  });

  test("create recipe requires a name", async ({ page }) => {
    await page.goto("/newrecipe");

    // Try to save without filling in a name
    await page.getByRole("button", { name: "Save Recipe" }).click();

    // HTML5 validation should prevent submission — still on /newrecipe
    await expect(page).toHaveURL(/\/newrecipe/);
  });
});
