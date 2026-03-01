/**
 * tests/smoke/smoke.spec.js
 *
 * Lightweight smoke tests that run against cookbookcalc.com after a deploy.
 * These do NOT mutate any data — read-only checks only.
 *
 * Run with: npx playwright test --project=smoke
 */

import { expect, test } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

test.describe("Smoke: Public pages", () => {
  test("homepage loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/CookbookCalc/i);
  });

  test("recipes page loads and shows cards", async ({ page }) => {
    await page.goto("/recipes");
    // Recipe cards should be visible — adjust selector to match your card component
    await expect(page.locator(".card").first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });
});

test.describe("Smoke: Authenticated pages", () => {
  test("smoke test authenticated pages", async ({ page }) => {
    await page.goto("https://cookbookcalc.com/");

    const popupPromise = page.waitForEvent("popup");
    await page.getByRole("button", { name: "Log in/Sign Up" }).click();
    const popup = await popupPromise;

    await popup.waitForLoadState("domcontentloaded");

    await popup
      .getByRole("textbox", { name: "Username or email address" })
      .fill(process.env.COOKBOOKCALC_USER);
    await popup
      .getByRole("textbox", { name: "Password" })
      .fill(process.env.COOKBOOKCALC_PASSWORD);
    await popup.getByRole("button", { name: "Continue", exact: true }).click();

    await popup.waitForEvent("close", { timeout: 20_000 }).catch(() => {});
    await page.waitForURL(/cookbookcalc.com/, { timeout: 20_000 });
    await page.waitForFunction(
      () => {
        const keys = Object.keys(localStorage);
        return keys.some((k) => k.startsWith("@@auth0spajs@@"));
      },
      { timeout: 15_000 },
    );

    await expect(page.locator("nav")).toBeVisible({ timeout: 10_000 });

    await page.goto("/recipes/384");
    await expect(page.locator("#options-dropdown")).toContainText(
      "TEST_RECIPE",
    );
    await page.goto("/recipes/384/edit");
    await page.getByRole("button", { name: "Save Recipe" }).click();
    await expect(page).not.toHaveURL(`/recipes/384/edit`);
    await page.goto("/newrecipe");
    await expect(page.locator("#importURL")).toBeVisible();
  });

  // test("new recipe page loads", async ({ page }) => {
  //   await expect(page.getByLabel("Recipe name")).toBeVisible();
  // });

  // test("collections page loads", async ({ page }) => {
  //   await page.goto("/collections");
  //   await expect(page.locator("body")).not.toContainText(/error/i);
  // });
});
