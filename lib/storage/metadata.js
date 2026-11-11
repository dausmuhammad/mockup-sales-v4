import { sessionSchema } from "../validation/schemas.js";
import { z } from "zod";
export const DATA_KEY = "salesflow:data:v1",
  SESSION_KEY = "salesflow:session:v1",
  LEGACY_KEY = "tripleX_salesflow_demo_v3";
const positiveOrNull = (v) => {
  const n = Number(String(v ?? "").replace(/\D/g, ""));
  return n > 0 ? n : null;
};
const timestamp = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)));
const amount = z.number().int().min(0).max(1e13);
const photo = z
  .object({
    id: z.string().min(1),
    name: z.string(),
    size: z
      .number()
      .min(1)
      .max(5 * 1024 * 1024),
    type: z.enum(["image/jpeg", "image/png", "image/webp"]),
  })
  .nullable();
const storedLead = z.object({
  id: z.string().min(1),
  leadNumber: z.string(),
  name: z.string(),
  nik: z.string(),
  phone: z.string(),
  address: z.string(),
  incomeMonthly: amount.nullable(),
  incomeAnnual: amount.nullable(),
  otr: amount.nullable(),
  downPayment: amount.nullable(),
  financeType: z.enum(["Kendaraan", "Dana Tunai"]),
  vehicleType: z.enum(["Mobil", "Motor"]),
  tenorMonths: z.union([
    z.literal(12),
    z.literal(24),
    z.literal(36),
    z.literal(48),
  ]),
  moCompletedAt: timestamp.nullable(),
  soCompletedAt: timestamp.nullable(),
  firstMoCompletedAt: timestamp.nullable(),
  firstSoCompletedAt: timestamp.nullable(),
  documents: z.object({ house: photo, salarySlip: photo }),
  createdAt: timestamp,
  updatedAt: timestamp,
  installmentSchedule: z
    .object({
      principal: amount,
      monthly: amount,
      tenorMonths: z.number().int().positive(),
      otr: amount,
      downPayment: amount,
      createdAt: timestamp,
      installments: z.array(
        z.object({ number: z.number().int().positive(), amount }),
      ),
    })
    .nullable(),
});
function validLead(lead) {
  return storedLead.safeParse(lead).success;
}
export function loadMetadata(storage) {
  const raw = storage.getItem(DATA_KEY);
  if (raw) {
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error(
        "Data lokal tidak dapat dibaca. Reset data demo untuk memulai kembali.",
      );
    }
    if (
      !parsed ||
      parsed.version !== 1 ||
      !Array.isArray(parsed.leads) ||
      !parsed.leads.every(validLead)
    )
      throw new Error(
        "Format data lokal tidak sesuai. Data asli tidak diubah; gunakan reset demo untuk memulai kembali.",
      );
    return { leads: parsed.leads, migrated: false };
  }
  const legacy = storage.getItem(LEGACY_KEY);
  if (!legacy) return { leads: [], migrated: false };
  let old;
  try {
    old = JSON.parse(legacy);
  } catch {
    throw new Error("Data demo lama rusak. Reset data untuk melanjutkan.");
  }
  if (!Array.isArray(old)) throw new Error("Data demo lama tidak valid.");
  const now = new Date().toISOString();
  const leads = old
    .filter((l) => l && typeof l.name === "string")
    .map((l) => ({
      id: crypto.randomUUID(),
      leadNumber: String(l.id || "LD-MIGRASI"),
      name: l.name,
      nik: String(l.nik || ""),
      phone: String(l.phone || ""),
      address: String(l.address || ""),
      incomeMonthly: positiveOrNull(l.income),
      incomeAnnual: positiveOrNull(l.annual),
      financeType: l.finance === "Dana Tunai" ? "Dana Tunai" : "Kendaraan",
      vehicleType: l.vehicle === "Mobil" ? "Mobil" : "Motor",
      tenorMonths: [12, 24, 36, 48].includes(Number(l.tenor))
        ? Number(l.tenor)
        : 12,
      otr: positiveOrNull(l.otr),
      downPayment: positiveOrNull(l.dp) ?? 0,
      moCompletedAt: l.mo ? now : null,
      soCompletedAt: null,
      firstMoCompletedAt: null,
      firstSoCompletedAt: null,
      documents: { house: null, salarySlip: null },
      installmentSchedule: null,
      createdAt: now,
      updatedAt: now,
      migrated: true,
    }));
  saveMetadata(storage, leads);
  return { leads, migrated: true };
}
export function saveMetadata(storage, leads) {
  storage.setItem(DATA_KEY, JSON.stringify({ version: 1, leads }));
}
export function loadSession(storage) {
  const raw = storage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const result = sessionSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
