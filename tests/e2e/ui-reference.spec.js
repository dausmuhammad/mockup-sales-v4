import { test, expect } from "@playwright/test";
import fs from "node:fs";
const reference = fs.readFileSync(
  "SalesFlow_Mobile_Mockup_MO_Dashboard_v4.html",
  "utf8",
);
test("audit tema referensi: palet, default terang, header, field, dan responsive", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() =>
    localStorage.setItem("salesflow-theme", "dark"),
  );
  await page.goto("/login");
  await expect(page.locator("html")).toHaveClass(/light/);
  const pairs = {
    "--background": "--bg",
    "--foreground": "--ink",
    "--primary": "--blue",
    "--muted-foreground": "--muted",
    "--border": "--line",
  };
  for (const [token, original] of Object.entries(pairs)) {
    const expected = reference.match(
      new RegExp(original + ":(#[a-fA-F0-9]+)"),
    )[1];
    expect(
      await page.evaluate(
        (name) =>
          getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim(),
        token,
      ),
    ).toBe(expected);
  }
  await page.getByRole("button", { name: "Masuk ke aplikasi" }).click();
  await expect(page.locator("#main-content")).toBeVisible();
  await expect(page.locator("[data-sonner-toast]")).toHaveCount(0, {
    timeout: 10000,
  });
  expect(
    await page
      .locator("header")
      .evaluate((el) => getComputedStyle(el).backgroundImage),
  ).toBe("linear-gradient(145deg, rgb(16, 27, 61), rgb(29, 52, 112))");
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.locator("header")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/reference-theme-${width}.png`,
      fullPage: true,
    });
  }
  await page.goto("/leads/new");
  await expect(page.locator("input#nik")).toBeVisible();
  await expect(page.locator("select:visible")).toHaveCount(0);
  await page.getByLabel("Nama sesuai KTP").focus();
  expect(
    await page
      .getByLabel("Nama sesuai KTP")
      .evaluate((el) => getComputedStyle(el).boxShadow),
  ).not.toBe("none");
  // Capture the original reference on the same viewport for visual comparison.
  await page.setViewportSize({ width: 390, height: 900 });
  await page.setContent(reference);
  await page.getByRole("button", { name: "Masuk ke aplikasi" }).click();
  await page.screenshot({
    path: "test-results/original-html-390.png",
    fullPage: true,
  });
});
