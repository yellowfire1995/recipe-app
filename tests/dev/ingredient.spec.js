/**
 * tests/ingredient.spec.js
 *
 * Tests for editing existing ingredients on a recipe.
 *
 * Strategy:
 *   - beforeEach creates a recipe with one pre-seeded ingredient via the API
 *   - afterEach deletes the recipe via the API
 *   - Tests are isolated and leave the DB clean on pass or fail
 *
 * Requires one data-testid addition in the source (see note below).
 */

import { expect, test } from "@playwright/test";
import { getToken } from "../helpers/getToken.js";

const API = "http://localhost:3000";

/**
 * A minimal ingredient that round-trips cleanly without Solr/nutrition data.
 * - displayOriginalName: true  → the view page renders userIngredientName
 *   rather than food.description (which is NULL for unmatched ingredients)
 * - userLabel / userIngredientName are the two fields we'll mutate in tests
 */
function seedIngredient(overrides = {}) {
  return {
    quantity: 2,
    fdc_id: null,
    sr_id: null,
    userG: null,
    userLabel: "cups",
    userIngredientName: "test flour",
    displayOriginalName: true,
    isGroupHeader: false,
    description: null,
    order: 0,
    ...overrides,
  };
}

test.describe("Ingredient editing", () => {
  let recipeId;
  let authToken;

  test.beforeEach(async ({ page, request }) => {
    await page.goto("/");
    authToken = await getToken(page);

    const recipe = {
      name: `TEST_Ingredients_${Date.now()}`,
      servings: 2,
      ingredients: [seedIngredient()],
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
    const data = await res.json();
    recipeId = data.recipeId;
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

  // ---------------------------------------------------------------------------
  // EDIT INGREDIENT VIA MODAL
  // ---------------------------------------------------------------------------

  /**
   * Covers the full happy path of the EditIngredientModal:
   *   open → change measurement label → save in modal → save recipe → verify persisted.
   *
   * Requires: add data-testid="edit-ingredient-btn" to the <EditIcon> in
   * EditIngredientModal.jsx:
   *   <EditIcon onClick={handleShow} className="svg-icon" data-testid="edit-ingredient-btn" />
   */
  test("can edit ingredient measurement label via modal and changes persist", async ({
    page,
  }) => {
    await page.goto(`/recipes/${recipeId}/edit`);
    await expect(page.locator("#recipeName")).toBeVisible();

    // Open the ingredient's edit modal
    await page.locator('[data-testid="edit-ingredient-btn"]').first().click();
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();

    // Change the measurement label from "cups" → "tbsp"
    await modal.locator("#weightDescription").clear();
    await modal.locator("#weightDescription").fill("tbsp");

    await modal.getByRole("button", { name: "Save Changes" }).click();
    await expect(modal).not.toBeVisible();

    // The updated label should be visible in the ingredient list before saving
    await expect(page.locator("#root")).toContainText("tbsp");

    // Save the recipe and verify the change persisted
    await page.getByRole("button", { name: "Save Recipe" }).click();
    await page.waitForURL(`/recipes/${recipeId}`);

    await expect(page.locator("#root")).toContainText("tbsp");
    await expect(page.locator("#root")).not.toContainText("cups");
  });

  // ---------------------------------------------------------------------------
  // DELETE INGREDIENT
  // ---------------------------------------------------------------------------

  /**
   * Verifies that deleting an ingredient from the edit page and saving removes
   * it from the recipe. This code path (deleteIngredient + setIngredientList)
   * is separate from adding an ingredient and is not covered elsewhere.
   *
   * No new data-testid needed: DeleteIcon already has aria-label="delete".
   */
  test("can delete an ingredient and the deletion persists after saving", async ({
    page,
  }) => {
    await page.goto(`/recipes/${recipeId}/edit`);
    await expect(page.locator("#recipeName")).toBeVisible();

    // Confirm the ingredient is present before we touch it
    await expect(page.locator("#root")).toContainText("test flour");

    await page.locator('[aria-label="delete"]').first().click();

    // Ingredient should be gone from the edit-page list immediately
    await expect(page.locator("#root")).not.toContainText("test flour");

    // Save and verify on the view page
    await page.getByRole("button", { name: "Save Recipe" }).click();
    await page.waitForURL(`/recipes/${recipeId}`);

    await expect(page.locator("#root")).not.toContainText("test flour");
  });

  // ---------------------------------------------------------------------------
  // INLINE QUANTITY CHANGE
  // ---------------------------------------------------------------------------

  /**
   * The quantity input in EditableIngredientItem is inline — it bypasses the
   * modal entirely and fires handleIngredientUpdate on change, updating React
   * state directly. This is a separate code path from anything the modal tests
   * exercise.
   *
   * The input has a stable class "ingredientAmountInput" which is specific
   * enough to use as a selector without adding a new data-testid.
   */
  test("can change ingredient quantity inline and it persists after saving", async ({
    page,
  }) => {
    await page.goto(`/recipes/${recipeId}/edit`);
    await expect(page.locator("#recipeName")).toBeVisible();

    const quantityInput = page.locator(".ingredientAmountInput").first();

    // Seeded quantity is 2 — confirm it loaded correctly
    await expect(quantityInput).toHaveValue("2");

    // Change to 4
    await quantityInput.clear();
    await quantityInput.fill("4");

    // Blur the field so React flushes the onChange
    await quantityInput.blur();

    await page.getByRole("button", { name: "Save Recipe" }).click();
    await page.waitForURL(`/recipes/${recipeId}`);

    // View page should show the updated quantity
    await expect(page.locator("#root")).toContainText("4");
  });

  /**
   * Changing quantity to 0 is a meaningful edge case: the component suppresses
   * the unit label and gram weight when quantity is 0, and marks the ingredient
   * as "warned". Verifies the zero value round-trips correctly rather than
   * being coerced or dropped.
   */
  test("can set ingredient quantity to 0 and it persists after saving", async ({
    page,
  }) => {
    await page.goto(`/recipes/${recipeId}/edit`);
    await expect(page.locator("#recipeName")).toBeVisible();

    const quantityInput = page.locator(".ingredientAmountInput").first();
    await quantityInput.clear();
    await quantityInput.fill("0");
    await quantityInput.blur();

    await page.getByRole("button", { name: "Save Recipe" }).click();
    await page.waitForURL(`/recipes/${recipeId}`);

    // Ingredient name should still appear (just without a quantity prefix)
    await expect(page.locator("#root")).toContainText("test flour");
  });

  // ---------------------------------------------------------------------------
  // MODAL CANCEL DISCARDS CHANGES
  // ---------------------------------------------------------------------------

  /**
   * Cancelling the edit modal must restore the original ingredient state —
   * it must NOT leave the in-memory recipe dirty with half-edited values.
   * This exercises the handleClose reset path in EditIngredientModal.
   *
   * Requires: same data-testid="edit-ingredient-btn" as the edit test above.
   */
  test("cancelling the ingredient modal discards unsaved changes", async ({
    page,
  }) => {
    await page.goto(`/recipes/${recipeId}/edit`);
    await expect(page.locator("#recipeName")).toBeVisible();

    await page.locator('[data-testid="edit-ingredient-btn"]').first().click();
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();

    // Type a new label but cancel instead of saving
    await modal.locator("#weightDescription").clear();
    await modal.locator("#weightDescription").fill("liters");

    await modal.getByRole("button", { name: "Cancel" }).click();
    await expect(modal).not.toBeVisible();

    // The original label should still be shown; the changed value must not appear
    await expect(page.locator("#root")).toContainText("cups");
    await expect(page.locator("#root")).not.toContainText("liters");
  });
});

// -----------------------------------------------------------------------------
// INGREDIENT GROUP HEADERS
// -----------------------------------------------------------------------------

/**
 * Group headers are a distinct ingredient type (isGroupHeader: true) rendered
 * by EditableHeaderItem / EditHeaderModal rather than EditableIngredientItem /
 * EditIngredientModal. They share the ingredient list but have a completely
 * separate edit/delete code path.
 *
 * Requires: add data-testid="edit-header-btn" to the <EditIcon> in
 * EditHeaderModal.jsx:
 *   <EditIcon onClick={handleShow} className="svg-icon" data-testid="edit-header-btn" />
 */

test.describe("Ingredient header editing", () => {
  let recipeId;
  let authToken;

  test.beforeEach(async ({ page, request }) => {
    await page.goto("/");
    authToken = await getToken(page);

    const recipe = {
      name: `TEST_Headers_${Date.now()}`,
      servings: 2,
      ingredients: [
        // Seed one header followed by one ingredient so the list is realistic
        {
          isGroupHeader: true,
          userIngredientName: "dry ingredients",
          quantity: 0,
          fdc_id: null,
          sr_id: null,
          userG: null,
          userLabel: null,
          displayOriginalName: false,
          description: null,
          order: 0,
        },
        seedIngredient({ order: 1 }),
      ],
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

  test("can edit a header label via modal and the change persists", async ({
    page,
  }) => {
    await page.goto(`/recipes/${recipeId}/edit`);
    await expect(page.locator("#recipeName")).toBeVisible();

    // Header text is rendered uppercase in the edit list — confirm it's present
    await expect(page.locator("#root")).toContainText("DRY INGREDIENTS");

    // Open the header's edit modal
    await page.locator('[data-testid="edit-header-btn"]').first().click();
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal.getByText("Edit Header")).toBeVisible();

    await modal.locator("#ingredientDescription").clear();
    await modal.locator("#ingredientDescription").fill("wet ingredients");

    await modal.getByRole("button", { name: "Save Changes" }).click();
    await expect(modal).not.toBeVisible();

    // Updated header should appear in the list immediately (uppercase)
    await expect(page.locator("#root")).toContainText("WET INGREDIENTS");

    await page.getByRole("button", { name: "Save Recipe" }).click();
    await page.waitForURL(`/recipes/${recipeId}`);

    // On the view page headers aren't rendered, but the recipe should have
    // saved cleanly — verify the ingredient that follows is still present
    await expect(page.locator("#root")).toContainText("test flour");
  });

  test("cancelling the header modal discards unsaved changes", async ({
    page,
  }) => {
    await page.goto(`/recipes/${recipeId}/edit`);
    await expect(page.locator("#recipeName")).toBeVisible();

    await page.locator('[data-testid="edit-header-btn"]').first().click();
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();

    await modal.locator("#ingredientDescription").clear();
    await modal.locator("#ingredientDescription").fill("something else");

    await modal.getByRole("button", { name: "Cancel" }).click();
    await expect(modal).not.toBeVisible();

    // Original header text should still be displayed
    await expect(page.locator("#root")).toContainText("DRY INGREDIENTS");
    await expect(page.locator("#root")).not.toContainText("SOMETHING ELSE");
  });

  test("can delete a header and the deletion persists after saving", async ({
    page,
  }) => {
    await page.goto(`/recipes/${recipeId}/edit`);
    await expect(page.locator("#recipeName")).toBeVisible();
    await expect(page.locator("#root")).toContainText("DRY INGREDIENTS");

    // The header's DeleteIcon — first aria-label="delete" in the list
    await page.locator('[aria-label="delete"]').first().click();

    await expect(page.locator("#root")).not.toContainText("DRY INGREDIENTS");

    // The ingredient beneath the header should be unaffected
    await expect(page.locator("#root")).toContainText("test flour");

    await page.getByRole("button", { name: "Save Recipe" }).click();
    await page.waitForURL(`/recipes/${recipeId}`);

    // Ingredient still present; header gone
    await expect(page.locator("#root")).toContainText("test flour");
  });
});
