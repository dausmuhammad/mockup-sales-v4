import { z } from "zod";
import { normalizePhone, numericMoney } from "../formatters.js";
export const sessionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter.")
    .max(100, "Nama maksimal 100 karakter."),
  role: z.enum(["MO", "SO"]),
  branch: z.enum(["Jakarta Selatan", "Bandung", "Surabaya"]),
});
export const leadSchema = z.object({
  nik: z
    .string()
    .trim()
    .regex(/^\d{16}$/, "NIK harus tepat 16 digit."),
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter.")
    .max(100, "Nama maksimal 100 karakter.")
    .regex(/[a-zA-Z\p{L}]/u, "Nama harus berisi huruf."),
  phone: z
    .string()
    .trim()
    .transform(normalizePhone)
    .pipe(
      z
        .string()
        .regex(
          /^\+628\d{8,11}$/,
          "Gunakan nomor 08… atau +628… (10–13 digit lokal).",
        ),
    ),
  address: z
    .string()
    .trim()
    .min(5, "Alamat minimal 5 karakter.")
    .max(500, "Alamat maksimal 500 karakter."),
});
const amount = (allowZero = false) =>
  z.preprocess(
    (v) => (typeof v === "number" ? v : numericMoney(v)),
    z
      .number({ error: "Masukkan nominal yang valid." })
      .int("Gunakan rupiah bulat.")
      .min(
        allowZero ? 0 : 1,
        allowZero
          ? "Nominal tidak boleh negatif."
          : "Nominal harus lebih besar dari nol.",
      )
      .max(1e13, "Nominal terlalu besar."),
  );
export const moSchema = z
  .object({
    incomeMonthly: amount(),
    incomeAnnual: amount(),
    financeType: z.enum(["Kendaraan", "Dana Tunai"]),
    vehicleType: z.enum(["Mobil", "Motor"]),
    tenorMonths: z.coerce
      .number()
      .refine(
        (n) => [12, 24, 36, 48].includes(n),
        "Pilih tenor yang tersedia.",
      ),
    otr: amount(),
    downPayment: amount(true),
  })
  .refine((v) => v.downPayment < v.otr, {
    path: ["downPayment"],
    message: "DP harus lebih kecil dari harga OTR.",
  });
export async function validatePhoto(file) {
  if (!file || !["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("Gunakan file JPG, PNG, atau WebP.");
  if (file.size > 5 * 1024 * 1024)
    throw new Error("Ukuran foto maksimal 5 MB.");
  if (!file.size) throw new Error("File gambar kosong.");
  try {
    const bitmap = await createImageBitmap(file);
    bitmap.close();
  } catch {
    throw new Error(
      "File tidak dapat dibaca sebagai gambar. Pilih foto yang valid.",
    );
  }
}
