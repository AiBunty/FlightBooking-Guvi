import { expect, test } from "@playwright/test";

test("homepage and sign in page load", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Search and book flights with confidence")).toBeVisible();

  await page.goto("/auth/sign-in");
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
});
