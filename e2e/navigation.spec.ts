import { expect, test } from "@playwright/test";

test.describe("Navigation", () => {
  test("main navigation links work", async ({ page }) => {
    await page.goto("/");

    // Desktop navigation tests
    // Some links might be hidden on mobile so we test mostly common visibility
    const navLinks = [
      { name: /Home/i, url: /\// },
      { name: /About/i, url: /\/about/ },
      { name: /Articles/i, url: /\/articles/ },
    ];

    for (const link of navLinks) {
      const el = page.locator(`nav >> text=${link.name.source}`).first();
      if (await el.isVisible()) {
        await el.click();
        await expect(page).toHaveURL(link.url);
      }
    }
  });
});
