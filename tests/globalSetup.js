import { expect, test } from "@playwright/test";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const SESSION_PATH = path.join(__dirname, ".auth", "session.json");

function isSessionValid() {
  if (!fs.existsSync(SESSION_PATH)) return false;

  try {
    const session = JSON.parse(fs.readFileSync(SESSION_PATH, "utf-8"));

    for (const origin of session?.origins ?? []) {
      for (const item of origin.localStorage ?? []) {
        if (!item.name.startsWith("@@auth0spajs@@")) continue;
        if (item.name.endsWith("@@user@@")) continue;

        const data = JSON.parse(item.value);
        const expiresAt = data?.expiresAt;

        if (expiresAt && Date.now() / 1000 < expiresAt) {
          console.log("✓ Session still valid, skipping login");
          return true;
        }
      }
    }
  } catch {
    return false;
  }

  return false;
}

test("authenticate and save session", async ({ page }) => {
  if (isSessionValid()) return;

  fs.mkdirSync(path.dirname(SESSION_PATH), { recursive: true });

  await page.goto("http://localhost:5173/");

  await page.getByRole("button", { name: "Log in/Sign Up" }).click();
  await page
    .getByText("Username or email address *")
    .fill(process.env.TEST_USER);
  await page
    .getByRole("textbox", { name: "Password" })
    .fill(process.env.TEST_PASSWORD);
  await page.getByRole("button", { name: "Continue", exact: true }).click();

  await page.waitForURL(/localhost/, { timeout: 20_000 });

  await page.waitForFunction(
    () => {
      const keys = Object.keys(localStorage);
      return keys.some((k) => k.startsWith("@@auth0spajs@@"));
    },
    { timeout: 15_000 },
  );

  await expect(page.locator("nav")).toBeVisible({ timeout: 10_000 });

  await page.context().storageState({ path: SESSION_PATH });
  console.log("✓ Auth0 session saved to", SESSION_PATH);
});
