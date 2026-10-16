import { defineConfig } from '@playwright/test';

// Uses the Chrome already installed on the machine (no browser download). Starts the dev server unless one is already on 3200.
export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  workers: 1,
  use: { baseURL: 'http://localhost:3200', channel: 'chrome' },
  webServer: { command: 'npx next dev -p 3200', url: 'http://localhost:3200', reuseExistingServer: true, timeout: 120_000 },
});
