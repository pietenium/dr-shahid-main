import { expect, test } from "@playwright/test";

test.describe("Articles", () => {
  test("loads articles page", async ({ page }) => {
    await page.goto("/articles");
    await expect(page).toHaveURL(/\/articles/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("article detail page shows reading progress bar", async ({ page }) => {
    await page.goto("/articles");
    // Find first article link and click
    const articleLink = page.locator("a[href^='/articles/']").first();
    if (await articleLink.isVisible()) {
      await articleLink.click();
      // Reading progress bar should exist in DOM
      await expect(
        page.locator("[class*='fixed top-0'][class*='h-0.5']"),
      ).toBeAttached();
    }
  });
});
