import { test, expect } from "@playwright/test";
test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
test("Beranda mobile: tinggi stabil dan navigasi tetap terlihat saat scroll dan viewport berubah", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Masuk ke aplikasi" }).click();
  const nav = page.getByRole("navigation", { name: "Navigasi seluler" });
  await expect(nav).toBeVisible();
  for (const height of [844, 700, 844, 600, 390, 844]) {
    await page.setViewportSize({ width: 390, height });
    const scroll = page.locator("[data-workspace-scroll]");
    await expect(scroll).toBeVisible();
    const initial = await scroll.evaluate((el) => el.scrollHeight);
    for (let i = 0; i < 5; i++) {
      await scroll.evaluate((el) => el.scrollTo(0, el.scrollHeight));
      await page.waitForTimeout(80);
      expect(await scroll.evaluate((el) => el.scrollHeight)).toBe(initial);
      const bounds = await nav.boundingBox();
      expect(bounds.y).toBeGreaterThanOrEqual(0);
      expect(Math.round(bounds.y + bounds.height)).toBeLessThanOrEqual(height);
      expect(
        await nav.evaluate((el) => {
          const r = el.getBoundingClientRect();
          return el.contains(
            document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2),
          );
        }),
      ).toBe(true);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollHeight),
    ).toBeLessThanOrEqual(height);
  }
  await nav.getByRole("link", { name: "To Do List" }).click();
  await expect(
    page.getByRole("heading", { name: "MO To Do List" }),
  ).toBeVisible();
  await nav.getByRole("link", { name: "Beranda" }).click();
  await expect(nav).toBeVisible();
});
