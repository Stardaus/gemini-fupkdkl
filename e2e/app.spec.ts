import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Formulari Ubat PKD Kuala Langat v2 PWA', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays first-visit disclaimer and allows acceptance', async ({ page }) => {
    const disclaimerHeading = page.getByRole('heading', {
      name: /Medical Disclaimer & Terms of Use/i,
    });
    await expect(disclaimerHeading).toBeVisible();

    const acceptBtn = page.getByRole('button', {
      name: /I Understand & Agree/i,
    });
    await acceptBtn.click();

    await expect(disclaimerHeading).not.toBeVisible();
  });

  test('executes multi-field fuzzy search and filters medications', async ({ page }) => {
    // Accept disclaimer first
    await page.getByRole('button', { name: /I Understand & Agree/i }).click();

    // Type in search bar
    const searchInput = page.getByRole('textbox', { name: /Search medications/i });
    await searchInput.fill('amlodpine'); // Typo test

    await expect(page.getByText(/Amlodipine/i).first()).toBeVisible();
  });

  test('toggles quick filters for quota-controlled medications', async ({ page }) => {
    await page.getByRole('button', { name: /I Understand & Agree/i }).click();

    const quotaFilterBtn = page.getByRole('button', {
      name: /Quota Drugs/i,
    });
    await quotaFilterBtn.click();

    await expect(page.getByText(/Quota Control/i).first()).toBeVisible();
  });

  test('opens medication details modal and verifies Quest3+ link', async ({ page }) => {
    await page.getByRole('button', { name: /I Understand & Agree/i }).click();

    // Click first medication card
    const firstMedCard = page.getByRole('button', { name: /View details/i }).first();
    await firstMedCard.click();

    // Verify native dialog header and Quest3+ link
    const modalTitle = page.getByRole('heading', { level: 2 }).first();
    await expect(modalTitle).toBeVisible();

    const questLink = page.getByRole('link', { name: /Quest3\+ BPFK Portal/i }).first();
    await expect(questLink).toBeVisible();
    await expect(questLink).toHaveAttribute('target', '_blank');

    // Close modal
    const closeBtn = page.getByRole('button', { name: /Close medication details/i });
    await closeBtn.click();
    await expect(modalTitle).not.toBeVisible();
  });

  test('toggles theme mode between light and dark', async ({ page }) => {
    await page.getByRole('button', { name: /I Understand & Agree/i }).click();

    const themeToggleBtn = page.getByRole('button', { name: /Switch to/i });
    await themeToggleBtn.click();

    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveClass(/light/);
  });

  test('passes automated WCAG 2.1 AA accessibility audit', async ({ page }) => {
    await page.getByRole('button', { name: /I Understand & Agree/i }).click();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
