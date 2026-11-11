import { leadSchema, moSchema } from "./validation/schemas.js";
export function createLead(
  data,
  existing,
  id = crypto.randomUUID(),
  now = new Date().toISOString(),
) {
  const parsed = leadSchema.parse(data);
  if (existing.some((l) => l.nik === parsed.nik))
    throw new Error(
      "NIK tersebut sudah terdaftar. Periksa lead yang sudah ada.",
    );
  return {
    id,
    leadNumber: `LD-${id.replaceAll("-", "").slice(0, 10).toUpperCase()}`,
    ...parsed,
    incomeMonthly: null,
    incomeAnnual: null,
    financeType: "Kendaraan",
    vehicleType: "Motor",
    tenorMonths: 12,
    otr: null,
    downPayment: null,
    moCompletedAt: null,
    soCompletedAt: null,
    firstMoCompletedAt: null,
    firstSoCompletedAt: null,
    documents: { house: null, salarySlip: null },
    installmentSchedule: null,
    createdAt: now,
    updatedAt: now,
  };
}
export function completeMO(lead, data, now = new Date().toISOString()) {
  const parsed = moSchema.parse(data);
  const changed = [
    "financeType",
    "vehicleType",
    "tenorMonths",
    "otr",
    "downPayment",
  ].some((k) => parsed[k] !== lead[k]);
  return {
    ...lead,
    ...parsed,
    moCompletedAt: lead.moCompletedAt || now,
    firstMoCompletedAt:
      lead.firstMoCompletedAt || (lead.moCompletedAt ? null : now),
    updatedAt: now,
    installmentSchedule: changed ? null : lead.installmentSchedule,
  };
}
export function updateDocuments(
  lead,
  documents,
  complete = false,
  now = new Date().toISOString(),
) {
  const ready = documents.house && documents.salarySlip;
  if (complete && !ready)
    throw new Error("Foto rumah dan slip gaji wajib dilengkapi.");
  return {
    ...lead,
    documents,
    soCompletedAt: ready
      ? complete
        ? lead.soCompletedAt || now
        : lead.soCompletedAt
      : null,
    firstSoCompletedAt:
      lead.firstSoCompletedAt || (complete && !lead.soCompletedAt ? now : null),
    updatedAt: now,
  };
}
