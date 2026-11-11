import { test, expect } from "@playwright/test";
async function choice(page, id, label) {
  await page.locator(`#${id}`).click();
  await page.getByRole("option", { name: label, exact: true }).click();
}
async function login(page, role = "Marketing Officer") {
  await page.goto("/login");
  await page.getByLabel("Nama pengguna").fill("Andi Bandung");
  await choice(page, "role", role);
  await choice(page, "branch", "Bandung");
  await page.getByRole("button", { name: "Masuk ke aplikasi" }).click();
  await expect(page.getByRole("heading", { name: /Selamat/ })).toBeVisible();
}
async function register(page, name, nik) {
  await page.goto("/leads/new");
  await page.getByLabel("NIK / Nomor KTP").fill(nik);
  await page.getByLabel("Nama sesuai KTP").fill(name);
  await page.getByLabel("Nomor telepon").fill("081234567890");
  await page.getByLabel("Alamat sesuai KTP").fill("Jalan Melati 12, Bandung");
  await page.getByRole("button", { name: "Simpan data awal" }).click();
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: `${name} berhasil didaftarkan` }),
  ).toBeVisible();
}
test("alur MO → SO, validasi, persistensi foto, responsif, tema, dan reset", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await login(page);
  const png = Buffer.from(
    await page.evaluate(() => {
      const canvas = document.createElement("canvas");
      canvas.width = 320;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#edf1ff";
      ctx.fillRect(0, 0, 320, 200);
      ctx.fillStyle = "#4169f5";
      ctx.font = "20px sans-serif";
      ctx.fillText("Dokumen simulasi", 60, 105);
      return canvas.toDataURL("image/png").split(",")[1];
    }),
    "base64",
  );
  await expect(
    page.getByText("Bandung", { exact: true }).first(),
  ).toBeVisible();
  await page.goto("/leads/new");
  await page.getByRole("button", { name: "Simpan data awal" }).click();
  await expect(page.getByText("NIK harus tepat 16 digit.")).toBeVisible();
  await register(page, "Budi Santoso", "0123456789012345");
  await register(page, "Siti Aminah", "2222222222222222");
  await page.getByLabel("NIK / Nomor KTP").fill("0123456789012345");
  await page.getByLabel("Nama sesuai KTP").fill("Duplikat");
  await page.getByLabel("Nomor telepon").fill("081234567890");
  await page.getByLabel("Alamat sesuai KTP").fill("Jalan Melati 12, Bandung");
  await page.getByRole("button", { name: "Simpan data awal" }).click();
  await expect(
    page.getByText(/NIK tersebut sudah terdaftar/).first(),
  ).toBeVisible();
  // Internal navigation must guard unsaved changes.
  await page.getByRole("link", { name: "Kembali", exact: true }).click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await page.getByRole("button", { name: "Tetap mengisi" }).click();
  await expect(page.getByLabel("Nama sesuai KTP")).toHaveValue("Duplikat");
  await page.getByRole("link", { name: "Kembali", exact: true }).click();
  await page.getByRole("button", { name: "Tinggalkan", exact: true }).click();
  await page
    .getByRole("link")
    .filter({ hasText: "Budi Santoso" })
    .first()
    .click();
  await expect(page).toHaveURL(/\/leads\/[^/]+$/);
  const detailUrl = page.url();
  await page.getByRole("link", { name: "Lengkapi data MO" }).click();
  await page.getByLabel("Pendapatan per bulan").fill("5000000");
  await page.getByLabel("Pendapatan per tahun").fill("60000000");
  await page.getByLabel("Harga OTR").fill("20000001");
  await page.getByLabel("DP / uang muka").fill("22000000");
  await page
    .getByRole("button", { name: "Simpan & teruskan ke Surveyor" })
    .click();
  await expect(
    page.getByText("DP harus lebih kecil dari harga OTR."),
  ).toBeVisible();
  await page.getByLabel("DP / uang muka").fill("2000000");
  await page
    .getByRole("button", { name: "Simpan & teruskan ke Surveyor" })
    .click();
  await expect(page).toHaveURL(detailUrl);
  await page.getByRole("button", { name: "Buat jadwal angsuran" }).click();
  await expect(page.getByText("Estimasi angsuran per bulan")).toBeVisible();
  await expect(page.getByText(/1.500.000/).first()).toBeVisible();
  await page.goto("/tasks");
  await expect(
    page.getByRole("link").filter({ hasText: "Budi Santoso" }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("link").filter({ hasText: "Siti Aminah" }).first(),
  ).toBeVisible();
  await page.getByLabel("Cari lead").fill("budi");
  await page.getByRole("tab", { name: /Belum lengkap/ }).click();
  await expect(page.getByText("Pencarian tidak ditemukan")).toBeVisible();
  await page.getByRole("tab", { name: /Selesai/ }).click();
  await expect(
    page.getByRole("link").filter({ hasText: "Budi Santoso" }).first(),
  ).toBeVisible();
  // MO finance edits invalidate the old schedule.
  await page.goto(`${detailUrl}/mo`);
  await page.getByLabel("Harga OTR").fill("21000000");
  await page
    .getByRole("button", { name: "Simpan & teruskan ke Surveyor" })
    .click();
  await expect(
    page.getByRole("button", { name: "Buat jadwal angsuran", exact: true }),
  ).toBeVisible();
  await page.goto("/profile");
  await page.getByRole("button", { name: "Keluar dari akun" }).click();
  await login(page, "Surveyor Officer");
  await page.goto("/tasks");
  await expect(
    page.getByRole("link").filter({ hasText: "Budi Santoso" }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("link").filter({ hasText: "Siti Aminah" }),
  ).toHaveCount(0);
  await page.goto("/leads/new");
  await expect(
    page.getByRole("heading", { name: "Registrasi hanya tersedia untuk MO" }),
  ).toBeVisible();
  await page.goto(`${detailUrl}/mo`);
  await expect(
    page.getByRole("heading", { name: "Form hanya tersedia untuk MO" }),
  ).toBeVisible();
  await page.goto(`${detailUrl}/survey`);
  await page
    .getByRole("button", { name: "Simpan & selesaikan survei" })
    .click();
  await expect(
    page.getByText(
      "Kedua file foto wajib tersedia. Unggah kembali dokumen yang hilang.",
    ),
  ).toBeVisible();
  const inputs = page.locator("input[type=file]:not([capture])");
  await inputs.nth(0).setInputFiles({
    name: "invalid.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("invalid"),
  });
  await expect(
    page.getByText("Gunakan file JPG, PNG, atau WebP.").first(),
  ).toBeVisible();
  await inputs
    .nth(0)
    .setInputFiles({ name: "rumah.png", mimeType: "image/png", buffer: png });
  await expect(page.getByText("rumah.png", { exact: true })).toBeVisible();
  await inputs
    .nth(1)
    .setInputFiles({ name: "slip.png", mimeType: "image/png", buffer: png });
  await expect(page.getByText("slip.png", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Simpan & selesaikan survei" })
    .click();
  await expect(page).toHaveURL(detailUrl);
  await page.reload();
  await expect(
    page.getByRole("img", { name: "Foto rumah", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Foto slip gaji", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Lihat / ubah dokumen" }),
  ).toBeVisible();
  await page.goto("/performance");
  await expect(page.getByText("1 penyelesaian", { exact: true })).toBeVisible();
  // Responsive verification on real completed data.
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/tasks",
      new URL(detailUrl).pathname,
      "/profile",
      "/performance",
    ]) {
      await page.goto(route);
      await expect(page.locator("#main-content")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `overflow ${route} ${width}`,
      ).toBe(true);
      if (route === "/")
        await page.screenshot({
          path: `test-results/dashboard-${width}.png`,
          fullPage: true,
        });
    }
    await page.screenshot({
      path: `test-results/responsive-${width}.png`,
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${detailUrl}/survey`);
  await page
    .getByRole("button", { name: "Hapus Foto rumah", exact: true })
    .click();
  await page.getByRole("button", { name: "Hapus foto", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Perbesar Foto rumah" }),
  ).toHaveCount(0);
  await page.goto(detailUrl);
  await expect(
    page.getByRole("link", { name: "Lengkapi dokumen survei" }),
  ).toBeVisible();
  await page.goto("/profile");
  await page.getByRole("button", { name: /Preferensi aplikasi/ }).click();
  await choice(page, "theme", "Gelap");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Tutup", exact: true }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Pusat bantuan" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto("/leads/missing");
  await expect(
    page.getByRole("heading", { name: "Lead tidak ditemukan" }),
  ).toBeVisible();
  await page.goto("/profile");
  await page.getByRole("button", { name: "Reset data demo" }).click();
  await page.getByRole("button", { name: "Batal", exact: true }).click();
  await page.goto("/tasks");
  await expect(
    page.getByRole("link").filter({ hasText: "Budi Santoso" }).first(),
  ).toBeVisible();
  await page.goto("/profile");
  await page.getByRole("button", { name: "Reset data demo" }).click();
  await page.getByRole("button", { name: "Ya, hapus data" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await login(page);
  await expect(
    page.getByRole("heading", { name: "Belum ada pekerjaan" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
