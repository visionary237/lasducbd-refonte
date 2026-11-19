import { defineConfig, devices } from "@playwright/test";
const exe = process.env.CHROME; // ex. /usr/bin/google-chrome si les navigateurs Playwright ne sont pas installés
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 45_000,
  retries: 0,
  use: { baseURL: "http://localhost:4173", launchOptions: exe ? { executablePath: exe } : {} },
  webServer: { command: "npm run start", url: "http://localhost:4173", reuseExistingServer: true, timeout: 120_000 },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
