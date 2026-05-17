import { expect, test } from "@playwright/test";

test.describe("Search", () => {
  test("search page renders search input", async ({ page }) => {
    await page.goto("/search");
    await expect(page.getByRole("textbox", { name: /search/i })).toBeVisible();
  });
});
