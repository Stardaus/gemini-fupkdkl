import { test, expect } from '@playwright/test';
import path from 'path';

const artifactsDir = '/Users/nina/.gemini/antigravity-cli/brain/980c9823-2ec8-4070-9584-1c39a00a8a09';

test('capture visual proof screenshots of production build', async ({ page }) => {
  await page.goto('/');

  // 1. Disclaimer Modal
  await expect(page.getByText('Medical Disclaimer & Terms of Use')).toBeVisible();
  await page.screenshot({ path: path.join(artifactsDir, 'app_disclaimer_screenshot.png') });

  // Accept Disclaimer
  await page.getByRole('button', { name: /I Understand & Agree/i }).click();

  // 2. Main Dashboard
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.screenshot({ path: path.join(artifactsDir, 'app_dashboard_screenshot.png') });

  // 3. Filter by Quota Drugs (Option 2 Neon Yellow styling)
  await page.getByRole('button', { name: /Quota Drugs/i }).click();
  await expect(page.getByText('Quota Control').first()).toBeVisible();
  await page.screenshot({ path: path.join(artifactsDir, 'app_quota_drugs_screenshot.png') });
});
