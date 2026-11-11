import { test, expect } from "@playwright/test";
test("Home Screen menyediakan manifest standalone, metadata Apple, dan ikon PNG", async ({
  page,
  request,
}) => {
  await page.goto("/login");
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    "href",
    "/manifest.webmanifest",
  );
  await expect(
    page.locator('meta[name="apple-mobile-web-app-capable"]'),
  ).toHaveAttribute("content", "yes");
  await expect(
    page.locator('meta[name="apple-mobile-web-app-title"]'),
  ).toHaveAttribute("content", "SalesFlow");
  const response = await request.get("/manifest.webmanifest");
  expect(response.ok()).toBe(true);
  const manifest = await response.json();
  expect(manifest.display).toBe("standalone");
  expect(manifest.scope).toBe("/");
  expect(manifest.start_url).toBe("/");
  const apple = await page
    .locator('link[rel="apple-touch-icon"]')
    .getAttribute("href");
  for (const url of [...manifest.icons.map((icon) => icon.src), apple]) {
    const icon = await request.get(url);
    expect(icon.ok()).toBe(true);
    expect(icon.headers()["content-type"]).toContain("image/png");
    const bytes = await icon.body();
    expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  }
});
