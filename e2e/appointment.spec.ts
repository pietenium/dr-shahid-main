import { expect, test } from "@playwright/test";

test.describe("Appointment Form", () => {
  test("shows multi-step form with 3 steps", async ({ page }) => {
    await page.goto("/appointment");
    await expect(page.getByText(/Who is the patient\?/i)).toBeVisible();
  });

  test("shows validation error on empty submit at step 1", async ({ page }) => {
    await page.goto("/appointment");
    await page.getByText(/Continue/i).click();
    await expect(page.getByText(/Name is required/i)).toBeVisible();
  });

  test("shows phone format error for invalid input", async ({ page }) => {
    await page.goto("/appointment");
    await page.getByLabel(/Patient Name/i).fill("John Doe");
    await page.getByLabel(/Phone Number/i).fill("12345");
    await page.getByText(/Continue/i).click();
    await expect(
      page.getByText(/Invalid Bangladesh phone format/i),
    ).toBeVisible();
  });
});
