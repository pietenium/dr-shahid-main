import { expect, test } from "@playwright/test";

test.describe("Contact Form", () => {
  test("loads contact page with form", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByLabel(/Full Name/i)).toBeVisible();
    await expect(page.getByLabel(/Email Address/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /send message/i }),
    ).toBeVisible();
  });

  test("validates required fields", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(
      page.getByText(/Name must be at least 2 characters/i),
    ).toBeVisible();
    await expect(page.getByText(/Invalid email address/i)).toBeVisible();
  });
});
