import test from "node:test";
import assert from "node:assert/strict";
import {
  createLead,
  completeMO,
  updateDocuments,
} from "../lib/lead-actions.js";
import { metrics, selectLeads, weeklyActivity } from "../lib/lead-selectors.js";
import { calculateSchedule } from "../lib/installment-service.js";
import { leadSchema, moSchema } from "../lib/validation/schemas.js";
import {
  loadMetadata,
  saveMetadata,
  loadSession,
  DATA_KEY,
  LEGACY_KEY,
  SESSION_KEY,
} from "../lib/storage/metadata.js";
const data = {
  name: "Budi Santoso",
  nik: "0123456789012345",
  phone: "081234567890",
  address: "Jalan Melati nomor 12, Bandung",
};
const financing = {
  incomeMonthly: 5000000,
  incomeAnnual: 60000000,
  financeType: "Kendaraan",
  vehicleType: "Motor",
  tenorMonths: 12,
  otr: 20000000,
  downPayment: 2000000,
};
function memory() {
  const data = new Map();
  return {
    getItem: (k) => data.get(k) || null,
    setItem: (k, v) => data.set(k, v),
    removeItem: (k) => data.delete(k),
  };
}
test("registrasi mempertahankan nol NIK, normalisasi telepon, dan menolak duplikat", () => {
  const lead = createLead(data, []);
  assert.equal(lead.nik, data.nik);
  assert.equal(lead.phone, "+6281234567890");
  assert.throws(() => createLead(data, [lead]), /NIK/);
  assert.equal(leadSchema.safeParse({ ...data, nik: "123" }).success, false);
  assert.equal(leadSchema.safeParse({ ...data, phone: "123" }).success, false);
});
test("MO menolak DP tidak valid tanpa memutasi lead, menerima DP nol", () => {
  const lead = createLead(data, []);
  assert.throws(() =>
    completeMO(lead, { ...financing, downPayment: 20000000 }),
  );
  assert.equal(lead.moCompletedAt, null);
  assert.equal(lead.otr, null);
  assert.equal(
    moSchema.safeParse({ ...financing, downPayment: 0 }).success,
    true,
  );
  assert.equal(
    moSchema.safeParse({ ...financing, incomeMonthly: "-100" }).success,
    false,
  );
});
test("transisi MO, SO, penghapusan dokumen, dan penyelesaian pertama konsisten", () => {
  const t1 = "2026-11-10T05:00:00.000Z",
    t2 = "2026-11-11T05:00:00.000Z";
  const mo = completeMO(createLead(data, []), financing, t1);
  assert.equal(mo.firstMoCompletedAt, t1);
  assert.throws(() =>
    updateDocuments(mo, { house: { id: "a" }, salarySlip: null }, true),
  );
  const so = updateDocuments(
    mo,
    { house: { id: "a" }, salarySlip: { id: "b" } },
    true,
    t1,
  );
  const removed = updateDocuments(
    so,
    { house: null, salarySlip: { id: "b" } },
    false,
    t2,
  );
  assert.equal(removed.soCompletedAt, null);
  assert.equal(removed.firstSoCompletedAt, t1);
  const restored = updateDocuments(
    removed,
    { house: { id: "c" }, salarySlip: { id: "b" } },
    true,
    t2,
  );
  assert.equal(restored.firstSoCompletedAt, t1);
  assert.equal(completeMO(mo, financing, t2).firstMoCompletedAt, t1);
});
test("Semua memasukkan lead selesai, SO hanya melihat lead MO lengkap, dan pencarian dikombinasikan", () => {
  const a = createLead(data, []),
    b = completeMO(
      createLead({ ...data, nik: "2222222222222222", name: "Siti Aminah" }, [
        a,
      ]),
      financing,
    );
  assert.equal(selectLeads([a, b], "MO").length, 2);
  assert.equal(selectLeads([a, b], "MO", "pending").length, 1);
  assert.equal(selectLeads([a, b], "MO", "done", "siti").length, 1);
  assert.equal(selectLeads([a, b], "MO", "pending", "siti").length, 0);
  assert.equal(selectLeads([a, b], "SO").length, 1);
  assert.equal(selectLeads([a, b], "MO", "all", "081234567890").length, 2);
  assert.equal(metrics([a, b], "MO").percent, 50);
  assert.equal(metrics([], "SO").percent, 0);
});
test("angsuran tepat jumlahnya, tenor valid, dan perubahan pembiayaan membatalkan simulasi", () => {
  let lead = completeMO(createLead(data, []), { ...financing, otr: 20000001 });
  const schedule = calculateSchedule(lead);
  assert.equal(
    schedule.installments.reduce((sum, x) => sum + x.amount, 0),
    18000001,
  );
  lead = { ...lead, installmentSchedule: schedule };
  assert.equal(
    completeMO(lead, { ...financing, otr: 21000000 }).installmentSchedule,
    null,
  );
  assert.throws(() => calculateSchedule(createLead(data, [])));
});
test("grafik hanya memakai penyelesaian pertama dan tidak menghitung tanggal migrasi buatan", () => {
  const lead = completeMO(
    createLead(data, []),
    financing,
    "2026-11-10T05:00:00Z",
  );
  const edited = completeMO(lead, financing, "2026-11-11T05:00:00Z");
  assert.equal(
    weeklyActivity([edited], "MO", new Date("2026-11-11T12:00:00Z")).reduce(
      (s, d) => s + d.count,
      0,
    ),
    1,
  );
  assert.equal(
    weeklyActivity([{ ...edited, firstMoCompletedAt: null }], "MO").reduce(
      (s, d) => s + d.count,
      0,
    ),
    0,
  );
});
test("metadata roundtrip, schema rusak aman, dan migrasi tidak mengklaim foto lama tersedia", () => {
  const store = memory();
  const lead = createLead(data, []);
  saveMetadata(store, [lead]);
  assert.deepEqual(loadMetadata(store).leads, [lead]);
  store.setItem(DATA_KEY, "rusak");
  assert.throws(() => loadMetadata(store));
  assert.equal(store.getItem(DATA_KEY), "rusak");
  store.removeItem(DATA_KEY);
  const legacy = JSON.stringify([
    {
      ...data,
      id: "LD-OLD",
      mo: true,
      so: true,
      house: true,
      slip: true,
      income: "5.000.000",
      annual: "60.000.000",
      otr: "20.000.000",
      dp: "2.000.000",
      tenor: "12",
    },
  ]);
  store.setItem(LEGACY_KEY, legacy);
  const migrated = loadMetadata(store);
  assert.equal(migrated.migrated, true);
  assert.equal(migrated.leads[0].soCompletedAt, null);
  assert.equal(migrated.leads[0].documents.house, null);
  assert.equal(migrated.leads[0].firstMoCompletedAt, null);
  assert.equal(store.getItem(LEGACY_KEY), legacy);
});
test("kegagalan penyimpanan tidak dilaporkan berhasil dan sesi invalid tidak digunakan", () => {
  assert.throws(
    () =>
      saveMetadata(
        {
          setItem() {
            throw new Error("quota");
          },
        },
        [],
      ),
    /quota/,
  );
  const store = memory();
  store.setItem(SESSION_KEY, '{"role":"admin"}');
  assert.equal(loadSession(store), null);
});
