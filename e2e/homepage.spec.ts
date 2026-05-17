import { expect, test } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and shows hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Precision Care for Your/i)).toBeVisible();
    await expect(page.getByText(/Book Consultation/i)).toBeVisible();
    await expect(page.getByText(/Explore Articles/i)).toBeVisible();
  });

  test("navigates to appointment page from hero CTA", async ({ page }) => {
    await page.goto("/");
    await page
      .getByText(/Book Consultation/i)
      .first()
      .click();
    await expect(page).toHaveURL(/\/appointment/);
  });

  test("navigates to articles page from hero CTA", async ({ page }) => {
    await page.goto("/");
    await page
      .getByText(/Explore Articles/i)
      .first()
      .click();
    await expect(page).toHaveURL(/\/articles/);
  });
});
