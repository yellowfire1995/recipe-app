import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env" });

// Use an absolute path so it works regardless of where you run playwright from
const SESSION_PATH = path.join(import.meta.dirname, "tests/.auth/session.json");

export default defineConfig({
  testDir: "./tests",

  // Shared DB state — don't run tests at the same time
  fullyParallel: false,
  workers: 1,

  // Retry once on flakiness (Auth0 redirects, network timing)
  retries: 1,

  reporter: [["html", { open: "on-failure" }], ["list"]],

  use: {
    baseURL: process.env.BASE_URL || "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",

    // Auth0 redirects can be slow
    actionTimeout: 15_000,
    navigationTimeout: 20_000,
  },

  projects: [
    // 1. Login once and save the session — no storageState here, file doesn't exist yet
    {
      name: "setup",
      testMatch: "**/globalSetup.js",
    },

    // 2. Full dev tests — reuses the saved Auth0 session
    {
      name: "dev",
      testMatch: "recipes.spec.js",
      use: {
        ...devices["Desktop Chrome"],
        storageState: SESSION_PATH,
      },
      dependencies: ["setup"],
    },

    // 3. Smoke tests against prod — run manually or after deploy
    {
      name: "smoke",
      testMatch: "**/smoke/*.spec.js",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "https://cookbookcalc.com",
        storageState: SESSION_PATH,
      },
    },
  ],
});
