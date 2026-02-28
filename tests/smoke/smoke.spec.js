/**
 * tests/smoke/smoke.spec.js
 *
 * Lightweight smoke tests that run against cookbookcalc.com after a deploy.
 * These do NOT mutate any data — read-only checks only.
 *
 * Run with: npx playwright test --project=smoke
 */

import { expect, test } from "@playwright/test";

test.describe("Smoke: Public pages", () => {
  test("homepage loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/CookbookCalc/i);
  });

  test("recipes page loads and shows cards", async ({ page }) => {
    await page.goto("/recipes");
    // Recipe cards should be visible — adjust selector to match your card component
    await expect(page.locator(".card").first()).toBeVisible({ timeout: 10_000 });
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: /log in/i })).toBeVisible();
  });
});

test.describe("Smoke: Authenticated pages", () => {
  test("my recipes page loads", async ({ page }) => {
    await page.goto("/myrecipes");
    // Should either show recipes or an empty state — not a crash
    await expect(page.locator("body")).not.toContainText(/error/i);
  });

  test("new recipe page loads", async ({ page }) => {
    await page.goto("/newrecipe");
    await expect(page.getByLabel("Recipe name")).toBeVisible();
  });

  test("collections page loads", async ({ page }) => {
    await page.goto("/collections");
    await expect(page.locator("body")).not.toContainText(/error/i);
  });
});
